import type { Metadata } from "next";
import { Suspense } from "react";

import { UsersTable } from "@/components/modules/admin/UsersTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Users" };

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader title="Users" description="Browse users and change roles." />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <UsersTable />
      </Suspense>
    </>
  );
}
