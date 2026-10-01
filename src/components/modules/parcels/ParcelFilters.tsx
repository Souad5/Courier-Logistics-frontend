"use client";

import { ClearFiltersButton } from "@/components/shared/ClearFiltersButton";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { SearchInput } from "@/components/shared/SearchInput";
import { DEFAULT_SORT_OPTIONS, type SortOption, SortSelect } from "@/components/shared/SortSelect";
import { TableToolbar } from "@/components/shared/TableToolbar";
import { useHubs } from "@/hooks/useHubs";
import type { usePagination } from "@/hooks/usePagination";
import { useI18n } from "@/i18n/client";
import { PARCEL_STATUSES, PARCEL_TYPES } from "@/types/enums";

// Must stay within the backend's sortableFields for each list (parcel.service.ts).
const MINE_SORT: SortOption[] = [
  ...DEFAULT_SORT_OPTIONS,
  { value: "fee:desc", key: "feeDesc" },
  { value: "fee:asc", key: "feeAsc" },
];
const ADMIN_SORT: SortOption[] = [
  ...MINE_SORT,
  { value: "weightKg:desc", key: "heaviestFirst" },
  { value: "weightKg:asc", key: "lightestFirst" },
];

/**
 * Toolbar for every parcel list; all state lives in the URL. `admin` adds the
 * filters only GET /parcels supports (type, origin and destination hub).
 */
export function ParcelFilters({
  pagination,
  searchable = true,
  admin = false,
}: {
  pagination: ReturnType<typeof usePagination>;
  searchable?: boolean;
  admin?: boolean;
}) {
  const { t } = useI18n();
  const labels = t.parcels.filters;
  const { query, setSearch, setFilter } = pagination;

  return (
    <TableToolbar
      start={
        <>
          {searchable && (
            <SearchInput
              value={String(query.search ?? "")}
              onSearch={setSearch}
              placeholder={admin ? labels.searchAdmin : labels.searchMine}
              label={labels.searchLabel}
            />
          )}
          <ClearFiltersButton pagination={pagination} />
        </>
      }
      end={
        <>
          <FilterSelect
            label={labels.status}
            value={query.status as string | undefined}
            allLabel={labels.allStatuses}
            options={PARCEL_STATUSES.map((s) => ({ value: s, label: t.enums.parcelStatus[s] }))}
            onChange={(v) => setFilter("status", v)}
          />
          {admin && <AdminParcelFilters pagination={pagination} />}
          <SortSelect pagination={pagination} options={admin ? ADMIN_SORT : MINE_SORT} />
        </>
      }
    />
  );
}

function AdminParcelFilters({ pagination }: { pagination: ReturnType<typeof usePagination> }) {
  const { t } = useI18n();
  const labels = t.parcels.filters;
  const { query, setFilter } = pagination;
  const { data } = useHubs({ limit: 100 });
  const hubOptions = (data?.data.hubs ?? []).map((h) => ({ value: h.id, label: h.name }));

  return (
    <>
      <FilterSelect
        label={labels.type}
        value={query.type as string | undefined}
        allLabel={labels.allTypes}
        options={PARCEL_TYPES.map((type) => ({ value: type, label: t.enums.parcelType[type] }))}
        onChange={(v) => setFilter("type", v)}
      />
      <FilterSelect
        label={labels.origin}
        value={query.originHubId as string | undefined}
        allLabel={labels.anyOrigin}
        options={hubOptions}
        onChange={(v) => setFilter("originHubId", v)}
      />
      <FilterSelect
        label={labels.destination}
        value={query.destinationHubId as string | undefined}
        allLabel={labels.anyDestination}
        options={hubOptions}
        onChange={(v) => setFilter("destinationHubId", v)}
      />
    </>
  );
}
