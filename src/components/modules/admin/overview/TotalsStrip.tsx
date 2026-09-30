import { formatCurrency } from "@/lib/utils";
import type { DashboardStats } from "@/types";

/** Lifetime platform totals in one hairline grid instead of six separate cards. */
export function TotalsStrip({ stats }: { stats: DashboardStats }) {
  const items = [
    { label: "Lifetime income", value: formatCurrency(stats.totalIncome) },
    {
      label: "Parcels",
      value: stats.totalParcels.toLocaleString("en"),
      note: `${stats.deliveredParcels.toLocaleString("en")} delivered`,
    },
    { label: "Customers", value: stats.totalCustomers.toLocaleString("en") },
    {
      label: "Couriers",
      value: stats.totalCouriers.toLocaleString("en"),
      note: `${stats.activeCouriers.toLocaleString("en")} active accounts`,
    },
    {
      label: "Cancelled or returned",
      value: (stats.cancelledParcels + stats.returnedParcels).toLocaleString("en"),
      note: `${stats.cancelledParcels} cancelled · ${stats.returnedParcels} returned`,
    },
    {
      label: "Failed delivery attempts",
      value: stats.totalFailedDeliveryAttempts.toLocaleString("en"),
    },
  ];

  return (
    <section aria-labelledby="totals-heading" className="space-y-3">
      <h2 id="totals-heading" className="eyebrow">
        All time
      </h2>
      <dl className="bg-border grid grid-cols-2 gap-px overflow-hidden rounded-xl border md:grid-cols-3 xl:grid-cols-6">
        {items.map((item) => (
          <div key={item.label} className="bg-card space-y-1 p-4">
            <dt className="text-muted-foreground text-xs">{item.label}</dt>
            <dd className="text-lg font-semibold tracking-tight tabular-nums">{item.value}</dd>
            {item.note && <dd className="text-muted-foreground text-xs">{item.note}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}
