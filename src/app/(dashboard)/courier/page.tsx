import type { Metadata } from "next";
import { Suspense } from "react";

import { CourierTasksTable } from "@/components/modules/courier/CourierTasksTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.courier.pages.tasks.title };
}

export default async function CourierTasksPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHeader
        title={t.courier.pages.tasks.title}
        description={t.courier.pages.tasks.description}
      />
      <Suspense fallback={<Skeleton className="h-72 rounded-xl" />}>
        <CourierTasksTable />
      </Suspense>
    </>
  );
}
