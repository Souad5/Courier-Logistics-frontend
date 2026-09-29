import type { Metadata } from "next";

import { AdminOverview } from "@/components/modules/admin/AdminOverview";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Admin overview" };

export default function AdminOverviewPage() {
  return (
    <>
      <PageHeader title="Overview" description="Platform-wide activity at a glance." />
      <AdminOverview />
    </>
  );
}
