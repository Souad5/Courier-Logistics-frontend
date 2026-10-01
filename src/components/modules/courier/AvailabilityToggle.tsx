"use client";

import { Star } from "lucide-react";

import { AppButton } from "@/components/shared/AppButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyParcels } from "@/hooks/useParcels";
import { useUpdateAvailability } from "@/hooks/useUsers";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import type { ParcelStatus } from "@/types";

export function AvailabilityToggle() {
  const { t, f } = useI18n();
  const labels = t.courier.availability;
  const user = useAuthStore((s) => s.user);
  const update = useUpdateAvailability();

  if (!user) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-64 rounded-xl lg:col-span-2" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const available = user.isAvailable ?? false;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{labels.dutyTitle}</CardTitle>
          <CardDescription>{labels.dutyDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className={cn(
                  "size-3 shrink-0 rounded-full",
                  available ? "bg-emerald-500" : "bg-muted-foreground/40",
                )}
              />
              <div>
                <p className="font-semibold">{available ? labels.available : labels.unavailable}</p>
                <p className="text-muted-foreground text-sm">
                  {available ? labels.availableHint : labels.unavailableHint}
                </p>
              </div>
            </div>
            <AppButton
              role="switch"
              aria-checked={available}
              variant={available ? "outline" : "default"}
              loading={update.isPending}
              onClick={() => update.mutate(!available)}
              className="sm:min-w-36"
            >
              {available ? labels.goUnavailable : labels.goAvailable}
            </AppButton>
          </div>

          <div className="space-y-3">
            <h2 className="eyebrow">{labels.howItWorks}</h2>
            <ul className="divide-y rounded-lg border text-sm">
              {labels.howItWorksPoints.map((line) => (
                <li key={line} className="text-muted-foreground px-4 py-3">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{labels.workloadTitle}</CardTitle>
          <CardDescription>{labels.workloadDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <WorkloadRow label={t.enums.parcelStatus.OUT_FOR_DELIVERY} status="OUT_FOR_DELIVERY" />
            <WorkloadRow label={t.enums.parcelStatus.IN_TRANSIT} status="IN_TRANSIT" />
            <WorkloadRow label={t.enums.parcelStatus.DELIVERY_FAILED} status="DELIVERY_FAILED" />
            <WorkloadRow label={t.enums.parcelStatus.DELIVERED} status="DELIVERED" />
            {user.rating !== undefined && (
              <div className="flex items-center justify-between py-3 text-sm">
                <dt className="text-muted-foreground">{labels.rating}</dt>
                <dd className="flex items-center gap-1 font-semibold tabular-nums">
                  <Star className="size-4" aria-hidden />
                  {f.number(user.rating, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

function WorkloadRow({ label, status }: { label: string; status: ParcelStatus }) {
  const { f } = useI18n();
  const { data, isLoading } = useMyParcels({ status, limit: 1 });
  return (
    <div className="flex items-center justify-between py-3 text-sm first:pt-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold tabular-nums">
        {isLoading ? <Skeleton className="h-5 w-8" /> : f.number(data?.meta?.total ?? 0)}
      </dd>
    </div>
  );
}
