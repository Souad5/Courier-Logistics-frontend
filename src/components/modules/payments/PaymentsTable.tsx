"use client";

import { PayNowButton } from "@/components/modules/payments/PayNowButton";
import { ClearFiltersButton } from "@/components/shared/ClearFiltersButton";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { SearchInput } from "@/components/shared/SearchInput";
import { DEFAULT_SORT_OPTIONS, SortSelect } from "@/components/shared/SortSelect";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePagination } from "@/hooks/usePagination";
import { useMyParcels } from "@/hooks/useParcels";
import { getErrorMessage } from "@/lib/api-client";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Parcel } from "@/types";

const PAYMENT_SORT = [
  ...DEFAULT_SORT_OPTIONS,
  { value: "fee:desc", label: "Amount: high to low" },
  { value: "fee:asc", label: "Amount: low to high" },
];

const canPay = (p: Parcel) => p.status === "PENDING" && p.payment?.status !== "PAID";

/**
 * Payment status per parcel. There is no "list my payments" endpoint, so this pages
 * through /parcels/my-parcels and reads each parcel's payment. Must render inside <Suspense>.
 */
export function PaymentsTable() {
  const pagination = usePagination();
  const { query, setPage, setLimit, setSearch } = pagination;
  const { data, isLoading, isFetching, error, refetch } = useMyParcels(query);

  const columns: DataTableColumn<Parcel>[] = [
    {
      key: "tracking",
      header: "Parcel",
      cell: (p) => (
        <div>
          <div className="font-mono text-sm font-semibold">{p.trackingNumber}</div>
          <div className="text-muted-foreground text-sm">To {p.receiverName}</div>
        </div>
      ),
    },
    {
      key: "paymentStatus",
      header: "Payment",
      cell: (p) =>
        p.payment ? (
          <StatusBadge kind="payment" status={p.payment.status} />
        ) : (
          <span className="text-muted-foreground text-sm">Not started</span>
        ),
    },
    {
      key: "paidAt",
      header: "Paid at",
      cell: (p) => (p.payment?.paidAt ? formatDate(p.payment.paidAt, true) : "—"),
    },
    {
      key: "fee",
      header: "Amount",
      align: "right",
      cell: (p) => (
        <span className="font-medium tabular-nums">{formatCurrency(p.fee, p.currency)}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
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
      onLimitChange={setLimit}
      emptyMessage="No payments yet."
      emptyDescription="Book a parcel and pay for it — the transaction will show up here."
      toolbar={
        <>
          <SearchInput
            value={String(query.search ?? "")}
            onSearch={setSearch}
            placeholder="Tracking # or receiver…"
            label="Search payments"
          />
          <SortSelect pagination={pagination} options={PAYMENT_SORT} />
          <ClearFiltersButton pagination={pagination} />
        </>
      }
    />
  );
}
