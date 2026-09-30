"use client";

import { useState } from "react";
import { ParcelFilters } from "@/components/modules/parcels/ParcelFilters";
import { ProofOfDeliveryDialog } from "@/components/modules/parcels/ProofOfDeliveryDialog";
import { StatusUpdateDialog } from "@/components/modules/parcels/StatusUpdateDialog";
import { AppButton } from "@/components/shared/AppButton";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatusBadge } from "@/components/shared/StatusBadge";
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
  const pagination = usePagination();
  const { query, setPage } = pagination;
  const [updateStatusParcel, setUpdateStatusParcel] = useState<Parcel | null>(null);
  const [proofParcel, setProofParcel] = useState<Parcel | null>(null);

  const { data, isLoading, isFetching, error, refetch } = useMyParcels(query);

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
        <div className="flex items-center justify-end gap-1">
          {(p.status === "OUT_FOR_DELIVERY" || p.status === "DELIVERED") && (
            <AppButton variant="link" size="sm" onClick={() => setProofParcel(p)}>
              Proof photo
            </AppButton>
          )}
          <AppButton variant="link" size="sm" onClick={() => setUpdateStatusParcel(p)}>
            Update status
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
        emptyMessage="No tasks assigned to you yet."
        emptyDescription="Parcels an admin assigns to you will show up here."
        toolbar={<ParcelFilters pagination={pagination} searchable={false} />}
      />
      {proofParcel && (
        <ProofOfDeliveryDialog parcel={proofParcel} onClose={() => setProofParcel(null)} />
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
