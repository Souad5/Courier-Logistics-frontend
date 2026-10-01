import type { Metadata } from "next";
import { Suspense } from "react";

import { CourierEarnings } from "@/components/modules/courier/CourierEarnings";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.courier.pages.earnings.title };
}

export default async function CourierEarningsPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHeader
        title={t.courier.pages.earnings.title}
        description={t.courier.pages.earnings.description}
      />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <CourierEarnings />
      </Suspense>
    </>
  );
}
