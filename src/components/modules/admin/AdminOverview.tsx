"use client";

import { LineChart } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useAdmin";
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
            title="Trends aren't available yet"
            description="The connected server doesn't report daily activity. Deploy the latest backend to see bookings and revenue over time — the totals below are live."
          />
        </Card>
      )}

      <TotalsStrip stats={stats} />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="Parcel status" description="Where every parcel stands right now.">
          <StatusDistributionChart breakdown={stats.statusBreakdown} />
        </ChartCard>
        <ChartCard title="Needs attention" description="Queues that need an admin.">
          <NeedsAttention breakdown={stats.statusBreakdown} />
        </ChartCard>
        <ChartCard
          className="lg:col-span-2 xl:col-span-1"
          title="Recent activity"
          description="Latest recorded actions."
        >
          <RecentActivity />
        </ChartCard>
      </div>
    </div>
  );
}
