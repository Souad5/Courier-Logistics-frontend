import type { Metadata } from "next";
import { Suspense } from "react";

import { UsersTable } from "@/components/modules/admin/UsersTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.pages.users.title };
}

export default async function AdminUsersPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHeader title={t.admin.pages.users.title} description={t.admin.pages.users.description} />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <UsersTable />
      </Suspense>
    </>
  );
}
