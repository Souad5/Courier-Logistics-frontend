"use client";

import { useI18n } from "@/i18n/client";
import type { DashboardStats } from "@/types";

/** Lifetime platform totals in one hairline grid instead of six separate cards. */
export function TotalsStrip({ stats }: { stats: DashboardStats }) {
  const { t, f, format } = useI18n();
  const labels = t.admin.totals;
  const items = [
    { label: labels.lifetimeIncome, value: f.currency(stats.totalIncome) },
    {
      label: labels.parcels,
      value: f.number(stats.totalParcels),
      note: format(labels.delivered, { n: f.number(stats.deliveredParcels) }),
    },
    { label: labels.customers, value: f.number(stats.totalCustomers) },
    {
      label: labels.couriers,
      value: f.number(stats.totalCouriers),
      note: format(labels.activeAccounts, { n: f.number(stats.activeCouriers) }),
    },
    {
      label: labels.cancelledReturned,
      value: f.number(stats.cancelledParcels + stats.returnedParcels),
      note: format(labels.cancelledReturnedNote, {
        cancelled: f.number(stats.cancelledParcels),
        returned: f.number(stats.returnedParcels),
      }),
    },
    { label: labels.failedAttempts, value: f.number(stats.totalFailedDeliveryAttempts) },
  ];

  return (
    <section aria-labelledby="totals-heading" className="space-y-3">
      <h2 id="totals-heading" className="eyebrow">
        {labels.heading}
      </h2>
      <dl className="bg-border grid grid-cols-2 gap-px overflow-hidden rounded-xl border md:grid-cols-3 xl:grid-cols-6">
        {items.map((item) => (
          <div key={item.label} className="bg-card space-y-1 p-4">
            <dt className="text-muted-foreground text-sm">{item.label}</dt>
            <dd className="text-lg font-semibold tracking-tight tabular-nums">{item.value}</dd>
            {item.note && <dd className="text-muted-foreground text-sm">{item.note}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}
