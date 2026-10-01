"use client";

import { ArrowRight, Boxes, CreditCard, PackageCheck, PackagePlus } from "lucide-react";
import Link from "next/link";

import { PayNowButton } from "@/components/modules/payments/PayNowButton";
import { AppButton } from "@/components/shared/AppButton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyParcels } from "@/hooks/useParcels";
import { useI18n } from "@/i18n/client";
import { getErrorMessage } from "@/lib/api-client";

const SKELETON_KEYS = ["a", "b", "c", "d"];

/** Customer landing page: headline counts, what needs payment, and the latest shipments. */
export function CustomerOverview() {
  const { t, f, format } = useI18n();
  const recent = useMyParcels({ limit: 5 });
  const pending = useMyParcels({ limit: 1, status: "PENDING" });
  const delivered = useMyParcels({ limit: 1, status: "DELIVERED" });

  const error = recent.error ?? pending.error ?? delivered.error;
  if (error) {
    return (
      <ErrorState
        message={getErrorMessage(error)}
        onRetry={() => {
          recent.refetch();
          pending.refetch();
          delivered.refetch();
        }}
      />
    );
  }

  const parcels = recent.data?.data.parcels ?? [];
  const awaitingPayment = parcels.filter(
    (p) => p.status === "PENDING" && p.payment?.status !== "PAID",
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title={t.customer.stats.total}
          value={f.number(recent.data?.meta?.total ?? 0)}
          icon={Boxes}
          loading={recent.isLoading}
        />
        <StatCard
          title={t.customer.stats.pending}
          value={f.number(pending.data?.meta?.total ?? 0)}
          hint={t.customer.stats.pendingHint}
          icon={CreditCard}
          loading={pending.isLoading}
        />
        <StatCard
          title={t.customer.stats.delivered}
          value={f.number(delivered.data?.meta?.total ?? 0)}
          icon={PackageCheck}
          loading={delivered.isLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.customer.latest.title}</CardTitle>
          <CardDescription>
            {t.customer.latest.description}
            {awaitingPayment.length > 0 &&
              ` ${format(t.customer.latest.awaitingPayment, { n: f.number(awaitingPayment.length) })}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recent.isLoading ? (
            <div className="space-y-3">
              {SKELETON_KEYS.map((key) => (
                <Skeleton key={key} className="h-14 w-full" />
              ))}
            </div>
          ) : parcels.length === 0 ? (
            <EmptyState
              icon={PackagePlus}
              title={t.customer.latest.emptyTitle}
              description={t.customer.latest.emptyDescription}
              action={
                <AppButton asChild>
                  <Link href="/customer/parcels/new">{t.customer.latest.sendParcel}</Link>
                </AppButton>
              }
            />
          ) : (
            <ul className="divide-y">
              {parcels.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/track/${p.trackingNumber}`}
                      className="font-mono text-sm font-semibold hover:underline"
                    >
                      {p.trackingNumber}
                    </Link>
                    <p className="text-muted-foreground truncate text-sm">
                      {format(t.customer.latest.to, {
                        name: p.receiverName,
                        date: f.date(p.createdAt),
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm tabular-nums">{f.currency(p.fee, p.currency)}</span>
                    <StatusBadge status={p.status} />
                    {p.status === "PENDING" && p.payment?.status !== "PAID" && (
                      <PayNowButton parcelId={p.id} />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {parcels.length > 0 && (
            <AppButton asChild variant="link" className="mt-4 px-0">
              <Link href="/customer/parcels">
                {t.customer.latest.viewAll} <ArrowRight />
              </Link>
            </AppButton>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
