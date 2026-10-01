import type { Metadata } from "next";
import { Suspense } from "react";

import { AllParcelsTable } from "@/components/modules/parcels/AllParcelsTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.pages.parcels.title };
}

export default async function AdminParcelsPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHeader
        title={t.admin.pages.parcels.title}
        description={t.admin.pages.parcels.description}
      />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <AllParcelsTable />
      </Suspense>
    </>
  );
}
