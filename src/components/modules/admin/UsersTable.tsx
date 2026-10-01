"use client";

import { ClearFiltersButton } from "@/components/shared/ClearFiltersButton";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { SearchInput } from "@/components/shared/SearchInput";
import { DEFAULT_SORT_OPTIONS, SortSelect } from "@/components/shared/SortSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePagination } from "@/hooks/usePagination";
import { useChangeUserRole, useUsers } from "@/hooks/useUsers";
import { getErrorMessage } from "@/lib/api-client";
import { formatDate, humanize } from "@/lib/utils";
import type { User } from "@/types";
import { ROLES, type Role } from "@/types/enums";

// Within the backend's sortableFields (user.service.ts).
const USER_SORT = [
  ...DEFAULT_SORT_OPTIONS,
  { value: "name:asc", label: "Name: A to Z" },
  { value: "name:desc", label: "Name: Z to A" },
  { value: "email:asc", label: "Email: A to Z" },
];

/**
 * Admin view: all users with role change capability.
 * Must render inside <Suspense>.
 */
export function UsersTable() {
  const pagination = usePagination();
  const { query, setPage, setLimit, setSearch, setFilter } = pagination;

  const { data, isLoading, isFetching, error, refetch } = useUsers(query);
  const changeRole = useChangeUserRole();

  const columns: DataTableColumn<User>[] = [
    { key: "name", header: "Name", cell: (u) => u.name },
    { key: "email", header: "Email", cell: (u) => u.email },
    {
      key: "role",
      header: "Role",
      cell: (u) => (
        <Select
          defaultValue={u.role}
          onValueChange={(role) => changeRole.mutate({ userId: u.id, role: role as Role })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    { key: "status", header: "Status", cell: (u) => u.status },
    { key: "created", header: "Joined", cell: (u) => formatDate(u.createdAt) },
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
      emptyMessage="No users yet."
      emptyDescription="Try changing the search or role filter."
      toolbar={
        <>
          <SearchInput
            value={String(query.search ?? "")}
            onSearch={setSearch}
            placeholder="Search by name or email…"
            label="Search users"
          />
          <FilterSelect
            label="Filter by role"
            value={query.role as string | undefined}
            allLabel="All roles"
            options={ROLES.map((r) => ({ value: r, label: humanize(r) }))}
            onChange={(v) => setFilter("role", v)}
          />
          <SortSelect pagination={pagination} options={USER_SORT} />
          <ClearFiltersButton pagination={pagination} />
        </>
      }
    />
  );
}
