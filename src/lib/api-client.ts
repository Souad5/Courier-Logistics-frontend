import { API_BASE_URL, ENDPOINTS } from "@/config/api.config";
import type { ApiFieldError, ApiResponse, ApiResult } from "@/types";

import { authStorage } from "./auth-storage";

export class ApiClientError extends Error {
  readonly status: number;
  readonly errors: ApiFieldError[];

  constructor(status: number, message: string, errors: ApiFieldError[] = []) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.errors = errors;
  }
}

type QueryValue = string | number | boolean | null | undefined;

export interface RequestOptions extends Omit<RequestInit, "body"> {
  query?: Record<string, QueryValue>;
  body?: unknown;
  /** Skip the Bearer header and 401 refresh handling (auth endpoints, public reads). */
  public?: boolean;
}

const AUTH_PATHS: string[] = [
  ENDPOINTS.auth.login,
  ENDPOINTS.auth.register,
  ENDPOINTS.auth.googleLogin,
  ENDPOINTS.auth.refreshToken,
  ENDPOINTS.auth.logout,
];

/** Listeners (the auth store) are told when the session is gone for good. */
const sessionExpiredListeners = new Set<() => void>();
export function onSessionExpired(listener: () => void): () => void {
  sessionExpiredListeners.add(listener);
  return () => sessionExpiredListeners.delete(listener);
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function parseBody<T>(response: Response): Promise<ApiResponse<T> | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as ApiResponse<T>;
  } catch {
    return null;
  }
}

/**
 * The backend's auth rate limiter allows only 20 requests / 15 min, so every
 * concurrent 401 waits on the same in-flight refresh instead of starting its own.
 */
let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) return Promise.resolve(null);

  refreshPromise ??= (async () => {
    try {
      const response = await fetch(buildUrl(ENDPOINTS.auth.refreshToken), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      const body = await parseBody<{ accessToken: string }>(response);
      if (!response.ok || !body?.success) return null;
      authStorage.setAccessToken(body.data.accessToken);
      return body.data.accessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function expireSession(): void {
  authStorage.clear();
  for (const listener of sessionExpiredListeners) listener();
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    // A full reload (not router.push) is intentional: it drops all in-memory
    // query/store state belonging to the expired session.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`/login?redirect=${redirect}`);
  }
}

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
  isRetry = false,
): Promise<ApiResult<T>> {
  const { query, body, public: isPublic, headers, ...init } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (body !== undefined && !isFormData) requestHeaders.set("Content-Type", "application/json");

  const token = isPublic ? undefined : authStorage.getAccessToken();
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      ...init,
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiClientError(0, "Unable to reach the server. Is the API running?");
  }

  if (response.status === 401 && !isPublic && !AUTH_PATHS.includes(path)) {
    if (!isRetry && (await refreshAccessToken())) {
      return request<T>(method, path, options, true);
    }
    expireSession();
  }

  const payload = await parseBody<T>(response);

  if (!response.ok || !payload || !payload.success) {
    throw new ApiClientError(
      response.status,
      payload?.message ?? `Request failed with status ${response.status}.`,
      payload && !payload.success ? (payload.errors ?? []) : [],
    );
  }

  return { message: payload.message, data: payload.data, meta: payload.meta };
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>("DELETE", path, options),
  /** multipart/form-data upload (e.g. proof-of-delivery photo). */
  upload: <T>(path: string, formData: FormData, options?: RequestOptions) =>
    request<T>("POST", path, { ...options, body: formData }),
};

/** Extracts a user-facing message from anything thrown by a query/mutation. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.errors.length ? error.errors.map((e) => e.message).join(", ") : error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
}
