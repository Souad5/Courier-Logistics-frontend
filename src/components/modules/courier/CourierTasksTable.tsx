"use client";

import { useState } from "react";
import { ParcelFilters } from "@/components/modules/parcels/ParcelFilters";
import { ProofOfDeliveryDialog } from "@/components/modules/parcels/ProofOfDeliveryDialog";
import { StatusQuickFilters } from "@/components/modules/parcels/StatusQuickFilters";
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

const QUICK_FILTERS = [
  { label: "All assigned" },
  { label: "Out for delivery", status: "OUT_FOR_DELIVERY" as const },
  { label: "Delivery failed", status: "DELIVERY_FAILED" as const },
  { label: "Delivered", status: "DELIVERED" as const },
];

/**
 * Courier view: parcels assigned to me with status update actions.
 * The backend scopes useMyParcels by role (couriers get assigned parcels).
 * Must render inside <Suspense>.
 */
export function CourierTasksTable() {
  const pagination = usePagination();
  const { query, setPage, setLimit } = pagination;
  const [updateStatusParcel, setUpdateStatusParcel] = useState<Parcel | null>(null);
  const [proofParcel, setProofParcel] = useState<Parcel | null>(null);

  const { data, isLoading, isFetching, error, refetch } = useMyParcels(query);

  const columns: DataTableColumn<Parcel>[] = [
    {
      key: "tracking",
      header: "Tracking #",
      cell: (p) => <span className="font-mono text-sm">{p.trackingNumber}</span>,
    },
    { key: "sender", header: "Sender", cell: (p) => p.sender?.name ?? "—" },
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
      header: "Delivery fee",
      align: "right",
      cell: (p) => <span className="tabular-nums">{formatCurrency(p.fee, p.currency)}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
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
      <StatusQuickFilters pagination={pagination} items={QUICK_FILTERS} />
      <DataTable
        columns={columns}
        data={data?.data.parcels}
        getRowId={(p) => p.id}
        loading={isLoading || isFetching}
        meta={data?.meta}
        onPageChange={setPage}
        onLimitChange={setLimit}
        emptyMessage="No tasks assigned to you yet."
        emptyDescription="Parcels an admin assigns to you will show up here."
        toolbar={<ParcelFilters pagination={pagination} />}
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
