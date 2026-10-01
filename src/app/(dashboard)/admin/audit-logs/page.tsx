import type { Metadata } from "next";
import { Suspense } from "react";

import { AuditLogsTable } from "@/components/modules/admin/AuditLogsTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.pages.auditLogs.title };
}

export default async function AdminAuditLogsPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHeader
        title={t.admin.pages.auditLogs.title}
        description={t.admin.pages.auditLogs.description}
      />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <AuditLogsTable />
      </Suspense>
    </>
  );
}
