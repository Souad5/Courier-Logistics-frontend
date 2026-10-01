"use client";

import type { LucideIcon } from "lucide-react";
import { ShieldCheck, Truck, User } from "lucide-react";
import { useState } from "react";

import { AppButton } from "@/components/shared/AppButton";
import { DEMO_PASSWORD, demoAccounts } from "@/config/site";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types";

const ROLE_ICONS: Record<Role, LucideIcon> = {
  ADMIN: ShieldCheck,
  CUSTOMER: User,
  COURIER: Truck,
};

/**
 * 1-click demo login: authenticates as a seeded account and lands on that
 * role's dashboard (redirect handled by useAuth). Requires a seeded backend DB.
 */
export function DemoLoginButtons() {
  const { login } = useAuth();
  const [pendingRole, setPendingRole] = useState<Role | null>(null);

  const handleDemoLogin = (role: Role, email: string) => {
    setPendingRole(role);
    login.mutate({ email, password: DEMO_PASSWORD }, { onSettled: () => setPendingRole(null) });
  };

  return (
    <div className="space-y-3">
      <div className="text-muted-foreground flex items-center gap-3 text-sm uppercase">
        <span className="bg-border h-px flex-1" />
        1-click demo login
        <span className="bg-border h-px flex-1" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {demoAccounts.map(({ role, label, email }) => {
          const Icon = ROLE_ICONS[role];
          return (
            <AppButton
              key={role}
              type="button"
              variant="outline"
              className="h-auto flex-col gap-1.5 py-3 [&_svg]:size-5"
              // Every button is disabled while any demo login runs; only the clicked one spins.
              disabled={login.isPending}
              loading={pendingRole === role}
              leftIcon={<Icon />}
              onClick={() => handleDemoLogin(role, email)}
              aria-label={`Log in as demo ${label}`}
            >
              <span className="text-sm">{label}</span>
            </AppButton>
          );
        })}
      </div>
    </div>
  );
}
