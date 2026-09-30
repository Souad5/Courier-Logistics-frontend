"use client";

import { useState } from "react";
import { HubFormDialog } from "@/components/modules/hubs/HubFormDialog";
import { AppButton } from "@/components/shared/AppButton";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { useDeleteHub, useHubs } from "@/hooks/useHubs";
import { getErrorMessage } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import type { Hub } from "@/types";

/**
 * Admin view: all hubs with create, edit, and delete actions.
 * Must render inside <Suspense>.
 */
export function HubsTable() {
  const { data, isLoading, error, refetch } = useHubs({ limit: 1000 });
  const deleteHub = useDeleteHub();

  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
  const [hubToDelete, setHubToDelete] = useState<Hub | null>(null);

  const columns: DataTableColumn<Hub>[] = [
    { key: "name", header: "Hub Name", cell: (h) => h.name },
    { key: "code", header: "Code", cell: (h) => h.code },
    { key: "zone", header: "Zone", cell: (h) => h.zoneName || h.zoneCode },
    { key: "city", header: "City", cell: (h) => h.city || "—" },
    { key: "created", header: "Created", cell: (h) => formatDate(h.createdAt) },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (h) => (
        <div className="flex items-center justify-end gap-2">
          <AppButton variant="link" size="sm" onClick={() => setSelectedHub(h)}>
            Edit
          </AppButton>
          <AppButton
            variant="link"
            size="sm"
            className="text-destructive"
            onClick={() => setHubToDelete(h)}
          >
            Delete
          </AppButton>
        </div>
      ),
    },
  ];

  if (error) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;

  return (
    <>
      <div className="mb-4">
        <AppButton onClick={() => setSelectedHub({} as Hub)} size="sm">
          Create Hub
        </AppButton>
      </div>

      <DataTable
        columns={columns}
        data={data?.data.hubs}
        getRowId={(h) => h.id}
        loading={isLoading}
        emptyMessage="No hubs yet."
        emptyDescription="Create a hub to start routing parcels."
      />

      {selectedHub && (
        <HubFormDialog
          hub={selectedHub?.id ? selectedHub : undefined}
          onClose={() => setSelectedHub(null)}
        />
      )}

      {hubToDelete && (
        <ConfirmDialog
          title="Delete Hub"
          description={`Are you sure you want to delete "${hubToDelete.name}"? This cannot be undone.`}
          onConfirm={() => deleteHub.mutateAsync(hubToDelete.id)}
          open
          onOpenChange={(open) => !open && setHubToDelete(null)}
          destructive
        />
      )}
    </>
  );
}
