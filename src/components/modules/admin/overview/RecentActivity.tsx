"use client";

import { ScrollText } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuditLogs } from "@/hooks/useAdmin";
import { getErrorMessage } from "@/lib/api-client";
import { formatRelativeTime, humanize } from "@/lib/utils";

export function RecentActivity() {
  const { data, isLoading, error, refetch } = useAuditLogs({ limit: 6, sortOrder: "desc" });
  const logs = data?.data.logs ?? [];

  if (error) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {["a", "b", "c", "d", "e", "f"].map((key) => (
          <div key={key} className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <EmptyState
        icon={ScrollText}
        title="No activity yet"
        description="Critical actions across the platform are recorded here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-4">
        {logs.map((log) => (
          <li key={log.id} className="flex items-start gap-3">
            <span
              aria-hidden
              className="bg-muted text-foreground mt-0.5 grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold"
            >
              {(log.actor?.name ?? "S").charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{humanize(log.action)}</p>
              <p className="text-muted-foreground truncate text-sm">
                {log.actor?.name ?? "System"}
                {log.entityType ? ` · ${humanize(log.entityType)}` : ""}
              </p>
            </div>
            <time
              dateTime={log.createdAt}
              className="text-muted-foreground shrink-0 text-sm"
              title={new Date(log.createdAt).toLocaleString()}
            >
              {formatRelativeTime(log.createdAt)}
            </time>
          </li>
        ))}
      </ul>
      <Link
        href="/admin/audit-logs"
        className="text-foreground focus-visible:ring-ring inline-block rounded text-sm font-medium hover:underline focus-visible:ring-2 focus-visible:outline-none"
      >
        View all activity
      </Link>
    </div>
  );
}
