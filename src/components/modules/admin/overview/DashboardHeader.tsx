"use client";

import { RefreshCw } from "lucide-react";
import Link from "next/link";

import { AppButton } from "@/components/shared/AppButton";
import { useI18n } from "@/i18n/client";
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
  const { t, format, locale } = useI18n();
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t.admin.overview.title}</h1>
        <p className="text-muted-foreground text-sm">
          {t.admin.overview.subtitle}
          {updatedAt
            ? format(t.admin.overview.updated, {
                time: new Date(updatedAt).toLocaleTimeString(locale === "bn" ? "bn-BD" : "en", {
                  timeStyle: "short",
                }),
              })
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
          {t.admin.overview.refresh}
        </AppButton>
        <AppButton asChild>
          <Link href="/admin/parcels">{t.admin.overview.manageParcels}</Link>
        </AppButton>
      </div>
    </div>
  );
}
