"use client";

import { ParcelFilters } from "@/components/modules/parcels/ParcelFilters";
import { PayNowButton } from "@/components/modules/payments/PayNowButton";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePagination } from "@/hooks/usePagination";
import { useMyParcels } from "@/hooks/useParcels";
import { useI18n } from "@/i18n/client";
import { getErrorMessage } from "@/lib/api-client";
import type { Parcel } from "@/types";

/**
 * GET /parcels/my-parcels — the backend scopes it by role (sender for
 * customers, assigned courier for couriers). Must render inside <Suspense>.
 */
export function MyParcelsTable({ showPayAction = false }: { showPayAction?: boolean }) {
  const { t, f } = useI18n();
  const pagination = usePagination();
  const { query, setPage, setLimit } = pagination;

  const { data, isLoading, isFetching, error, refetch } = useMyParcels(query);

  const columns: DataTableColumn<Parcel>[] = [
    {
      key: "tracking",
      header: t.customer.table.tracking,
      cell: (p) => <span className="font-mono text-sm">{p.trackingNumber}</span>,
    },
    { key: "receiver", header: t.customer.table.receiver, cell: (p) => p.receiverName },
    {
      key: "route",
      header: t.customer.table.route,
      className: "min-w-40 max-w-56 whitespace-normal",
      cell: (p) => (
        <span className="text-muted-foreground text-sm">
          {p.originHub?.name ?? "—"} → {p.destinationHub?.name ?? "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: t.customer.table.status,
      cell: (p) => <StatusBadge status={p.status} />,
    },
    { key: "created", header: t.customer.table.booked, cell: (p) => f.date(p.createdAt) },
    {
      key: "fee",
      header: t.customer.table.fee,
      align: "right",
      cell: (p) => <span className="tabular-nums">{f.currency(p.fee, p.currency)}</span>,
    },
  ];

  if (showPayAction) {
    columns.push({
      key: "actions",
      header: t.customer.table.actions,
      align: "right",
      cell: (p) =>
        p.status === "PENDING" && p.payment?.status !== "PAID" ? (
          <PayNowButton parcelId={p.id} />
        ) : null,
    });
  }

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
      emptyMessage={t.customer.table.empty}
      toolbar={<ParcelFilters pagination={pagination} />}
      emptyDescription={t.customer.table.emptyDescription}
    />
  );
}
