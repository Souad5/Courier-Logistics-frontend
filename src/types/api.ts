import type {
  AuditLog,
  DashboardStats,
  Hub,
  Parcel,
  ParcelTracking,
  Payment,
  User,
} from "./entities";
import type { ParcelStatus, ParcelType, Role } from "./enums";

// ── Response envelope (courier-backend/src/app/utils/sendResponse.ts) ──

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  meta?: PaginationMeta;
  data: T;
}

export interface ApiFieldError {
  path: string;
  message: string;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors: ApiFieldError[];
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

/** What the api client resolves to: the envelope minus `success`. */
export interface ApiResult<T> {
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ListQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

// ── Request bodies (mirror the backend Zod schemas) ──

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: Extract<Role, "CUSTOMER" | "COURIER">;
}

export interface CreateParcelInput {
  type: ParcelType;
  weightKg: number;
  dimensions?: string;
  originHubId: string;
  destinationHubId: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderCity?: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverCity?: string;
  notes?: string;
}

export interface AssignParcelInput {
  courierId: string;
  destinationHubId?: string;
}

export interface UpdateParcelStatusInput {
  status: ParcelStatus;
  location?: string;
  note?: string;
}

export type HubInput = Omit<Hub, "id" | "createdAt" | "updatedAt" | "city" | "lat" | "lng"> & {
  city?: string;
  lat?: number;
  lng?: number;
};

export interface InitiatePaymentInput {
  parcelId: string;
  successUrl?: string;
  cancelUrl?: string;
}

// ── Response `data` payloads ──

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthPayload {
  user: User;
  tokens: AuthTokens;
}

export interface InitiatePaymentPayload {
  checkoutUrl: string;
  sessionId: string;
  payment: Payment;
}

export type UserPayload = { user: User };
export type UsersPayload = { users: User[] };
export type HubPayload = { hub: Hub };
export type HubsPayload = { hubs: Hub[] };
export type ParcelPayload = { parcel: Parcel };
export type ParcelsPayload = { parcels: Parcel[] };
export type TrackingPayload = ParcelTracking;
export type PaymentPayload = { payment: Payment };
export type StatsPayload = { stats: DashboardStats };
export type AuditLogsPayload = { logs: AuditLog[] };

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}
