import type {
  AuditAction,
  ParcelStatus,
  ParcelType,
  PaymentStatus,
  Role,
  UserStatus,
} from "@/types/enums";

/** Display labels for backend enums; use these instead of humanize(). */
export const enums: {
  parcelStatus: Record<ParcelStatus, string>;
  paymentStatus: Record<PaymentStatus, string>;
  parcelType: Record<ParcelType, string>;
  role: Record<Role, string>;
  userStatus: Record<UserStatus, string>;
  auditAction: Record<AuditAction, string>;
  entityType: Record<string, string>;
  /** Keyed by PRICING.zones[].code. */
  zone: Record<string, string>;
} = {
  parcelStatus: {
    PENDING: "Pending",
    ACCEPTED: "Accepted",
    PICKED_UP: "Picked up",
    IN_TRANSIT: "In transit",
    OUT_FOR_DELIVERY: "Out for delivery",
    DELIVERY_FAILED: "Delivery failed",
    DELIVERED: "Delivered",
    RETURN_TO_SENDER: "Return to sender",
    RETURNED: "Returned",
    CANCELLED: "Cancelled",
  },
  paymentStatus: {
    PENDING: "Pending",
    PAID: "Paid",
    FAILED: "Failed",
    REFUNDED: "Refunded",
    CANCELED: "Cancelled",
  },
  parcelType: {
    DOCUMENT: "Document",
    PARCEL: "Parcel",
    FRAGILE: "Fragile",
    PERISHABLE: "Perishable",
  },
  role: { CUSTOMER: "Customer", COURIER: "Courier", ADMIN: "Admin" },
  userStatus: { ACTIVE: "Active", SUSPENDED: "Suspended", BANNED: "Banned" },
  auditAction: {
    REGISTER: "Register",
    LOGIN: "Login",
    GOOGLE_LOGIN: "Google login",
    LOGOUT: "Logout",
    ROLE_CHANGED: "Role changed",
    PARCEL_CREATED: "Parcel created",
    PARCEL_STATUS_CHANGED: "Parcel status changed",
    PARCEL_ASSIGNED: "Parcel assigned",
    PARCEL_DELETED: "Parcel deleted",
    PARCEL_PROOF_OF_DELIVERY_UPLOADED: "Proof of delivery uploaded",
    PAYMENT_CREATED: "Payment created",
    PAYMENT_VERIFIED: "Payment verified",
    PAYMENT_FAILED: "Payment failed",
    HUB_CREATED: "Hub created",
    HUB_UPDATED: "Hub updated",
    HUB_DELETED: "Hub deleted",
  },
  entityType: { Parcel: "Parcel", Payment: "Payment", User: "User", Hub: "Hub" },
  zone: {
    "inner-city": "Inner city",
    city: "City",
    suburb: "Suburb",
    outer: "Outer",
    "inter-city": "Inter-city",
    remote: "Remote",
  },
};
