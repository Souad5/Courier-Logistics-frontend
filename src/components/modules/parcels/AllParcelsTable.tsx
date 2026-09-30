"use client";

import { useState } from "react";
import { AssignParcelDialog } from "@/components/modules/parcels/AssignParcelDialog";
import { ParcelFilters } from "@/components/modules/parcels/ParcelFilters";
import { StatusUpdateDialog } from "@/components/modules/parcels/StatusUpdateDialog";
import { AppButton } from "@/components/shared/AppButton";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePagination } from "@/hooks/usePagination";
import { useParcels } from "@/hooks/useParcels";
import { getErrorMessage } from "@/lib/api-client";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Parcel } from "@/types";

/**
 * Admin view: all parcels with assign and status update actions.
 * Must render inside <Suspense>.
 */
export function AllParcelsTable() {
  const pagination = usePagination();
  const { query, setPage } = pagination;

  const { data, isLoading, isFetching, error, refetch } = useParcels(query);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [updateStatusParcel, setUpdateStatusParcel] = useState<Parcel | null>(null);

  const columns: DataTableColumn<Parcel>[] = [
    {
      key: "tracking",
      header: "Tracking #",
      cell: (p) => <span className="font-mono text-xs">{p.trackingNumber}</span>,
    },
    { key: "sender", header: "Sender", cell: (p) => p.sender?.name ?? "—" },
    { key: "receiver", header: "Receiver", cell: (p) => p.receiverName },
    {
      key: "courier",
      header: "Courier",
      cell: (p) => p.courier?.name ?? <span className="text-muted-foreground">Unassigned</span>,
    },
    { key: "status", header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
    { key: "fee", header: "Fee", cell: (p) => formatCurrency(p.fee, p.currency) },
    { key: "created", header: "Booked", cell: (p) => formatDate(p.createdAt) },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (p) => (
        <div className="flex items-center justify-end gap-2">
          {!p.courierId && (
            <AppButton variant="link" size="sm" onClick={() => setSelectedParcel(p)}>
              Assign
            </AppButton>
          )}
          <AppButton variant="link" size="sm" onClick={() => setUpdateStatusParcel(p)}>
            Update
          </AppButton>
        </div>
      ),
    },
  ];

  if (error) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;

  return (
    <>
      <DataTable
        columns={columns}
        data={data?.data.parcels}
        getRowId={(p) => p.id}
        loading={isLoading || isFetching}
        meta={data?.meta}
        onPageChange={setPage}
        emptyMessage="No parcels yet."
        toolbar={<ParcelFilters pagination={pagination} />}
        emptyDescription="Try changing the search or status filter."
      />
      {selectedParcel && (
        <AssignParcelDialog parcel={selectedParcel} onClose={() => setSelectedParcel(null)} />
      )}
      {updateStatusParcel && (
        <StatusUpdateDialog
          parcel={updateStatusParcel}
          onClose={() => setUpdateStatusParcel(null)}
        />
      )}
    </>
  );
}
