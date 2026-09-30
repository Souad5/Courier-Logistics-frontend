"use client";

import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { SortSelect } from "@/components/shared/SortSelect";
import { useAuditLogs } from "@/hooks/useAdmin";
import { usePagination } from "@/hooks/usePagination";
import { getErrorMessage } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import type { AuditLog } from "@/types";

/**
 * Admin view: audit logs of critical actions across the platform.
 * Must render inside <Suspense>.
 */
export function AuditLogsTable() {
  const { query, setPage, setFilter } = usePagination();
  const { data, isLoading, isFetching, error, refetch } = useAuditLogs(query);

  const columns: DataTableColumn<AuditLog>[] = [
    {
      key: "action",
      header: "Action",
      cell: (log) => <span className="font-mono text-xs">{log.action}</span>,
    },
    {
      key: "actor",
      header: "Actor",
      cell: (log) => log.actor?.name || <span className="text-muted-foreground">System</span>,
    },
    {
      key: "entity",
      header: "Entity",
      cell: (log) => (
        <span className="text-muted-foreground text-xs">
          {log.entityType || "—"} {log.entityId ? `(${log.entityId.slice(0, 8)})` : ""}
        </span>
      ),
    },
    {
      key: "timestamp",
      header: "Timestamp",
      cell: (log) => formatDate(log.createdAt, true),
    },
    {
      key: "ip",
      header: "IP Address",
      cell: (log) => (
        <span className="font-mono text-xs text-muted-foreground">{log.ipAddress || "—"}</span>
      ),
    },
  ];

  if (error) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;

  return (
    <DataTable
      columns={columns}
      data={data?.data.logs}
      getRowId={(log) => log.id}
      loading={isLoading || isFetching}
      meta={data?.meta}
      onPageChange={setPage}
      emptyMessage="No audit logs yet."
      emptyDescription="Critical actions across the platform are recorded here."
      toolbar={
        <SortSelect
          value={query.sortOrder as string | undefined}
          onChange={(v) => setFilter("sortOrder", v)}
        />
      }
    />
  );
}
