import type { ReactNode } from "react";

/**
 * Two-sided table toolbar: search and "clear" on the left, filters and sort on the
 * right. Stacks below lg; on phones the right-hand controls pair up two per row.
 */
export function TableToolbar({ start, end }: { start?: ReactNode; end?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
      {start && <div className="flex min-w-0 flex-wrap items-center gap-2">{start}</div>}
      {end && (
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center lg:ml-auto lg:justify-end">
          {end}
        </div>
      )}
    </div>
  );
}
