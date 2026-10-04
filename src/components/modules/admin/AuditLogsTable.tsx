"use client";

import { ClearFiltersButton } from "@/components/shared/ClearFiltersButton";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { SearchInput } from "@/components/shared/SearchInput";
import { SortSelect } from "@/components/shared/SortSelect";
import { TableToolbar } from "@/components/shared/TableToolbar";
import { useAuditLogs } from "@/hooks/useAdmin";
import { usePagination } from "@/hooks/usePagination";
import { useI18n } from "@/i18n/client";
import { getErrorMessage } from "@/lib/api-client";
import { AUDIT_ACTIONS, type AuditLog } from "@/types";

// entityType values the backend writes (auditLog calls across modules).
const ENTITY_TYPES = ["Parcel", "Payment", "User", "Hub"];

/**
 * Admin view: audit logs of critical actions across the platform.
 * Must render inside <Suspense>.
 */
export function AuditLogsTable() {
  const { t, f } = useI18n();
  const labels = t.admin.auditLogs;
  const pagination = usePagination();
  const { query, setPage, setLimit, setSearch, setFilter } = pagination;
  const { data, isLoading, isFetching, error, refetch } = useAuditLogs(query);

  const columns: DataTableColumn<AuditLog>[] = [
    {
      key: "action",
      header: labels.columns.action,
      // Translated label; the raw code stays available on hover for support/debugging.
      cell: (log) => (
        <span title={log.action}>{t.enums.auditAction[log.action] ?? log.action}</span>
      ),
    },
    {
      key: "actor",
      header: labels.columns.actor,
      cell: (log) =>
        log.actor?.name || <span className="text-muted-foreground">{labels.system}</span>,
    },
    {
      key: "entity",
      header: labels.columns.entity,
      cell: (log) => (
        <span className="text-muted-foreground text-sm">
          {log.entityType ? (t.enums.entityType[log.entityType] ?? log.entityType) : "—"}{" "}
          {log.entityId ? `(${log.entityId.slice(0, 8)})` : ""}
        </span>
      ),
    },
    {
      key: "timestamp",
      header: labels.columns.timestamp,
      cell: (log) => f.date(log.createdAt, true),
    },
    {
      key: "ip",
      header: labels.columns.ip,
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
      emptyMessage={labels.empty}
      emptyDescription={labels.emptyDescription}
      toolbar={
        <TableToolbar
          start={
            <>
              <SearchInput
                value={String(query.search ?? "")}
                onSearch={setSearch}
                placeholder={labels.searchPlaceholder}
                label={labels.searchLabel}
              />
              <ClearFiltersButton pagination={pagination} />
            </>
          }
          end={
            <>
              <FilterSelect
                label={labels.actionFilter}
                value={query.action as string | undefined}
                allLabel={labels.allActions}
                options={AUDIT_ACTIONS.map((a) => ({ value: a, label: t.enums.auditAction[a] }))}
                onChange={(v) => setFilter("action", v)}
              />
              <FilterSelect
                label={labels.entityFilter}
                value={query.entityType as string | undefined}
                allLabel={labels.allEntities}
                options={ENTITY_TYPES.map((type) => ({
                  value: type,
                  label: t.enums.entityType[type] ?? type,
                }))}
                onChange={(v) => setFilter("entityType", v)}
              />
              <SortSelect pagination={pagination} />
            </>
          }
        />
      }
    />
  );
}
