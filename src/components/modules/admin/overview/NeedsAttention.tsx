"use client";

import { CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/EmptyState";
import { useI18n } from "@/i18n/client";
import type { DashboardStats, ParcelStatus } from "@/types";

const ITEMS: Array<{ status: ParcelStatus; key: "pending" | "failed" | "returning" }> = [
  { status: "PENDING", key: "pending" },
  { status: "DELIVERY_FAILED", key: "failed" },
  { status: "RETURN_TO_SENDER", key: "returning" },
];

/** Operational queues with deep links into the URL-filtered parcel list. */
export function NeedsAttention({ breakdown }: { breakdown: DashboardStats["statusBreakdown"] }) {
  const { t, f } = useI18n();
  const rows = ITEMS.map((item) => ({
    ...item,
    ...t.admin.needsAttention[item.key],
    count: breakdown.find((b) => b.status === item.status)?.count ?? 0,
  }));

  if (rows.every((row) => row.count === 0)) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title={t.admin.needsAttention.emptyTitle}
        description={t.admin.needsAttention.emptyDescription}
      />
    );
  }

  return (
    <ul className="-mx-2 divide-y">
      {rows.map((row) => (
        <li key={row.status}>
          <Link
            href={`/admin/parcels?status=${row.status}`}
            className="hover:bg-muted/60 focus-visible:ring-ring group flex items-center gap-4 rounded-md px-2 py-3 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <span
              className={
                row.count > 0
                  ? "w-10 text-2xl font-semibold tabular-nums"
                  : "text-muted-foreground w-10 text-2xl font-semibold tabular-nums"
              }
            >
              {f.number(row.count)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{row.label}</span>
              <span className="text-muted-foreground block truncate text-sm">{row.hint}</span>
            </span>
            <ChevronRight
              className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
