import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { ParcelStatusHistory } from "@/types";

/** Vertical status history, newest first (the order the backend returns). */
export function ParcelStatusTimeline({ history }: { history: ParcelStatusHistory[] }) {
  if (history.length === 0) {
    return <p className="text-muted-foreground text-sm">No status updates yet.</p>;
  }

  return (
    <ol className="relative space-y-6 border-l pl-6">
      {history.map((entry, index) => (
        <li key={entry.id} className="relative">
          <span
            className={
              index === 0
                ? "bg-signal ring-background absolute top-1 -left-[31px] size-3 rounded-full ring-4"
                : "bg-muted-foreground/40 ring-background absolute top-1 -left-[31px] size-3 rounded-full ring-4"
            }
          />
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={entry.status} />
            <time className="text-muted-foreground text-xs">
              {formatDate(entry.createdAt, true)}
            </time>
          </div>
          {entry.location && <p className="mt-1 text-sm">{entry.location}</p>}
          {entry.note && <p className="text-muted-foreground mt-0.5 text-sm">{entry.note}</p>}
        </li>
      ))}
    </ol>
  );
}
