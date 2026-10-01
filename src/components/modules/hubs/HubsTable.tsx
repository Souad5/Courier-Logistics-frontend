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
import { DEFAULT_SORT_OPTIONS, type SortOption, SortSelect } from "@/components/shared/SortSelect";
import { TableToolbar } from "@/components/shared/TableToolbar";
import { PRICING } from "@/config/content";
import { useDeleteHub, useHubs } from "@/hooks/useHubs";
import { usePagination } from "@/hooks/usePagination";
import { useI18n } from "@/i18n/client";
import { getErrorMessage } from "@/lib/api-client";
import type { Hub } from "@/types";

// Within the backend's sortableFields (hub.service.ts).
const HUB_SORT: SortOption[] = [
  ...DEFAULT_SORT_OPTIONS,
  { value: "name:asc", key: "nameAsc" },
  { value: "city:asc", key: "cityAsc" },
  { value: "zoneName:asc", key: "zoneAsc" },
];

/**
 * Admin view: all hubs with create, edit, and delete actions.
 * Must render inside <Suspense>.
 */
export function HubsTable() {
  const { t, f, format } = useI18n();
  const labels = t.hubs;
  const pagination = usePagination();
  const { query, setPage, setLimit, setSearch, setFilter } = pagination;
  const { data, isLoading, isFetching, error, refetch } = useHubs(query);
  const deleteHub = useDeleteHub();

  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
  const [hubToDelete, setHubToDelete] = useState<Hub | null>(null);

  const columns: DataTableColumn<Hub>[] = [
    { key: "name", header: labels.columns.name, cell: (h) => h.name },
    {
      key: "code",
      header: labels.columns.code,
      cell: (h) => <span className="font-mono text-sm">{h.code}</span>,
    },
    { key: "zone", header: labels.columns.zone, cell: (h) => h.zoneName || h.zoneCode },
    { key: "city", header: labels.columns.city, cell: (h) => h.city || "—" },
    { key: "created", header: labels.columns.created, cell: (h) => f.date(h.createdAt) },
    {
      key: "actions",
      header: labels.columns.actions,
      align: "right",
      cell: (h) => (
        <div className="flex items-center justify-end gap-2">
          <AppButton variant="link" size="sm" onClick={() => setSelectedHub(h)}>
            {labels.edit}
          </AppButton>
          <AppButton
            variant="link"
            size="sm"
            className="text-destructive"
            onClick={() => setHubToDelete(h)}
          >
            {labels.delete}
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
        emptyMessage={labels.empty}
        emptyDescription={labels.emptyDescription}
        toolbar={
          <TableToolbar
            start={
              <>
                <SearchInput
                  value={String(query.search ?? "")}
                  onSearch={setSearch}
                  placeholder={labels.search}
                  label={labels.searchLabel}
                />
                <ClearFiltersButton pagination={pagination} />
              </>
            }
            end={
              <>
                <FilterSelect
                  label={labels.zoneFilter}
                  value={query.zoneCode as string | undefined}
                  allLabel={labels.allZones}
                  options={PRICING.zones.map((z) => ({
                    value: z.code,
                    label: t.enums.zone[z.code] ?? z.code,
                  }))}
                  onChange={(v) => setFilter("zoneCode", v)}
                />
                <SortSelect pagination={pagination} options={HUB_SORT} />
                <AppButton
                  className="col-span-2 sm:col-auto"
                  leftIcon={<Plus />}
                  onClick={() => setSelectedHub({} as Hub)}
                >
                  {labels.create}
                </AppButton>
              </>
            }
          />
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
          title={labels.deleteTitle}
          description={format(labels.deleteDescription, { name: hubToDelete.name })}
          onConfirm={() => deleteHub.mutateAsync(hubToDelete.id)}
          open
          onOpenChange={(open) => !open && setHubToDelete(null)}
          destructive
        />
      )}
    </>
  );
}
