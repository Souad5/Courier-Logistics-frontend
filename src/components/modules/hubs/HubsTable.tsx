"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { HubFormDialog } from "@/components/modules/hubs/HubFormDialog";
import { AppButton } from "@/components/shared/AppButton";
import { ClearFiltersButton } from "@/components/shared/ClearFiltersButton";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { SearchInput } from "@/components/shared/SearchInput";
import { DEFAULT_SORT_OPTIONS, SortSelect } from "@/components/shared/SortSelect";
import { PRICING } from "@/config/content";
import { useDeleteHub, useHubs } from "@/hooks/useHubs";
import { usePagination } from "@/hooks/usePagination";
import { getErrorMessage } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import type { Hub } from "@/types";

// Within the backend's sortableFields (hub.service.ts).
const HUB_SORT = [
  ...DEFAULT_SORT_OPTIONS,
  { value: "name:asc", label: "Name: A to Z" },
  { value: "city:asc", label: "City: A to Z" },
  { value: "zoneName:asc", label: "Zone: A to Z" },
];

/**
 * Admin view: all hubs with create, edit, and delete actions.
 * Must render inside <Suspense>.
 */
export function HubsTable() {
  const pagination = usePagination();
  const { query, setPage, setLimit, setSearch, setFilter } = pagination;
  const { data, isLoading, isFetching, error, refetch } = useHubs(query);
  const deleteHub = useDeleteHub();

  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
  const [hubToDelete, setHubToDelete] = useState<Hub | null>(null);

  const columns: DataTableColumn<Hub>[] = [
    { key: "name", header: "Hub name", cell: (h) => h.name },
    {
      key: "code",
      header: "Code",
      cell: (h) => <span className="font-mono text-sm">{h.code}</span>,
    },
    { key: "zone", header: "Zone", cell: (h) => h.zoneName || h.zoneCode },
    { key: "city", header: "City", cell: (h) => h.city || "—" },
    { key: "created", header: "Created", cell: (h) => formatDate(h.createdAt) },
    {
      key: "actions",
      header: "Actions",
      align: "right",
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
      <DataTable
        columns={columns}
        data={data?.data.hubs}
        getRowId={(h) => h.id}
        loading={isLoading || isFetching}
        meta={data?.meta}
        onPageChange={setPage}
        onLimitChange={setLimit}
        emptyMessage="No hubs found."
        emptyDescription="Try changing the search or zone filter, or create a hub."
        toolbar={
          <>
            <SearchInput
              value={String(query.search ?? "")}
              onSearch={setSearch}
              placeholder="Search name, zone or city…"
              label="Search hubs"
            />
            <FilterSelect
              label="Filter by zone"
              value={query.zoneCode as string | undefined}
              allLabel="All zones"
              options={PRICING.zones.map((z) => ({ value: z.code, label: z.label }))}
              onChange={(v) => setFilter("zoneCode", v)}
            />
            <SortSelect pagination={pagination} options={HUB_SORT} />
            <ClearFiltersButton pagination={pagination} />
            <AppButton
              className="sm:ml-auto"
              leftIcon={<Plus />}
              onClick={() => setSelectedHub({} as Hub)}
            >
              Create hub
            </AppButton>
          </>
        }
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
