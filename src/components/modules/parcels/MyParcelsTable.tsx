"use client";

import { ParcelFilters } from "@/components/modules/parcels/ParcelFilters";
import { PayNowButton } from "@/components/modules/payments/PayNowButton";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePagination } from "@/hooks/usePagination";
import { useMyParcels } from "@/hooks/useParcels";
import { getErrorMessage } from "@/lib/api-client";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Parcel } from "@/types";

/**
 * GET /parcels/my-parcels — the backend scopes it by role (sender for
 * customers, assigned courier for couriers). Must render inside <Suspense>.
 */
export function MyParcelsTable({ showPayAction = false }: { showPayAction?: boolean }) {
  const pagination = usePagination();
  const { query, setPage, setLimit } = pagination;

  const { data, isLoading, isFetching, error, refetch } = useMyParcels(query);

  const columns: DataTableColumn<Parcel>[] = [
    {
      key: "tracking",
      header: "Tracking #",
      cell: (p) => <span className="font-mono text-sm">{p.trackingNumber}</span>,
    },
    { key: "receiver", header: "Receiver", cell: (p) => p.receiverName },
    {
      key: "route",
      header: "Route",
      cell: (p) => (
        <span className="text-muted-foreground text-sm">
          {p.originHub?.name ?? "—"} → {p.destinationHub?.name ?? "—"}
        </span>
      ),
    },
    { key: "status", header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
    { key: "created", header: "Booked", cell: (p) => formatDate(p.createdAt) },
    {
      key: "fee",
      header: "Fee",
      align: "right",
      cell: (p) => <span className="tabular-nums">{formatCurrency(p.fee, p.currency)}</span>,
    },
  ];

  if (showPayAction) {
    columns.push({
      key: "actions",
      header: "Actions",
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
      emptyMessage="No parcels yet."
      toolbar={<ParcelFilters pagination={pagination} />}
      emptyDescription="Try changing the search or status filter, or book a new parcel."
    />
  );
}
