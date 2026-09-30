"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROLE_HOME } from "@/config/api.config";
import { dashboardNav, type NavItem } from "@/config/site";
import { cn, humanize } from "@/lib/utils";
import type { Role } from "@/types";

import { Logo } from "./Logo";

interface SidebarNavProps {
  role: Role;
  collapsed?: boolean;
  onNavigate?: () => void;
}

/** The nav item for the current path — the most specific match, so /customer/parcels/new
 * doesn't also light up /customer/parcels, and the role root only matches exactly. */
export function useActiveNavItem(role: Role): NavItem | undefined {
  const pathname = usePathname();
  const home = ROLE_HOME[role];
  return dashboardNav[role]
    .filter((item) => (item.href === home ? pathname === home : pathname.startsWith(item.href)))
    .sort((a, b) => b.href.length - a.href.length)[0];
}

/** Role-specific nav links; shared by the desktop sidebar and the mobile sheet. */
export function SidebarNav({ role, collapsed, onNavigate }: SidebarNavProps) {
  const activeHref = useActiveNavItem(role)?.href;

  return (
    <nav className="flex flex-col gap-0.5" aria-label={`${humanize(role)} navigation`}>
      {dashboardNav[role].map((item) => {
        const Icon = item.icon;
        const active = item.href === activeHref;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.title : undefined}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              active
                ? "bg-muted text-foreground font-medium"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              collapsed && "justify-center px-2",
            )}
          >
            {active && (
              <span
                aria-hidden
                className="bg-signal absolute inset-y-1.5 left-0 w-0.5 rounded-full"
              />
            )}
            {Icon && <Icon className="size-4 shrink-0" aria-hidden />}
            {collapsed ? <span className="sr-only">{item.title}</span> : <span>{item.title}</span>}
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
        "bg-sidebar sticky top-0 hidden h-svh shrink-0 flex-col border-r transition-[width] md:flex",
        collapsed ? "w-18" : "w-60",
      )}
    >
      <div
        className={cn("flex h-14 items-center border-b px-4", collapsed && "justify-center px-0")}
      >
        <Logo compact={collapsed} />
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {!collapsed && <p className="eyebrow px-3 pt-2 pb-1">{humanize(role)} workspace</p>}
        <SidebarNav role={role} collapsed={collapsed} />
      </div>
    </aside>
  );
}
