"use client";

import type { usePagination } from "@/hooks/usePagination";

import { AppSelect } from "./form";

export interface SortOption {
  /** `${sortBy}:${sortOrder}`; the field must be in the backend's sortableFields. */
  value: string;
  label: string;
}

const NEWEST = "createdAt:desc";

export const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { value: NEWEST, label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
];

/** Sort dropdown stored as ?sortBy=&sortOrder= (newest first is the backend default). */
export function SortSelect({
  pagination,
  options = DEFAULT_SORT_OPTIONS,
}: {
  pagination: ReturnType<typeof usePagination>;
  options?: SortOption[];
}) {
  const { query, setParams } = pagination;
  const current =
    query.sortBy || query.sortOrder
      ? `${query.sortBy ?? "createdAt"}:${query.sortOrder ?? "desc"}`
      : NEWEST;

  return (
    <AppSelect
      ariaLabel="Sort by"
      value={current}
      onValueChange={(next) => {
        const [sortBy, sortOrder] = next.split(":");
        setParams(next === NEWEST ? { sortBy: null, sortOrder: null } : { sortBy, sortOrder });
      }}
      options={options}
      containerClassName="w-full sm:w-48"
    />
  );
}
