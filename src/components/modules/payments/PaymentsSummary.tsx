"use client";

import { CircleCheck, Clock, Wallet } from "lucide-react";

import { StatCard } from "@/components/shared/StatCard";
import { useMyParcels } from "@/hooks/useParcels";
import { formatCurrency } from "@/lib/utils";

const SAMPLE = 100; // backend page-size cap

/**
 * Totals for the payments page. There is no payments endpoint, so this reads the
 * latest 100 parcels and says so when the customer has more than that.
 */
export function PaymentsSummary() {
  const { data, isLoading } = useMyParcels({ limit: SAMPLE });
  const parcels = data?.data.parcels ?? [];
  const total = data?.meta?.total ?? 0;

  const paid = parcels.filter((p) => p.payment?.status === "PAID");
  const awaiting = parcels.filter((p) => p.status === "PENDING" && p.payment?.status !== "PAID");
  const sum = (list: typeof parcels) => list.reduce((acc, p) => acc + Number(p.fee), 0);
  const sampled = total > SAMPLE ? `Across your latest ${SAMPLE} parcels` : undefined;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        title="Total paid"
        value={formatCurrency(sum(paid))}
        icon={Wallet}
        hint={sampled}
        loading={isLoading}
      />
      <StatCard
        title="Awaiting payment"
        value={formatCurrency(sum(awaiting))}
        icon={Clock}
        hint={`${awaiting.length} parcel${awaiting.length === 1 ? "" : "s"} to pay`}
        loading={isLoading}
      />
      <StatCard
        title="Paid parcels"
        value={paid.length}
        icon={CircleCheck}
        hint={sampled}
        loading={isLoading}
      />
    </div>
  );
}
