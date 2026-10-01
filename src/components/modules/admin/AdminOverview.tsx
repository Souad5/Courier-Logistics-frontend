"use client";

import { LineChart } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useAdmin";
import { useI18n } from "@/i18n/client";
import { getErrorMessage } from "@/lib/api-client";

import { ChartAreaInteractive, TIME_RANGES } from "./overview/ChartAreaInteractive";
import { ChartCard } from "./overview/ChartCard";
import { DashboardHeader } from "./overview/DashboardHeader";
import { NeedsAttention } from "./overview/NeedsAttention";
import { OverviewSkeleton } from "./overview/OverviewSkeleton";
import { RecentActivity } from "./overview/RecentActivity";
import { StatusDistributionChart } from "./overview/StatusDistributionChart";
import { TotalsStrip } from "./overview/TotalsStrip";

const DEFAULT_DAYS = 30;

/** Admin command center. The time range lives in the URL (?days=) and is sent to the API. Must render inside <Suspense>. */
export function AdminOverview() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const requested = Number(searchParams.get("days"));
  const days = TIME_RANGES.some((r) => r.days === requested) ? requested : DEFAULT_DAYS;

  const setDays = (next: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === DEFAULT_DAYS) params.delete("days");
    else params.set("days", String(next));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const {
    data: stats,
    isLoading,
    isFetching,
    error,
    refetch,
    dataUpdatedAt,
  } = useDashboardStats(days);

  const header = (
    <DashboardHeader
      onRefresh={() => refetch()}
      refreshing={isFetching}
      updatedAt={stats ? dataUpdatedAt : undefined}
    />
  );

  if (error && !stats) {
    return (
      <div className="space-y-6">
        {header}
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        {header}
        <OverviewSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}

      {stats.period ? (
        <ChartAreaInteractive period={stats.period} onDaysChange={setDays} fetching={isFetching} />
      ) : (
        <Card>
          <EmptyState
            icon={LineChart}
            title={t.admin.overview.trendsUnavailable.title}
            description={t.admin.overview.trendsUnavailable.description}
          />
        </Card>
      )}

      <TotalsStrip stats={stats} />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <ChartCard
          title={t.admin.overview.parcelStatus.title}
          description={t.admin.overview.parcelStatus.description}
        >
          <StatusDistributionChart breakdown={stats.statusBreakdown} />
        </ChartCard>
        <ChartCard
          title={t.admin.overview.needsAttention.title}
          description={t.admin.overview.needsAttention.description}
        >
          <NeedsAttention breakdown={stats.statusBreakdown} />
        </ChartCard>
        <ChartCard
          className="lg:col-span-2 xl:col-span-1"
          title={t.admin.overview.recentActivity.title}
          description={t.admin.overview.recentActivity.description}
        >
          <RecentActivity />
        </ChartCard>
      </div>
    </div>
  );
}
