"use client";

import { RefreshCw } from "lucide-react";
import Link from "next/link";

import { AppButton } from "@/components/shared/AppButton";
import { cn } from "@/lib/utils";

export function DashboardHeader({
  onRefresh,
  refreshing,
  updatedAt,
}: {
  onRefresh: () => void;
  refreshing: boolean;
  updatedAt: number | undefined;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-muted-foreground text-sm">
          Bookings, revenue and delivery health across the network
          {updatedAt
            ? ` · updated ${new Date(updatedAt).toLocaleTimeString("en", { timeStyle: "short" })}`
            : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <AppButton
          variant="outline"
          leftIcon={<RefreshCw className={cn(refreshing && "animate-spin")} />}
          onClick={onRefresh}
          disabled={refreshing}
        >
          Refresh
        </AppButton>
        <AppButton asChild>
          <Link href="/admin/parcels">Manage parcels</Link>
        </AppButton>
      </div>
    </div>
  );
}
