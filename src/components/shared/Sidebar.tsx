"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROLE_HOME } from "@/config/api.config";
import { dashboardNav, type NavItem } from "@/config/site";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

import { Logo } from "./Logo";

interface SidebarNavProps {
  role: Role;
  collapsed?: boolean;
  onNavigate?: () => void;
}

/** Role-specific nav links; shared by the desktop sidebar and the mobile sheet. */
export function SidebarNav({ role, collapsed, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const home = ROLE_HOME[role];

  // The role root (e.g. /admin) must match exactly, or it would be active everywhere.
  const isActive = (item: NavItem) =>
    item.href === home ? pathname === home : pathname.startsWith(item.href);

  // Pick the most specific matching item so /customer/parcels/new doesn't also light up /customer/parcels.
  const activeHref = dashboardNav[role]
    .filter(isActive)
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav className="flex flex-col gap-1">
      {dashboardNav[role].map((item) => {
        const Icon = item.icon;
        const active = item.href === activeHref;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.title : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              collapsed && "justify-center px-2",
            )}
          >
            {Icon && <Icon className="size-4 shrink-0" />}
            {!collapsed && <span>{item.title}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({ role, collapsed }: { role: Role; collapsed: boolean }) {
  return (
    <aside
      className={cn(
        "bg-sidebar sticky top-0 hidden h-svh shrink-0 flex-col gap-6 border-r p-4 transition-[width] md:flex",
        collapsed ? "w-18" : "w-64",
      )}
    >
      <Logo compact={collapsed} className={cn(collapsed && "justify-center")} />
      <SidebarNav role={role} collapsed={collapsed} />
    </aside>
  );
}
