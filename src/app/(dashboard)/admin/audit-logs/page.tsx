import type { Metadata } from "next";
import { Suspense } from "react";

import { AuditLogsTable } from "@/components/modules/admin/AuditLogsTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Audit Logs" };

export default function AdminAuditLogsPage() {
  return (
    <>
      <PageHeader
        title="Audit Logs"
        description="History of critical actions across the platform."
      />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <AuditLogsTable />
      </Suspense>
    </>
  );
}
