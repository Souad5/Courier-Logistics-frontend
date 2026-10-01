"use client";

import type { usePagination } from "@/hooks/usePagination";
import { useI18n } from "@/i18n/client";
import type { Dictionary } from "@/i18n/dictionaries";

import { AppSelect } from "./form";

export interface SortOption {
  /** `${sortBy}:${sortOrder}`; the field must be in the backend's sortableFields. */
  value: string;
  key: keyof Dictionary["common"]["sort"];
}

const NEWEST = "createdAt:desc";

export const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { value: NEWEST, key: "newestFirst" },
  { value: "createdAt:asc", key: "oldestFirst" },
];

/** Sort dropdown stored as ?sortBy=&sortOrder= (newest first is the backend default). */
export function SortSelect({
  pagination,
  options = DEFAULT_SORT_OPTIONS,
}: {
  pagination: ReturnType<typeof usePagination>;
  options?: SortOption[];
}) {
  const { t } = useI18n();
  const { query, setParams } = pagination;
  const current =
    query.sortBy || query.sortOrder
      ? `${query.sortBy ?? "createdAt"}:${query.sortOrder ?? "desc"}`
      : NEWEST;

  return (
    <AppSelect
      ariaLabel={t.common.filters.sortBy}
      value={current}
      onValueChange={(next) => {
        const [sortBy, sortOrder] = next.split(":");
        setParams(next === NEWEST ? { sortBy: null, sortOrder: null } : { sortBy, sortOrder });
      }}
      options={options.map((o) => ({ value: o.value, label: t.common.sort[o.key] }))}
      containerClassName="w-full sm:w-44"
    />
  );
}
