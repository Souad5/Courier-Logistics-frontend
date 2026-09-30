"use client";

import { FilterSelect } from "./FilterSelect";

/** Newest/oldest toggle stored as ?sortOrder=asc|desc (backend default is desc). */
export function SortSelect({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (value: string | null) => void;
}) {
  return (
    <FilterSelect
      label="Sort order"
      value={value}
      allLabel="Newest first"
      options={[{ value: "asc", label: "Oldest first" }]}
      onChange={onChange}
    />
  );
}
