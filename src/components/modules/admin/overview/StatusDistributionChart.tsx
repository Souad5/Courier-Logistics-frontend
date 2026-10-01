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
import type { DashboardStats, ParcelStatus } from "@/types";

import { CHART_COLORS } from "./chart-theme";

const GROUPS: Array<{ key: string; name: string; color: string; statuses: ParcelStatus[] }> = [
  { key: "delivered", name: "Delivered", color: CHART_COLORS.success, statuses: ["DELIVERED"] },
  {
    key: "progress",
    name: "In progress",
    color: CHART_COLORS.primary,
    statuses: ["ACCEPTED", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"],
  },
  { key: "pending", name: "Awaiting pickup", color: CHART_COLORS.warning, statuses: ["PENDING"] },
  {
    key: "problem",
    name: "Problem or ended",
    color: CHART_COLORS.danger,
    statuses: ["DELIVERY_FAILED", "RETURN_TO_SENDER", "RETURNED", "CANCELLED"],
  },
];

const chartConfig = Object.fromEntries(
  GROUPS.map((g) => [g.key, { label: g.name, color: g.color }]),
) satisfies ChartConfig;

export function StatusDistributionChart({
  breakdown,
}: {
  breakdown: DashboardStats["statusBreakdown"];
}) {
  const data = GROUPS.map((group) => ({
    ...group,
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
        title="No parcels yet"
        description="The status split appears once parcels are booked."
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
            <p className="text-2xl font-semibold tabular-nums">{total}</p>
            <p className="text-muted-foreground text-sm">parcels</p>
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
              {d.value}
              <span className="ml-1 text-sm">({Math.round((d.value / total) * 100)}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
