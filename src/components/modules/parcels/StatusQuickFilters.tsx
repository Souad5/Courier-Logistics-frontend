"use client";

import type { usePagination } from "@/hooks/usePagination";
import { useMyParcels } from "@/hooks/useParcels";
import { cn } from "@/lib/utils";
import type { ParcelStatus } from "@/types";

export interface QuickFilter {
  label: string;
  /** Omit for the "all" tile. */
  status?: ParcelStatus;
}

/**
 * Hairline row of count tiles over /parcels/my-parcels that double as a status
 * filter. Counts come from each query's meta.total (limit=1), so they're exact.
 */
export function StatusQuickFilters({
  pagination,
  items,
}: {
  pagination: ReturnType<typeof usePagination>;
  items: QuickFilter[];
}) {
  const active = pagination.query.status as string | undefined;

  return (
    <fieldset className="bg-border grid grid-cols-2 gap-px overflow-hidden rounded-xl border lg:grid-cols-4">
      <legend className="sr-only">Filter by status</legend>
      {items.map((item) => (
        <QuickFilterTile
          key={item.label}
          item={item}
          selected={(item.status ?? undefined) === active}
          onSelect={() => pagination.setFilter("status", item.status ?? null)}
        />
      ))}
    </fieldset>
  );
}

function QuickFilterTile({
  item,
  selected,
  onSelect,
}: {
  item: QuickFilter;
  selected: boolean;
  onSelect: () => void;
}) {
  const { data, isLoading } = useMyParcels(
    item.status ? { status: item.status, limit: 1 } : { limit: 1 },
  );

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "relative flex flex-col items-start gap-1 p-4 text-left transition-colors",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset",
        selected ? "bg-muted/60" : "bg-card hover:bg-muted/30",
      )}
    >
      {selected && <span aria-hidden className="bg-signal absolute inset-x-0 bottom-0 h-0.5" />}
      <span className="text-muted-foreground text-sm">{item.label}</span>
      <span className="text-2xl font-semibold tracking-tight tabular-nums">
        {isLoading ? "–" : (data?.meta?.total ?? 0)}
      </span>
    </button>
  );
}
