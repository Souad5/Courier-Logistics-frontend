"use client";

import { useEffect, useState } from "react";

import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusUpdateDialog } from "@/components/modules/parcels/StatusUpdateDialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { useMyParcels } from "@/hooks/useParcels";
import { getErrorMessage } from "@/lib/api-client";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Parcel } from "@/types";

/**
 * Courier view: parcels assigned to me with status update actions.
 * The backend scopes useMyParcels by role (couriers get assigned parcels).
 * Must render inside <Suspense>.
 */
export function CourierTasksTable() {
  const { query, setPage } = usePagination();
  const [updateStatusParcel, setUpdateStatusParcel] = useState<Parcel | null>(null);

  const { data, isLoading, isFetching, error } = useMyParcels(query);

  const columns: DataTableColumn<Parcel>[] = [
    {
      key: "tracking",
      header: "Tracking #",
      cell: (p) => <span className="font-mono text-xs">{p.trackingNumber}</span>,
    },
    { key: "sender", header: "Sender", cell: (p) => p.sender?.name ?? "—" },
    { key: "receiver", header: "Receiver", cell: (p) => p.receiverName },
    {
      key: "route",
      header: "Route",
      cell: (p) => (
        <span className="text-muted-foreground text-xs">
          {p.originHub?.name ?? "—"} → {p.destinationHub?.name ?? "—"}
        </span>
      ),
    },
    { key: "status", header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
    { key: "fee", header: "Delivery Fee", cell: (p) => formatCurrency(p.fee, p.currency) },
    { key: "created", header: "Booked", cell: (p) => formatDate(p.createdAt) },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (p) => (
        <button
          className="text-xs text-amber-600 hover:underline"
          onClick={() => setUpdateStatusParcel(p)}
        >
          Update Status
        </button>
      ),
    },
  ];

  if (error) return <p className="text-destructive text-sm">{getErrorMessage(error)}</p>;

  return (
    <>
      <DataTable
        columns={columns}
        data={data?.data.parcels}
        getRowId={(p) => p.id}
        loading={isLoading || isFetching}
        meta={data?.meta}
        onPageChange={setPage}
        emptyMessage="No tasks assigned to you yet."
      />
      {updateStatusParcel && (
        <StatusUpdateDialog
          parcel={updateStatusParcel}
          onClose={() => setUpdateStatusParcel(null)}
        />
      )}
    </>
  );
}
