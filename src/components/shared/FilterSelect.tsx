"use client";

import { AppSelect, type SelectOption } from "./form";

const ALL = "all";

/** Toolbar dropdown whose value lives in the URL (via usePagination's setFilter). */
export function FilterSelect({
  label,
  value,
  options,
  allLabel,
  onChange,
}: {
  label: string;
  value: string | undefined;
  options: SelectOption[];
  allLabel: string;
  onChange: (value: string | null) => void;
}) {
  return (
    <AppSelect
      ariaLabel={label}
      value={value || ALL}
      onValueChange={(next) => onChange(next === ALL ? null : next)}
      options={[{ value: ALL, label: allLabel }, ...options]}
      containerClassName="w-full sm:w-40"
    />
  );
}
