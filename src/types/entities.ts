import type {
  AuditAction,
  AuthProvider,
  ParcelStatus,
  ParcelType,
  PaymentStatus,
  Role,
  UserStatus,
} from "./enums";

// Dates arrive as ISO strings; Prisma Decimals (fee, amount) arrive as strings.
type ISODate = string;
type DecimalString = string;

/** Shape returned by auth endpoints and /users/me (sanitized — no password). */
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatarUrl: string | null;
  role: Role;
  status: UserStatus;
  provider: AuthProvider;
  isEmailVerified: boolean;
  isAvailable?: boolean;
  rating?: number;
  totalDeliveries?: number;
  createdAt: ISODate;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface Hub {
  id: string;
  name: string;
  code: string;
  zoneCode: string;
  zoneName: string;
  address: string;
  city: string | null;
  lat: number | null;
  lng: number | null;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type HubSummary = Pick<Hub, "id" | "name" | "code" | "zoneCode" | "zoneName">;

export interface ParcelStatusHistory {
  id: string;
  status: ParcelStatus;
  fromStatus: ParcelStatus | null;
  location: string | null;
  note: string | null;
  createdAt: ISODate;
}

export interface PaymentSummary {
  id: string;
  status: PaymentStatus;
  amount: DecimalString;
  paidAt: ISODate | null;
}

export interface Parcel {
  id: string;
  trackingNumber: string;
  status: ParcelStatus;
  type: ParcelType;
  weightKg: number;
  dimensions: string | null;
  fee: DecimalString;
  currency: string;
  senderId: string;
  courierId: string | null;
  originHubId: string | null;
  destinationHubId: string | null;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string | null;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverCity: string | null;
  notes: string | null;
  deliveryAttempts: number;
  proofOfDeliveryUrl: string | null;
  deliveredAt: ISODate | null;
  cancelledAt: ISODate | null;
  returnedAt: ISODate | null;
  createdAt: ISODate;
  updatedAt: ISODate;
  sender?: UserSummary;
  courier?: UserSummary | null;
  originHub?: HubSummary | null;
  destinationHub?: HubSummary | null;
  payment?: PaymentSummary | null;
}

/** Public payload of GET /parcels/track/:trackingNumber. */
export interface ParcelTracking {
  trackingNumber: string;
  status: ParcelStatus;
  type: ParcelType;
  fee: DecimalString;
  currency: string;
  senderCity: string | null;
  receiverName: string;
  receiverCity: string | null;
  createdAt: ISODate;
  deliveredAt: ISODate | null;
  deliveryAttempts: number;
  proofOfDeliveryUrl: string | null;
  history: ParcelStatusHistory[];
}

export interface Payment {
  id: string;
  parcelId: string;
  senderId: string;
  amount: DecimalString;
  currency: string;
  method: "STRIPE";
  status: PaymentStatus;
  stripeSessionId: string | null;
  transactionId: string | null;
  paidAt: ISODate | null;
  createdAt: ISODate;
}

export interface AuditLog {
  id: string;
  action: AuditAction;
  entityType: string | null;
  entityId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  oldValue: unknown;
  newValue: unknown;
  metadata: unknown;
  createdAt: ISODate;
  actor: { id: string; name: string; email: string } | null;
}

export interface DashboardStats {
  totalIncome: number;
  totalCustomers: number;
  totalCouriers: number;
  activeCouriers: number;
  totalParcels: number;
  deliveredParcels: number;
  pendingParcels: number;
  cancelledParcels: number;
  returnedParcels: number;
  totalFailedDeliveryAttempts: number;
  statusBreakdown: Array<{ status: ParcelStatus; count: number }>;
}
