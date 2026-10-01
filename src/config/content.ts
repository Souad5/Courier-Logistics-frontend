import type { LucideIcon } from "lucide-react";
import {
  Bike,
  Clock,
  CreditCard,
  FileText,
  MapPinned,
  Package,
  PackagePlus,
  PackageSearch,
  ShieldCheck,
  Snowflake,
  Wine,
} from "lucide-react";

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

/** Client-side preview of calculateFee(); the backend computes the fee that is charged. */
export function estimateFee(weightKg: number, originZone: string, destinationZone: string) {
  const surcharge = (code: string) =>
    PRICING.zones.find((z) => z.code === code)?.surcharge ?? PRICING.defaultZoneSurcharge;
  const weightFee = weightKg * PRICING.perKg;
  const zoneSurcharge = surcharge(originZone) + surcharge(destinationZone);
  const total = Math.round((PRICING.baseFee + weightFee + zoneSurcharge) * 100) / 100;
  return { total, baseFee: PRICING.baseFee, weightFee, zoneSurcharge };
}

export const PARCEL_TYPE_INFO: Record<
  ParcelType,
  { label: string; icon: LucideIcon; description: string }
> = {
  DOCUMENT: {
    label: "Documents",
    icon: FileText,
    description: "Letters, contracts and paperwork.",
  },
  PARCEL: { label: "Parcels", icon: Package, description: "Everyday boxes and packages." },
  FRAGILE: {
    label: "Fragile",
    icon: Wine,
    description: "Glassware, electronics, anything delicate.",
  },
  PERISHABLE: {
    label: "Perishable",
    icon: Snowflake,
    description: "Food and time-sensitive goods.",
  },
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

/** "Three jobs, one platform" cards on the home page. */
export const SERVICES: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
  cta: { label: string; href: string };
}> = [
  {
    title: "Send a parcel",
    description:
      "Book in four short steps, see the fee before you pay, and pay by card. Pickup starts once it's paid.",
    icon: PackagePlus,
    cta: { label: "Book a parcel", href: "/register" },
  },
  {
    title: "Track a parcel",
    description:
      "Every status change is recorded with a time and place. No account needed — just the tracking number.",
    icon: PackageSearch,
    cta: { label: "Track now", href: "/#track" },
  },
  {
    title: "Deliver with us",
    description:
      "Couriers get a clear task list, update statuses from the road and upload photo proof on delivery.",
    icon: Bike,
    cta: { label: "Join as a courier", href: "/register" },
  },
];

export const FAQS = [
  {
    q: "How is the delivery fee calculated?",
    a: `A base fee of ${PRICING.currency} ${PRICING.baseFee}, plus ${PRICING.currency} ${PRICING.perKg} per kilogram, plus a surcharge for the zone of each hub. The exact fee is shown before you pay.`,
  },
  {
    q: "Which areas do you cover?",
    a: "We deliver between our hubs. The coverage list on this page shows every hub with its city and zone, straight from our live network.",
  },
  {
    q: "How long does delivery take?",
    a: "It depends on the route and when a courier picks the parcel up. You can follow each step — accepted, picked up, in transit, out for delivery — on the tracking page.",
  },
  {
    q: "How do I pay?",
    a: "By card through Stripe Checkout. The parcel is marked as paid as soon as Stripe confirms the payment.",
  },
  {
    q: "What happens if nobody is home?",
    a: "Failed deliveries are retried up to three times. After that the parcel is returned to the sender.",
  },
  {
    q: "How do I know it arrived?",
    a: "The courier uploads a photo on delivery. It appears on the tracking page next to the full status history.",
  },
  {
    q: "Do I need an account to track a parcel?",
    a: "No. Anyone with a tracking number can follow it from the tracking page.",
  },
];
