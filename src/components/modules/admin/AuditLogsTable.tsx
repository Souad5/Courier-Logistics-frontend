"use client";

import { ClearFiltersButton } from "@/components/shared/ClearFiltersButton";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { SortSelect } from "@/components/shared/SortSelect";
import { useAuditLogs } from "@/hooks/useAdmin";
import { usePagination } from "@/hooks/usePagination";
import { getErrorMessage } from "@/lib/api-client";
import { formatDate, humanize } from "@/lib/utils";
import { AUDIT_ACTIONS, type AuditLog } from "@/types";

// entityType values the backend writes (auditLog calls across modules).
const ENTITY_TYPES = ["Parcel", "Payment", "User", "Hub"];

/**
 * Admin view: audit logs of critical actions across the platform.
 * Must render inside <Suspense>.
 */
export function AuditLogsTable() {
  const pagination = usePagination();
  const { query, setPage, setLimit, setFilter } = pagination;
  const { data, isLoading, isFetching, error, refetch } = useAuditLogs(query);

  const columns: DataTableColumn<AuditLog>[] = [
    {
      key: "action",
      header: "Action",
      cell: (log) => <span className="font-mono text-sm">{log.action}</span>,
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
        <span className="text-muted-foreground text-sm">
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
      header: "IP address",
      cell: (log) => (
        <span className="font-mono text-sm text-muted-foreground">{log.ipAddress || "—"}</span>
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
      onLimitChange={setLimit}
      emptyMessage="No audit logs yet."
      emptyDescription="Critical actions across the platform are recorded here."
      toolbar={
        <>
          <FilterSelect
            label="Filter by action"
            value={query.action as string | undefined}
            allLabel="All actions"
            options={AUDIT_ACTIONS.map((a) => ({ value: a, label: humanize(a) }))}
            onChange={(v) => setFilter("action", v)}
          />
          <FilterSelect
            label="Filter by entity"
            value={query.entityType as string | undefined}
            allLabel="All entities"
            options={ENTITY_TYPES.map((t) => ({ value: t, label: t }))}
            onChange={(v) => setFilter("entityType", v)}
          />
          <SortSelect pagination={pagination} />
          <ClearFiltersButton pagination={pagination} />
        </>
      }
    />
  );
}
