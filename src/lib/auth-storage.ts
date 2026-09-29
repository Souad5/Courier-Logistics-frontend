import { decodeJwt } from "jose";
import Cookies from "js-cookie";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/config/api.config";
import { ROLES, type Role } from "@/types";

/**
 * Tokens live in first-party, JS-readable cookies so that proxy.ts can read
 * the role on navigation and the api client can attach the Bearer header.
 * The backend verifies every token; nothing here is trusted for security.
 */

const REFRESH_TOKEN_DAYS = 30; // matches backend JWT_REFRESH_EXPIRES_IN default

const cookieOptions: Cookies.CookieAttributes = {
  sameSite: "lax",
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
  path: "/",
};

export interface AccessTokenClaims {
  userId: string;
  email: string;
  role: Role;
  exp?: number;
}

/** Decodes (does NOT verify) an access token. Returns null if malformed. */
export function decodeAccessToken(token: string | undefined | null): AccessTokenClaims | null {
  if (!token) return null;
  try {
    const claims = decodeJwt(token);
    const role = claims.role as Role;
    if (typeof claims.userId !== "string" || !ROLES.includes(role)) return null;
    return { userId: claims.userId, email: String(claims.email ?? ""), role, exp: claims.exp };
  } catch {
    return null;
  }
}

export function isTokenExpired(claims: AccessTokenClaims | null): boolean {
  return !claims?.exp || claims.exp * 1000 <= Date.now();
}

export const authStorage = {
  getAccessToken: () => Cookies.get(ACCESS_TOKEN_COOKIE),
  getRefreshToken: () => Cookies.get(REFRESH_TOKEN_COOKIE),

  /**
   * The access cookie deliberately outlives the JWT inside it: an expired token
   * still tells proxy.ts the user's role, and the api client swaps it for a
   * fresh one on the first 401 using the refresh token.
   */
  setAccessToken(token: string) {
    Cookies.set(ACCESS_TOKEN_COOKIE, token, { ...cookieOptions, expires: REFRESH_TOKEN_DAYS });
  },

  setTokens(tokens: { accessToken: string; refreshToken: string }) {
    authStorage.setAccessToken(tokens.accessToken);
    Cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      ...cookieOptions,
      expires: REFRESH_TOKEN_DAYS,
    });
  },

  clear() {
    Cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" });
    Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
  },

  getRole: (): Role | null => decodeAccessToken(authStorage.getAccessToken())?.role ?? null,
};
