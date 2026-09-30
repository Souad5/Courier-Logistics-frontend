"use client";

import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import { useId, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { EmptyState } from "@/components/shared/EmptyState";
import { AppSelect } from "@/components/shared/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn, formatCompact, formatCurrency } from "@/lib/utils";
import type { DashboardPeriod } from "@/types";

import { formatDayLabel, toWeekly } from "./chart-theme";

export const TIME_RANGES = [
  { days: 365, label: "Last 12 months" },
  { days: 90, label: "Last 3 months" },
  { days: 30, label: "Last 30 days" },
  { days: 7, label: "Last 7 days" },
] as const;

type Metric = "revenue" | "parcels";

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  parcels: { label: "Booked", color: "var(--chart-1)" },
  delivered: { label: "Delivered", color: "var(--chart-2)" },
} satisfies ChartConfig;

function Delta({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) {
    return (
      <span className="text-muted-foreground text-xs">
        {current === 0 ? "No activity in either period" : "No activity in the previous period"}
      </span>
    );
  }
  const change = ((current - previous) / previous) * 100;
  const up = change >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        up ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400",
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {up ? "+" : "−"}
      {Math.abs(change).toFixed(Math.abs(change) >= 10 ? 0 : 1)}%
      <span className="text-muted-foreground font-normal">vs previous period</span>
    </span>
  );
}

/**
 * shadcn "Area Chart – Interactive", fed by GET /admin/dashboard-stats?days=N.
 * The time range is owned by the caller (URL state) because it drives the API request.
 */
export function ChartAreaInteractive({
  period,
  onDaysChange,
  fetching,
}: {
  period: DashboardPeriod;
  onDaysChange: (days: number) => void;
  fetching: boolean;
}) {
  const [metric, setMetric] = useState<Metric>("parcels");
  const uid = useId().replace(/:/g, "");

  const weekly = period.days > 90;
  const data = weekly ? toWeekly(period.timeline) : period.timeline;
  const range = TIME_RANGES.find((r) => r.days === period.days);
  const deliveryRate =
    period.parcels > 0 ? Math.round((period.delivered / period.parcels) * 100) : null;
  const hasData = data.some((p) => (metric === "revenue" ? p.revenue : p.parcels) > 0);

  const tabs: Array<{
    key: Metric;
    label: string;
    value: string;
    current: number;
    previous: number;
    note?: string;
  }> = [
    {
      key: "parcels",
      label: "Parcels booked",
      value: period.parcels.toLocaleString("en"),
      current: period.parcels,
      previous: period.previousParcels,
      note:
        deliveryRate === null
          ? undefined
          : `${period.delivered.toLocaleString("en")} delivered · ${deliveryRate}%`,
    },
    {
      key: "revenue",
      label: "Revenue",
      value: formatCurrency(period.revenue),
      current: period.revenue,
      previous: period.previousRevenue,
    },
  ];

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex flex-col gap-3 border-b py-5 sm:flex-row sm:items-center">
        <div className="grid flex-1 gap-1">
          <CardTitle>Shipments and revenue</CardTitle>
          <CardDescription>
            {range?.label ?? `Last ${period.days} days`}
            {weekly ? ", by week" : ", by day"}
          </CardDescription>
        </div>
        <AppSelect
          ariaLabel="Time range"
          value={String(period.days)}
          onValueChange={(value) => onDaysChange(Number(value))}
          options={TIME_RANGES.map((r) => ({ value: String(r.days), label: r.label }))}
          className="rounded-lg sm:w-40"
          containerClassName="w-full sm:ml-auto sm:w-auto"
        />
      </CardHeader>

      <div className="grid grid-cols-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            aria-pressed={metric === tab.key}
            onClick={() => setMetric(tab.key)}
            className={cn(
              "relative flex flex-col items-start gap-1 px-4 py-4 text-left transition-colors sm:px-6",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset",
              "border-r last:border-r-0",
              metric === tab.key ? "bg-muted/50" : "hover:bg-muted/30",
            )}
          >
            {metric === tab.key && (
              <span aria-hidden className="bg-signal absolute inset-x-0 bottom-0 h-0.5" />
            )}
            <span className="text-muted-foreground text-xs">{tab.label}</span>
            <span className="text-xl font-semibold tracking-tight tabular-nums sm:text-3xl">
              {tab.value}
            </span>
            <Delta current={tab.current} previous={tab.previous} />
            {tab.note && <span className="text-muted-foreground text-xs">{tab.note}</span>}
          </button>
        ))}
      </div>

      <CardContent
        className={cn(
          "px-2 pt-4 pb-4 transition-opacity sm:px-6 sm:pt-6",
          fetching && "opacity-60",
        )}
      >
        {hasData ? (
          <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
            <AreaChart data={data} margin={{ left: 4, right: 12 }}>
              <defs>
                {(["revenue", "parcels", "delivered"] as const).map((key) => (
                  <linearGradient key={key} id={`${uid}-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.6} />
                    <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.05} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={formatDayLabel}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={metric === "revenue" ? 44 : 28}
                allowDecimals={false}
                tickFormatter={formatCompact}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(label) =>
                      `${weekly ? "Week of " : ""}${formatDayLabel(String(label))}`
                    }
                    formatter={
                      metric === "revenue"
                        ? (value) => (
                            <div className="flex w-full items-center justify-between gap-4">
                              <span className="text-muted-foreground">Revenue</span>
                              <span className="font-mono font-medium tabular-nums">
                                {formatCurrency(Number(value))}
                              </span>
                            </div>
                          )
                        : undefined
                    }
                  />
                }
              />
              {metric === "revenue" ? (
                <Area
                  dataKey="revenue"
                  type="monotone"
                  fill={`url(#${uid}-revenue)`}
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                />
              ) : (
                <>
                  {/* Not stacked: delivered parcels are a subset of booked ones. */}
                  <Area
                    dataKey="parcels"
                    type="monotone"
                    fill={`url(#${uid}-parcels)`}
                    stroke="var(--color-parcels)"
                    strokeWidth={2}
                  />
                  <Area
                    dataKey="delivered"
                    type="monotone"
                    fill={`url(#${uid}-delivered)`}
                    stroke="var(--color-delivered)"
                    strokeWidth={2}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </>
              )}
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[280px] items-center justify-center">
            <EmptyState
              icon={BarChart3}
              title={
                metric === "revenue"
                  ? "No payments in this period"
                  : "No parcels booked in this period"
              }
              description="Try a longer time range, or check back once customers book and pay."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
