"use client";

import { CircleCheck, Clock, Wallet } from "lucide-react";

import { StatCard } from "@/components/shared/StatCard";
import { useMyParcels } from "@/hooks/useParcels";
import { useI18n } from "@/i18n/client";

const SAMPLE = 100; // backend page-size cap

/**
 * Totals for the payments page. There is no payments endpoint, so this reads the
 * latest 100 parcels and says so when the customer has more than that.
 */
export function PaymentsSummary() {
  const { t, f, format } = useI18n();
  const { data, isLoading } = useMyParcels({ limit: SAMPLE });
  const parcels = data?.data.parcels ?? [];
  const total = data?.meta?.total ?? 0;

  const paid = parcels.filter((p) => p.payment?.status === "PAID");
  const awaiting = parcels.filter((p) => p.status === "PENDING" && p.payment?.status !== "PAID");
  const sum = (list: typeof parcels) => list.reduce((acc, p) => acc + Number(p.fee), 0);
  const sampled =
    total > SAMPLE ? format(t.payments.summary.sampled, { n: f.number(SAMPLE) }) : undefined;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        title={t.payments.summary.totalPaid}
        value={f.currency(sum(paid))}
        icon={Wallet}
        hint={sampled}
        loading={isLoading}
      />
      <StatCard
        title={t.payments.summary.awaiting}
        value={f.currency(sum(awaiting))}
        icon={Clock}
        hint={format(
          awaiting.length === 1 ? t.payments.summary.toPayOne : t.payments.summary.toPayMany,
          { n: f.number(awaiting.length) },
        )}
        loading={isLoading}
      />
      <StatCard
        title={t.payments.summary.paidParcels}
        value={f.number(paid.length)}
        icon={CircleCheck}
        hint={sampled}
        loading={isLoading}
      />
    </div>
  );
}
