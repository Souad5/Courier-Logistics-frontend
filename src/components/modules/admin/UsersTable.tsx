"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { AppInput } from "@/components/shared/form";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { useUsers, useChangeUserRole } from "@/hooks/useUsers";
import { getErrorMessage } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types";
import { ROLES } from "@/types/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Admin view: all users with role change capability.
 * Must render inside <Suspense>.
 */
export function UsersTable() {
  const { query, setPage, setSearch } = usePagination();
  const [search, setSearchInput] = useState(String(query.search ?? ""));
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    if (debouncedSearch !== (query.search ?? "")) setSearch(debouncedSearch);
  }, [debouncedSearch, query.search, setSearch]);

  const { data, isLoading, isFetching, error } = useUsers(query);
  const changeRole = useChangeUserRole();

  const columns: DataTableColumn<User>[] = [
    { key: "name", header: "Name", cell: (u) => u.name },
    { key: "email", header: "Email", cell: (u) => u.email },
    {
      key: "role",
      header: "Role",
      cell: (u) => (
        <Select defaultValue={u.role} onValueChange={(role) => changeRole.mutate({ userId: u.id, role: role as any })}>
          <SelectTrigger className="w-32">
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

  if (error) return <p className="text-destructive text-sm">{getErrorMessage(error)}</p>;

  return (
    <DataTable
      columns={columns}
      data={data?.data.users}
      getRowId={(u) => u.id}
      loading={isLoading || isFetching}
      meta={data?.meta}
      onPageChange={setPage}
      emptyMessage="No users yet."
      toolbar={
        <AppInput
          type="search"
          value={search}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by name or email…"
          aria-label="Search users"
          leftIcon={<Search />}
          containerClassName="w-full max-w-xs"
        />
      }
    />
  );
}
