"use client";

import { PayNowButton } from "@/components/modules/payments/PayNowButton";
import { ClearFiltersButton } from "@/components/shared/ClearFiltersButton";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { SearchInput } from "@/components/shared/SearchInput";
import { DEFAULT_SORT_OPTIONS, type SortOption, SortSelect } from "@/components/shared/SortSelect";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableToolbar } from "@/components/shared/TableToolbar";
import { usePagination } from "@/hooks/usePagination";
import { useMyParcels } from "@/hooks/useParcels";
import { useI18n } from "@/i18n/client";
import { getErrorMessage } from "@/lib/api-client";
import type { Parcel } from "@/types";

const PAYMENT_SORT: SortOption[] = [
  ...DEFAULT_SORT_OPTIONS,
  { value: "fee:desc", key: "amountDesc" },
  { value: "fee:asc", key: "amountAsc" },
];

const canPay = (p: Parcel) => p.status === "PENDING" && p.payment?.status !== "PAID";

/**
 * Payment status per parcel. There is no "list my payments" endpoint, so this pages
 * through /parcels/my-parcels and reads each parcel's payment. Must render inside <Suspense>.
 */
export function PaymentsTable() {
  const { t, f, format } = useI18n();
  const pagination = usePagination();
  const { query, setPage, setLimit, setSearch } = pagination;
  const { data, isLoading, isFetching, error, refetch } = useMyParcels(query);

  const columns: DataTableColumn<Parcel>[] = [
    {
      key: "tracking",
      header: t.payments.table.parcel,
      cell: (p) => (
        <div>
          <div className="font-mono text-sm font-semibold">{p.trackingNumber}</div>
          <div className="text-muted-foreground text-sm">
            {format(t.payments.table.to, { name: p.receiverName })}
          </div>
        </div>
      ),
    },
    {
      key: "paymentStatus",
      header: t.payments.table.payment,
      cell: (p) =>
        p.payment ? (
          <StatusBadge kind="payment" status={p.payment.status} />
        ) : (
          <span className="text-muted-foreground text-sm">{t.payments.table.notStarted}</span>
        ),
    },
    {
      key: "paidAt",
      header: t.payments.table.paidAt,
      cell: (p) => (p.payment?.paidAt ? f.date(p.payment.paidAt, true) : "—"),
    },
    {
      key: "fee",
      header: t.payments.table.amount,
      align: "right",
      cell: (p) => (
        <span className="font-medium tabular-nums">{f.currency(p.fee, p.currency)}</span>
      ),
    },
    {
      key: "actions",
      header: t.payments.table.actions,
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
      emptyMessage={t.payments.table.empty}
      emptyDescription={t.payments.table.emptyDescription}
      toolbar={
        <TableToolbar
          start={
            <>
              <SearchInput
                value={String(query.search ?? "")}
                onSearch={setSearch}
                placeholder={t.payments.table.searchPlaceholder}
                label={t.payments.table.searchLabel}
              />
              <ClearFiltersButton pagination={pagination} />
            </>
          }
          end={<SortSelect pagination={pagination} options={PAYMENT_SORT} />}
        />
      }
    />
  );
}
