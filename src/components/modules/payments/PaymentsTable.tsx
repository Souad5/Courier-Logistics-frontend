"use client";

import { PayNowButton } from "@/components/modules/payments/PayNowButton";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { SortSelect } from "@/components/shared/SortSelect";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePagination } from "@/hooks/usePagination";
import { useMyParcels } from "@/hooks/useParcels";
import { getErrorMessage } from "@/lib/api-client";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Parcel } from "@/types";

const canPay = (p: Parcel) => p.status === "PENDING" && p.payment?.status !== "PAID";

/**
 * Payment status per parcel. There is no "list my payments" endpoint, so this pages
 * through /parcels/my-parcels and reads each parcel's payment. Must render inside <Suspense>.
 */
export function PaymentsTable() {
  const { query, setPage, setFilter } = usePagination();
  const { data, isLoading, isFetching, error, refetch } = useMyParcels(query);

  const columns: DataTableColumn<Parcel>[] = [
    {
      key: "tracking",
      header: "Parcel",
      cell: (p) => (
        <div>
          <div className="font-mono text-xs font-semibold">{p.trackingNumber}</div>
          <div className="text-muted-foreground text-xs">To {p.receiverName}</div>
        </div>
      ),
    },
    {
      key: "fee",
      header: "Amount",
      className: "text-right",
      cell: (p) => <span className="tabular-nums">{formatCurrency(p.fee, p.currency)}</span>,
    },
    {
      key: "paymentStatus",
      header: "Payment",
      cell: (p) =>
        p.payment ? (
          <StatusBadge kind="payment" status={p.payment.status} />
        ) : (
          <span className="text-muted-foreground text-xs">Not started</span>
        ),
    },
    {
      key: "paidAt",
      header: "Paid at",
      cell: (p) => (p.payment?.paidAt ? formatDate(p.payment.paidAt, true) : "—"),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (p) => (canPay(p) ? <PayNowButton parcelId={p.id} /> : null),
    },
  ];

  if (error) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;

  return (
    <DataTable
      columns={columns}
      data={data?.data.parcels}
      getRowId={(p) => p.id}
      loading={isLoading || isFetching}
      meta={data?.meta}
      onPageChange={setPage}
      emptyMessage="No payments yet."
      emptyDescription="Book a parcel and pay for it — the transaction will show up here."
      toolbar={
        <SortSelect
          value={query.sortOrder as string | undefined}
          onChange={(v) => setFilter("sortOrder", v)}
        />
      }
    />
  );
}
