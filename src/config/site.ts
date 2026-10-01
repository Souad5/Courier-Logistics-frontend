import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  MapPin,
  PackagePlus,
  Power,
  ScrollText,
  User,
  Users,
  Wallet,
} from "lucide-react";

import { env } from "@/env";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Role } from "@/types";

export const siteConfig = {
  name: "SwiftParcel",
  url: env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, ""),
  locale: "en_US",
  keywords: [
    "courier service",
    "parcel delivery",
    "logistics",
    "package tracking",
    "same-day delivery",
    "Bangladesh courier",
  ],
  description:
    "Courier & logistics management: book, pay for, track and deliver parcels across every zone.",
  contactEmail: "support@swiftparcel.example",
};

/** Labels come from the dictionary (`nav.public` / `nav.dashboard`) via `key`. */
export interface PublicNavItem {
  key: keyof Dictionary["nav"]["public"];
  href: string;
}

export interface NavItem {
  key: keyof Dictionary["nav"]["dashboard"];
  href: string;
  icon?: LucideIcon;
}

export const publicNav: PublicNavItem[] = [
  { key: "home", href: "/" },
  { key: "services", href: "/services" },
  { key: "pricing", href: "/pricing" },
  { key: "coverage", href: "/#coverage" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];

export const dashboardNav: Record<Role, NavItem[]> = {
  ADMIN: [
    { key: "overview", href: "/admin", icon: LayoutDashboard },
    { key: "parcels", href: "/admin/parcels", icon: Boxes },
    { key: "users", href: "/admin/users", icon: Users },
    { key: "hubs", href: "/admin/hubs", icon: MapPin },
    { key: "auditLogs", href: "/admin/audit-logs", icon: ScrollText },
  ],
  CUSTOMER: [
    { key: "myActivity", href: "/customer", icon: LayoutDashboard },
    { key: "myParcels", href: "/customer/parcels", icon: Boxes },
    { key: "sendParcel", href: "/customer/parcels/new", icon: PackagePlus },
    { key: "payments", href: "/customer/payments", icon: CreditCard },
    { key: "profile", href: "/customer/profile", icon: User },
  ],
  COURIER: [
    { key: "myTasks", href: "/courier", icon: ClipboardList },
    { key: "earnings", href: "/courier/earnings", icon: Wallet },
    { key: "availability", href: "/courier/availability", icon: Power },
  ],
};

/**
 * Seeded demo accounts (courier-backend/prisma/seed.ts). They only work
 * against a database that has been seeded with `npm run seed`.
 */
export const DEMO_PASSWORD = "Password@123";

export const demoAccounts: Array<{ role: Role; label: string; email: string }> = [
  { role: "ADMIN", label: "Admin", email: "admin@courier.com" },
  { role: "CUSTOMER", label: "Customer", email: "customer1@courier.com" },
  { role: "COURIER", label: "Courier", email: "courier1@courier.com" },
];
