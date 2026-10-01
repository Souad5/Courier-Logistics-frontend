"use client";

import { LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_HOME } from "@/config/api.config";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n/client";
import { initials } from "@/lib/utils";
import { AppButton } from "./AppButton";

export function UserMenu() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AppButton
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label={t.nav.account.menu}
        >
          <Avatar className="size-8">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
        </AppButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-muted-foreground truncate text-sm">{user.email}</p>
          <p className="text-muted-foreground mt-1 text-sm">{t.enums.role[user.role]}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={ROLE_HOME[user.role]}>
            <LayoutDashboard /> {t.nav.account.dashboard}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`${ROLE_HOME[user.role]}/profile`}>
            <User /> {t.nav.account.profile}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={logout.isPending}
          onSelect={() => logout.mutate()}
        >
          <LogOut /> {t.nav.account.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
