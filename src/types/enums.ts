// Mirrors the enums in courier-backend/prisma/schema.prisma.

export const ROLES = ["CUSTOMER", "COURIER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const USER_STATUSES = ["ACTIVE", "SUSPENDED", "BANNED"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export type AuthProvider = "LOCAL" | "GOOGLE";

export const PARCEL_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERY_FAILED",
  "DELIVERED",
  "RETURN_TO_SENDER",
  "RETURNED",
  "CANCELLED",
] as const;
export type ParcelStatus = (typeof PARCEL_STATUSES)[number];

export const PARCEL_TYPES = ["DOCUMENT", "PARCEL", "FRAGILE", "PERISHABLE"] as const;
export type ParcelType = (typeof PARCEL_TYPES)[number];

export const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED", "CANCELED"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const AUDIT_ACTIONS = [
  "REGISTER",
  "LOGIN",
  "GOOGLE_LOGIN",
  "LOGOUT",
  "ROLE_CHANGED",
  "PARCEL_CREATED",
  "PARCEL_STATUS_CHANGED",
  "PARCEL_ASSIGNED",
  "PARCEL_DELETED",
  "PARCEL_PROOF_OF_DELIVERY_UPLOADED",
  "PAYMENT_CREATED",
  "PAYMENT_VERIFIED",
  "PAYMENT_FAILED",
  "HUB_CREATED",
  "HUB_UPDATED",
  "HUB_DELETED",
] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];

/**
 * Courier/admin status transitions, copied from ALLOWED_TRANSITIONS in
 * courier-backend/src/app/modules/parcel/parcel.service.ts. The backend is the
 * authority; this only drives which options the UI offers.
 */
export const ALLOWED_TRANSITIONS: Record<ParcelStatus, ParcelStatus[]> = {
  PENDING: ["CANCELLED"],
  ACCEPTED: ["PICKED_UP", "CANCELLED"],
  PICKED_UP: ["IN_TRANSIT", "CANCELLED"],
  IN_TRANSIT: ["OUT_FOR_DELIVERY", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "DELIVERY_FAILED"],
  DELIVERY_FAILED: ["OUT_FOR_DELIVERY", "RETURN_TO_SENDER"],
  RETURN_TO_SENDER: ["RETURNED"],
  DELIVERED: [],
  RETURNED: [],
  CANCELLED: [],
};
