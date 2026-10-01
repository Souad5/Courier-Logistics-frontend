import type { Metadata } from "next";
import { Suspense } from "react";

import { PaymentsSummary } from "@/components/modules/payments/PaymentsSummary";
import { PaymentsTable } from "@/components/modules/payments/PaymentsTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.payments.page.title };
}

export default async function CustomerPaymentsPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHeader title={t.payments.page.title} description={t.payments.page.description} />
      <PaymentsSummary />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <PaymentsTable />
      </Suspense>
    </>
  );
}
