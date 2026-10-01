"use client";

import { ClearFiltersButton } from "@/components/shared/ClearFiltersButton";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { SearchInput } from "@/components/shared/SearchInput";
import { DEFAULT_SORT_OPTIONS, SortSelect } from "@/components/shared/SortSelect";
import { useHubs } from "@/hooks/useHubs";
import type { usePagination } from "@/hooks/usePagination";
import { humanize } from "@/lib/utils";
import { PARCEL_STATUSES, PARCEL_TYPES } from "@/types/enums";

// Must stay within the backend's sortableFields for each list (parcel.service.ts).
const MINE_SORT = [
  ...DEFAULT_SORT_OPTIONS,
  { value: "fee:desc", label: "Fee: high to low" },
  { value: "fee:asc", label: "Fee: low to high" },
];
const ADMIN_SORT = [
  ...MINE_SORT,
  { value: "weightKg:desc", label: "Heaviest first" },
  { value: "weightKg:asc", label: "Lightest first" },
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
  const { query, setSearch, setFilter } = pagination;

  return (
    <>
      {searchable && (
        <SearchInput
          value={String(query.search ?? "")}
          onSearch={setSearch}
          placeholder={admin ? "Tracking #, sender or receiver…" : "Tracking # or receiver…"}
          label="Search parcels"
        />
      )}
      <FilterSelect
        label="Filter by status"
        value={query.status as string | undefined}
        allLabel="All statuses"
        options={PARCEL_STATUSES.map((s) => ({ value: s, label: humanize(s) }))}
        onChange={(v) => setFilter("status", v)}
      />
      {admin && <AdminParcelFilters pagination={pagination} />}
      <SortSelect pagination={pagination} options={admin ? ADMIN_SORT : MINE_SORT} />
      <ClearFiltersButton pagination={pagination} />
    </>
  );
}

function AdminParcelFilters({ pagination }: { pagination: ReturnType<typeof usePagination> }) {
  const { query, setFilter } = pagination;
  const { data } = useHubs({ limit: 100 });
  const hubOptions = (data?.data.hubs ?? []).map((h) => ({ value: h.id, label: h.name }));

  return (
    <>
      <FilterSelect
        label="Filter by type"
        value={query.type as string | undefined}
        allLabel="All types"
        options={PARCEL_TYPES.map((t) => ({ value: t, label: humanize(t) }))}
        onChange={(v) => setFilter("type", v)}
      />
      <FilterSelect
        label="Filter by origin hub"
        value={query.originHubId as string | undefined}
        allLabel="Any origin"
        options={hubOptions}
        onChange={(v) => setFilter("originHubId", v)}
      />
      <FilterSelect
        label="Filter by destination hub"
        value={query.destinationHubId as string | undefined}
        allLabel="Any destination"
        options={hubOptions}
        onChange={(v) => setFilter("destinationHubId", v)}
      />
    </>
  );
}
