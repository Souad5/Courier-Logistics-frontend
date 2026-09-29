import { env } from "@/env";
import type { Role } from "@/types";

export const API_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, "");

/** Every courier-backend route, relative to API_BASE_URL (/api/v1). */
export const ENDPOINTS = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    googleLogin: "/auth/google-login",
    refreshToken: "/auth/refresh-token",
    logout: "/auth/logout",
  },
  users: {
    me: "/users/me",
    myAvailability: "/users/me/availability",
    list: "/users",
    role: (id: string) => `/users/${id}/role`,
  },
  hubs: {
    list: "/hubs",
    create: "/hubs",
    byId: (id: string) => `/hubs/${id}`,
  },
  parcels: {
    list: "/parcels",
    create: "/parcels",
    mine: "/parcels/my-parcels",
    byId: (id: string) => `/parcels/${id}`,
    track: (trackingNumber: string) => `/parcels/track/${encodeURIComponent(trackingNumber)}`,
    assign: (id: string) => `/parcels/${id}/assign`,
    status: (id: string) => `/parcels/${id}/status`,
    proofOfDelivery: (id: string) => `/parcels/${id}/proof-of-delivery`,
  },
  payments: {
    initiate: "/payments/initiate",
    byId: (id: string) => `/payments/${id}`,
  },
  admin: {
    stats: "/admin/dashboard-stats",
    auditLogs: "/admin/audit-logs",
  },
} as const;

/** Landing route for each role after login, and the prefix proxy.ts guards. */
export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  CUSTOMER: "/customer",
  COURIER: "/courier",
};

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";
