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
import { useI18n } from "@/i18n/client";
import { getErrorMessage } from "@/lib/api-client";
import type { Parcel } from "@/types";

/**
 * Admin view: all parcels with assign and status update actions.
 * Must render inside <Suspense>.
 */
export function AllParcelsTable() {
  const { t, f } = useI18n();
  const columnLabels = t.parcels.columns;
  const pagination = usePagination();
  const { query, setPage, setLimit } = pagination;

  const { data, isLoading, isFetching, error, refetch } = useParcels(query);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [updateStatusParcel, setUpdateStatusParcel] = useState<Parcel | null>(null);

  const columns: DataTableColumn<Parcel>[] = [
    {
      key: "tracking",
      header: columnLabels.tracking,
      cell: (p) => <span className="font-mono text-sm">{p.trackingNumber}</span>,
    },
    { key: "sender", header: columnLabels.sender, cell: (p) => p.sender?.name ?? "—" },
    { key: "receiver", header: columnLabels.receiver, cell: (p) => p.receiverName },
    {
      key: "courier",
      header: columnLabels.courier,
      cell: (p) =>
        p.courier?.name ?? <span className="text-muted-foreground">{t.parcels.unassigned}</span>,
    },
    { key: "status", header: columnLabels.status, cell: (p) => <StatusBadge status={p.status} /> },
    { key: "created", header: columnLabels.booked, cell: (p) => f.date(p.createdAt) },
    {
      key: "fee",
      header: columnLabels.fee,
      align: "right",
      cell: (p) => <span className="tabular-nums">{f.currency(p.fee, p.currency)}</span>,
    },
    {
      key: "actions",
      header: columnLabels.actions,
      align: "right",
      cell: (p) => (
        <div className="flex items-center justify-end gap-2">
          {!p.courierId && (
            <AppButton variant="link" size="sm" onClick={() => setSelectedParcel(p)}>
              {t.parcels.actions.assign}
            </AppButton>
          )}
          <AppButton variant="link" size="sm" onClick={() => setUpdateStatusParcel(p)}>
            {t.parcels.actions.update}
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
        onLimitChange={setLimit}
        emptyMessage={t.parcels.allTable.empty}
        toolbar={<ParcelFilters pagination={pagination} admin />}
        emptyDescription={t.parcels.allTable.emptyDescription}
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
