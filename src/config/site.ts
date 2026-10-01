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

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
}

export const publicNav: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Services", href: "/services" },
  { title: "Pricing", href: "/pricing" },
  { title: "Coverage", href: "/#coverage" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

export const dashboardNav: Record<Role, NavItem[]> = {
  ADMIN: [
    { title: "Overview", href: "/admin", icon: LayoutDashboard },
    { title: "Parcels", href: "/admin/parcels", icon: Boxes },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Hubs", href: "/admin/hubs", icon: MapPin },
    { title: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
  ],
  CUSTOMER: [
    { title: "My Activity", href: "/customer", icon: LayoutDashboard },
    { title: "My Parcels", href: "/customer/parcels", icon: Boxes },
    { title: "Send a Parcel", href: "/customer/parcels/new", icon: PackagePlus },
    { title: "Payments", href: "/customer/payments", icon: CreditCard },
    { title: "Profile", href: "/customer/profile", icon: User },
  ],
  COURIER: [
    { title: "My Tasks", href: "/courier", icon: ClipboardList },
    { title: "Earnings", href: "/courier/earnings", icon: Wallet },
    { title: "Availability", href: "/courier/availability", icon: Power },
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
