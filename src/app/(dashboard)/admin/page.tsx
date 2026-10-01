import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminOverview } from "@/components/modules/admin/AdminOverview";
import { OverviewSkeleton } from "@/components/modules/admin/overview/OverviewSkeleton";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.pages.overviewTitle };
}

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <AdminOverview />
    </Suspense>
  );
}
