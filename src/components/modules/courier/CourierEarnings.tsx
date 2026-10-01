"use client";

import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyParcels } from "@/hooks/useParcels";
import { useI18n } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import { getErrorMessage } from "@/lib/api-client";
import type { Parcel } from "@/types";

// Backend QueryBuilder caps a page at 100 rows.
const PAGE_LIMIT = 100;
const MONTHS = 6;

function monthlyEarnings(parcels: Parcel[], locale: Locale) {
  const now = new Date();
  const months = Array.from({ length: MONTHS }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (MONTHS - 1 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: d.toLocaleDateString(locale === "bn" ? "bn-BD" : "en", { month: "short" }),
      earnings: 0,
    };
  });
  for (const p of parcels) {
    if (!p.deliveredAt) continue;
    const d = new Date(p.deliveredAt);
    const bucket = months.find((m) => m.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (bucket) bucket.earnings += Number(p.fee);
  }
  return months;
}

/** Courier earnings, derived from DELIVERED parcels (the backend has no earnings endpoint). */
export function CourierEarnings() {
  const { t, f, format, locale } = useI18n();
  const labels = t.courier.earnings;
  const chartConfig = {
    earnings: { label: labels.series, color: "var(--chart-1)" },
  } satisfies ChartConfig;
  const { data, isLoading, error, refetch } = useMyParcels({
    status: "DELIVERED",
    limit: PAGE_LIMIT,
  });

  if (error) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;

  const delivered = data?.data.parcels ?? [];
  const total = data?.meta?.total ?? delivered.length;
  const totalEarnings = delivered.reduce((sum, p) => sum + Number(p.fee), 0);
  const average = delivered.length > 0 ? totalEarnings / delivered.length : 0;
  const partial = total > delivered.length;
  const months = monthlyEarnings(delivered, locale);

  const columns: DataTableColumn<Parcel>[] = [
    {
      key: "tracking",
      header: t.parcels.columns.tracking,
      cell: (p) => <span className="font-mono text-sm">{p.trackingNumber}</span>,
    },
    { key: "receiver", header: t.parcels.columns.receiver, cell: (p) => p.receiverName },
    { key: "delivered", header: labels.columns.delivered, cell: (p) => f.date(p.deliveredAt) },
    {
      key: "fee",
      header: labels.columns.earnings,
      align: "right",
      cell: (p) => (
        <span className="font-medium tabular-nums">{f.currency(p.fee, p.currency)}</span>
      ),
    },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title={partial ? format(labels.latest, { n: f.number(delivered.length) }) : labels.total}
          value={f.currency(totalEarnings)}
          loading={isLoading}
        />
        <StatCard title={labels.completed} value={f.number(total)} loading={isLoading} />
        <StatCard title={labels.average} value={f.currency(average)} loading={isLoading} />
      </div>
      {partial && (
        <p className="text-muted-foreground text-sm">
          {format(labels.partialNote, { n: f.number(delivered.length) })}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{labels.chartTitle}</CardTitle>
          <CardDescription>{labels.chartDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-60 w-full" />
          ) : months.some((m) => m.earnings > 0) ? (
            <ChartContainer config={chartConfig} className="aspect-auto h-60 w-full">
              <BarChart data={months} margin={{ left: 4, right: 4 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  tickFormatter={(value: number) => f.compact(value)}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value) => (
                        <div className="flex w-full items-center justify-between gap-4">
                          <span className="text-muted-foreground">{labels.series}</span>
                          <span className="font-mono font-medium tabular-nums">
                            {f.currency(Number(value))}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar dataKey="earnings" fill="var(--color-earnings)" radius={6} />
              </BarChart>
            </ChartContainer>
          ) : (
            <EmptyState
              icon={BarChart3}
              title={labels.emptyTitle}
              description={labels.emptyDescription}
            />
          )}
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">{labels.deliveredHeading}</h2>
        <DataTable
          columns={columns}
          data={delivered}
          getRowId={(p) => p.id}
          loading={isLoading}
          emptyMessage={labels.tableEmpty}
          emptyDescription={labels.tableEmptyDescription}
        />
      </section>
    </>
  );
}
