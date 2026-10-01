import type { Metadata } from "next";
import { Suspense } from "react";

import { HubsTable } from "@/components/modules/hubs/HubsTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.pages.hubs.title };
}

export default async function AdminHubsPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHeader title={t.admin.pages.hubs.title} description={t.admin.pages.hubs.description} />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <HubsTable />
      </Suspense>
    </>
  );
}
