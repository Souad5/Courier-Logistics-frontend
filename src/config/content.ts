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

import type { Dictionary } from "@/i18n/dictionaries";
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
    // `label` is an English fallback; UI text comes from `enums.zone[code]`.
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

type ContentText = Dictionary["landing"]["content"];

/** Display text lives in the dictionary (`landing.content.parcelTypes[type]`). */
export const PARCEL_TYPE_INFO: Record<ParcelType, { icon: LucideIcon }> = {
  DOCUMENT: { icon: FileText },
  PARCEL: { icon: Package },
  FRAGILE: { icon: Wine },
  PERISHABLE: { icon: Snowflake },
};

/** Text: `landing.content.features[key]`. */
export const FEATURES: Array<{ key: keyof ContentText["features"]; icon: LucideIcon }> = [
  { key: "liveTracking", icon: MapPinned },
  { key: "transparentPricing", icon: CreditCard },
  { key: "proofOfDelivery", icon: ShieldCheck },
  { key: "smartRetries", icon: Clock },
];

/** "Three jobs, one platform" cards on the home page. Text: `landing.content.services[key]`. */
export const SERVICES: Array<{
  key: keyof ContentText["services"];
  icon: LucideIcon;
  href: string;
}> = [
  { key: "send", icon: PackagePlus, href: "/register" },
  { key: "track", icon: PackageSearch, href: "/#track" },
  { key: "deliver", icon: Bike, href: "/register" },
];

/** Text: `landing.content.faqs[key]`; `pricing` FAQs are repeated on /pricing. */
export const FAQS: Array<{ key: keyof ContentText["faqs"]; pricing?: boolean }> = [
  { key: "fee", pricing: true },
  { key: "coverage" },
  { key: "duration" },
  { key: "payment", pricing: true },
  { key: "notHome" },
  { key: "arrived" },
  { key: "account" },
];
