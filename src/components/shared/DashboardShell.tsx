"use client";

import { Menu, PanelLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/i18n/client";
import { authStorage } from "@/lib/auth-storage";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import type { Role } from "@/types";

import { AppButton } from "./AppButton";
import { LanguageToggle } from "./LanguageToggle";
import { Logo } from "./Logo";
import { Sidebar, SidebarNav, useActiveNavItem } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

/**
 * Dashboard chrome: role-aware sidebar + top bar. proxy.ts has already
 * guaranteed the URL matches the token's role; the role comes from the store
 * (or, before /users/me resolves, from the token itself).
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
  const { t } = useI18n();

  const role = user?.role ?? (hydrated ? authStorage.getRole() : null);

  return (
    <div className="flex min-h-svh flex-1">
      {role ? (
        <Sidebar role={role} collapsed={sidebarCollapsed} />
      ) : (
        <div className="hidden w-60 border-r p-4 md:block">
          <Skeleton className="h-8 w-32" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-background/80 sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-4 backdrop-blur">
          <AppButton
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={t.nav.shell.openNavigation}
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu />
          </AppButton>
          <AppButton
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            aria-label={t.nav.shell.toggleSidebar}
            onClick={toggleSidebar}
          >
            <PanelLeft />
          </AppButton>
          {role && <Breadcrumb role={role} />}
          <div className="ml-auto flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        <main className="w-full flex-1 space-y-6 p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <div className="px-4">
            {role && <SidebarNav role={role} onNavigate={() => setMobileSidebarOpen(false)} />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Breadcrumb({ role }: { role: Role }) {
  const current = useActiveNavItem(role);
  const { t } = useI18n();
  return (
    <p className="flex min-w-0 items-center gap-1.5 text-sm">
      <span className="text-muted-foreground hidden sm:inline">{t.enums.role[role]}</span>
      {current && (
        <>
          <span className="text-muted-foreground hidden sm:inline" aria-hidden>
            /
          </span>
          <span className="truncate font-medium">{t.nav.dashboard[current.key]}</span>
        </>
      )}
    </p>
  );
}
