import type { Metadata } from "next";
import { Suspense } from "react";

import { MyParcelsTable } from "@/components/modules/parcels/MyParcelsTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.customer.parcels.title };
}

export default async function CustomerParcelsPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHeader title={t.customer.parcels.title} description={t.customer.parcels.description} />
      {/* MyParcelsTable keeps pagination/search in the URL (useSearchParams). */}
      <Suspense fallback={<Skeleton className="h-72 rounded-xl" />}>
        <MyParcelsTable showPayAction />
      </Suspense>
    </>
  );
}
