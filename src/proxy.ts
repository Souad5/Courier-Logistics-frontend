import { decodeJwt } from "jose";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Role-based route guard (Next 16 "proxy", formerly middleware).
 *
 * The JWT is only DECODED here — the signing secret lives on the backend, which
 * re-verifies the token and role on every API call. This guard is for UX:
 * sending users to /login or to their own dashboard before a page renders.
 *
 * Constants are inlined rather than imported from src/config so this file stays
 * free of client-only modules (env parsing, js-cookie).
 */

type Role = "ADMIN" | "CUSTOMER" | "COURIER";

const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  CUSTOMER: "/customer",
  COURIER: "/courier",
};

const PROTECTED_PREFIXES = Object.entries(ROLE_HOME) as Array<[Role, string]>;
const AUTH_PAGES = ["/login", "/register"];

function getRole(request: NextRequest): Role | null {
  const accessToken = request.cookies.get("accessToken")?.value;
  if (!accessToken) return null;

  try {
    const { role, exp } = decodeJwt(accessToken);
    if (!(typeof role === "string" && role in ROLE_HOME)) return null;
    // An expired access token is fine as long as a refresh token exists — the
    // api client will renew it on the first 401.
    const expired = !exp || exp * 1000 <= Date.now();
    if (expired && !request.cookies.has("refreshToken")) return null;
    return role as Role;
  } catch {
    return null;
  }
}

const matchesPrefix = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const role = getRole(request);

  const requiredRole = PROTECTED_PREFIXES.find(([, prefix]) => matchesPrefix(pathname, prefix))?.[0];

  if (requiredRole) {
    if (!role) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname + search);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("accessToken");
      return response;
    }
    if (role !== requiredRole) {
      return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
    }
    return NextResponse.next();
  }

  if (role && AUTH_PAGES.some((page) => matchesPrefix(pathname, page))) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*", "/courier/:path*", "/login", "/register"],
};
