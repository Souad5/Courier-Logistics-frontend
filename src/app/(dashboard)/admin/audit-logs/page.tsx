import type { Metadata } from "next";

import { ComingSoon } from "@/components/shared/ComingSoon";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Audit Logs" };

export default function AdminAuditLogsPage() {
  return (
    <>
      <PageHeader
        title="Audit Logs"
        description="History of critical actions across the platform."
      />
      <ComingSoon endpoint="GET /admin/audit-logs" />
    </>
  );
}
