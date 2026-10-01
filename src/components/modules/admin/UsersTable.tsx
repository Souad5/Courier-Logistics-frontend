"use client";

import { ClearFiltersButton } from "@/components/shared/ClearFiltersButton";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { SearchInput } from "@/components/shared/SearchInput";
import { DEFAULT_SORT_OPTIONS, type SortOption, SortSelect } from "@/components/shared/SortSelect";
import { TableToolbar } from "@/components/shared/TableToolbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePagination } from "@/hooks/usePagination";
import { useChangeUserRole, useUsers } from "@/hooks/useUsers";
import { useI18n } from "@/i18n/client";
import { getErrorMessage } from "@/lib/api-client";
import type { User } from "@/types";
import { ROLES, type Role } from "@/types/enums";

// Within the backend's sortableFields (user.service.ts).
const USER_SORT: SortOption[] = [
  ...DEFAULT_SORT_OPTIONS,
  { value: "name:asc", key: "nameAsc" },
  { value: "name:desc", key: "nameDesc" },
  { value: "email:asc", key: "emailAsc" },
];

/**
 * Admin view: all users with role change capability.
 * Must render inside <Suspense>.
 */
export function UsersTable() {
  const { t, f, format } = useI18n();
  const labels = t.admin.users;
  const pagination = usePagination();
  const { query, setPage, setLimit, setSearch, setFilter } = pagination;

  const { data, isLoading, isFetching, error, refetch } = useUsers(query);
  const changeRole = useChangeUserRole();

  const columns: DataTableColumn<User>[] = [
    { key: "name", header: labels.columns.name, cell: (u) => u.name },
    { key: "email", header: labels.columns.email, cell: (u) => u.email },
    {
      key: "role",
      header: labels.columns.role,
      cell: (u) => (
        <Select
          defaultValue={u.role}
          onValueChange={(role) => changeRole.mutate({ userId: u.id, role: role as Role })}
        >
          <SelectTrigger
            className="w-full"
            aria-label={format(labels.changeRole, { name: u.name })}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {t.enums.role[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "status",
      header: labels.columns.status,
      cell: (u) => t.enums.userStatus[u.status] ?? u.status,
    },
    { key: "created", header: labels.columns.joined, cell: (u) => f.date(u.createdAt) },
  ];

  if (error) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;

  return (
    <DataTable
      columns={columns}
      data={data?.data.users}
      getRowId={(u) => u.id}
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
                placeholder={labels.search}
                label={labels.searchLabel}
              />
              <ClearFiltersButton pagination={pagination} />
            </>
          }
          end={
            <>
              <FilterSelect
                label={labels.roleFilter}
                value={query.role as string | undefined}
                allLabel={labels.allRoles}
                options={ROLES.map((r) => ({ value: r, label: t.enums.role[r] }))}
                onChange={(v) => setFilter("role", v)}
              />
              <SortSelect pagination={pagination} options={USER_SORT} />
            </>
          }
        />
      }
    />
  );
}
