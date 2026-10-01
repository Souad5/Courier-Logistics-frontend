"use client";

import { useState } from "react";
import { ParcelFilters } from "@/components/modules/parcels/ParcelFilters";
import { ProofOfDeliveryDialog } from "@/components/modules/parcels/ProofOfDeliveryDialog";
import {
  type QuickFilter,
  StatusQuickFilters,
} from "@/components/modules/parcels/StatusQuickFilters";
import { StatusUpdateDialog } from "@/components/modules/parcels/StatusUpdateDialog";
import { AppButton } from "@/components/shared/AppButton";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePagination } from "@/hooks/usePagination";
import { useMyParcels } from "@/hooks/useParcels";
import { useI18n } from "@/i18n/client";
import { getErrorMessage } from "@/lib/api-client";
import type { Parcel } from "@/types";

/**
 * Courier view: parcels assigned to me with status update actions.
 * The backend scopes useMyParcels by role (couriers get assigned parcels).
 * Must render inside <Suspense>.
 */
export function CourierTasksTable() {
  const { t, f } = useI18n();
  const columnLabels = t.parcels.columns;
  const quick = t.courier.tasks.quickFilters;
  const quickFilters: QuickFilter[] = [
    { label: quick.all },
    { label: quick.outForDelivery, status: "OUT_FOR_DELIVERY" },
    { label: quick.deliveryFailed, status: "DELIVERY_FAILED" },
    { label: quick.delivered, status: "DELIVERED" },
  ];
  const pagination = usePagination();
  const { query, setPage, setLimit } = pagination;
  const [updateStatusParcel, setUpdateStatusParcel] = useState<Parcel | null>(null);
  const [proofParcel, setProofParcel] = useState<Parcel | null>(null);

  const { data, isLoading, isFetching, error, refetch } = useMyParcels(query);

  const columns: DataTableColumn<Parcel>[] = [
    {
      key: "tracking",
      header: columnLabels.tracking,
      cell: (p) => <span className="font-mono text-sm">{p.trackingNumber}</span>,
    },
    { key: "sender", header: columnLabels.sender, cell: (p) => p.sender?.name ?? "—" },
    { key: "receiver", header: columnLabels.receiver, cell: (p) => p.receiverName },
    {
      key: "route",
      header: columnLabels.route,
      className: "min-w-40 max-w-56 whitespace-normal",
      cell: (p) => (
        <span className="text-muted-foreground text-sm">
          {p.originHub?.name ?? "—"} → {p.destinationHub?.name ?? "—"}
        </span>
      ),
    },
    { key: "status", header: columnLabels.status, cell: (p) => <StatusBadge status={p.status} /> },
    { key: "created", header: columnLabels.booked, cell: (p) => f.date(p.createdAt) },
    {
      key: "fee",
      header: columnLabels.deliveryFee,
      align: "right",
      cell: (p) => <span className="tabular-nums">{f.currency(p.fee, p.currency)}</span>,
    },
    {
      key: "actions",
      header: columnLabels.actions,
      align: "right",
      cell: (p) => (
        <div className="flex flex-col items-end gap-0.5">
          {(p.status === "OUT_FOR_DELIVERY" || p.status === "DELIVERED") && (
            <AppButton variant="link" size="sm" onClick={() => setProofParcel(p)}>
              {t.parcels.actions.proofPhoto}
            </AppButton>
          )}
          <AppButton variant="link" size="sm" onClick={() => setUpdateStatusParcel(p)}>
            {t.parcels.actions.updateStatus}
          </AppButton>
        </div>
      ),
    },
  ];

  if (error) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;

  return (
    <>
      <StatusQuickFilters pagination={pagination} items={quickFilters} />
      <DataTable
        columns={columns}
        data={data?.data.parcels}
        getRowId={(p) => p.id}
        loading={isLoading || isFetching}
        meta={data?.meta}
        onPageChange={setPage}
        onLimitChange={setLimit}
        emptyMessage={t.courier.tasks.empty}
        emptyDescription={t.courier.tasks.emptyDescription}
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
