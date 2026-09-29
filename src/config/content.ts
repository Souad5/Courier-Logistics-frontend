import type { LucideIcon } from "lucide-react";
import { Clock, CreditCard, FileText, MapPinned, Package, ShieldCheck, Snowflake, Wine } from "lucide-react";

import type { ParcelType } from "@/types";

/**
 * Pricing rules shown on /pricing, copied from calculateFee() in
 * courier-backend/src/app/modules/parcel/parcel.constant.ts. The backend always
 * computes the real fee; keep these in sync if the backend changes.
 */
export const PRICING = {
  currency: "BDT",
  baseFee: 60,
  perKg: 25,
  defaultZoneSurcharge: 40,
  zones: [
    { code: "inner-city", label: "Inner city", surcharge: 0 },
    { code: "city", label: "City", surcharge: 30 },
    { code: "suburb", label: "Suburb", surcharge: 50 },
    { code: "outer", label: "Outer", surcharge: 70 },
    { code: "inter-city", label: "Inter-city", surcharge: 100 },
    { code: "remote", label: "Remote", surcharge: 150 },
  ],
};

export const PARCEL_TYPE_INFO: Record<ParcelType, { label: string; icon: LucideIcon; description: string }> = {
  DOCUMENT: { label: "Documents", icon: FileText, description: "Letters, contracts and paperwork." },
  PARCEL: { label: "Parcels", icon: Package, description: "Everyday boxes and packages." },
  FRAGILE: { label: "Fragile", icon: Wine, description: "Glassware, electronics, anything delicate." },
  PERISHABLE: { label: "Perishable", icon: Snowflake, description: "Food and time-sensitive goods." },
};

export const FEATURES: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: "Live tracking",
    description: "Follow every parcel from pickup to doorstep with a full status history.",
    icon: MapPinned,
  },
  {
    title: "Transparent pricing",
    description: "Fees are calculated from weight and zones. No surprises at checkout.",
    icon: CreditCard,
  },
  {
    title: "Proof of delivery",
    description: "Couriers upload a delivery photo, visible right on the tracking page.",
    icon: ShieldCheck,
  },
  {
    title: "Smart retries",
    description: "Failed attempts are retried up to three times before returning to sender.",
    icon: Clock,
  },
];
