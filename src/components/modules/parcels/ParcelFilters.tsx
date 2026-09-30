"use client";

import { FilterSelect } from "@/components/shared/FilterSelect";
import { SearchInput } from "@/components/shared/SearchInput";
import { SortSelect } from "@/components/shared/SortSelect";
import type { usePagination } from "@/hooks/usePagination";
import { humanize } from "@/lib/utils";
import { PARCEL_STATUSES } from "@/types/enums";

/** Search + status + sort toolbar for every parcel list; all state lives in the URL. */
export function ParcelFilters({
  pagination,
  searchable = true,
}: {
  pagination: ReturnType<typeof usePagination>;
  searchable?: boolean;
}) {
  const { query, setSearch, setFilter } = pagination;
  return (
    <>
      {searchable && (
        <SearchInput
          value={String(query.search ?? "")}
          onSearch={setSearch}
          placeholder="Search tracking number or name…"
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
      <SortSelect
        value={query.sortOrder as string | undefined}
        onChange={(v) => setFilter("sortOrder", v)}
      />
    </>
  );
}
