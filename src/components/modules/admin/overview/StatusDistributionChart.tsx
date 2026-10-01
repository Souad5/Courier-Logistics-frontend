"use client";

import { PackageSearch } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";

import { EmptyState } from "@/components/shared/EmptyState";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useI18n } from "@/i18n/client";
import type { DashboardStats, ParcelStatus } from "@/types";

import { CHART_COLORS } from "./chart-theme";

type GroupKey = "delivered" | "progress" | "pending" | "problem";

const GROUPS: Array<{ key: GroupKey; color: string; statuses: ParcelStatus[] }> = [
  { key: "delivered", color: CHART_COLORS.success, statuses: ["DELIVERED"] },
  {
    key: "progress",
    color: CHART_COLORS.primary,
    statuses: ["ACCEPTED", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"],
  },
  { key: "pending", color: CHART_COLORS.warning, statuses: ["PENDING"] },
  {
    key: "problem",
    color: CHART_COLORS.danger,
    statuses: ["DELIVERY_FAILED", "RETURN_TO_SENDER", "RETURNED", "CANCELLED"],
  },
];

export function StatusDistributionChart({
  breakdown,
}: {
  breakdown: DashboardStats["statusBreakdown"];
}) {
  const { t, f } = useI18n();
  const chartConfig = Object.fromEntries(
    GROUPS.map((g) => [g.key, { label: t.admin.statusChart[g.key], color: g.color }]),
  ) satisfies ChartConfig;
  const data = GROUPS.map((group) => ({
    ...group,
    name: t.admin.statusChart[group.key],
    value: breakdown
      .filter((row) => group.statuses.includes(row.status))
      .reduce((sum, row) => sum + row.count, 0),
  }));
  const total = data.reduce((sum, group) => sum + group.value, 0);
  const visible = data.filter((d) => d.value > 0);

  if (total === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title={t.admin.statusChart.emptyTitle}
        description={t.admin.statusChart.emptyDescription}
      />
    );
  }

  return (
    <div className="grid items-center gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
      <div className="relative h-48 w-full sm:h-56 md:h-64">
        <ChartContainer config={chartConfig} className="aspect-square h-full w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="key" />} />
            <Pie
              data={visible}
              dataKey="value"
              nameKey="key"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {visible.map((d) => (
                <Cell key={d.key} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-2xl font-semibold tabular-nums">{f.number(total)}</p>
            <p className="text-muted-foreground text-sm">{t.admin.statusChart.parcels}</p>
          </div>
        </div>
      </div>
      <ul className="space-y-2.5 text-sm">
        {data.map((d) => (
          <li key={d.key} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className="size-2.5 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              {d.name}
            </span>
            <span className="text-muted-foreground tabular-nums">
              {f.number(d.value)}
              <span className="ml-1 text-sm">
                ({f.number(Math.round((d.value / total) * 100))}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
