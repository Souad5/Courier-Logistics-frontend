import type { Metadata } from "next";

import { CustomerOverview } from "@/components/modules/customer/CustomerOverview";
import { PageHeader } from "@/components/shared/PageHeader";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.customer.activity.title };
}

export default async function CustomerHomePage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHeader title={t.customer.activity.title} description={t.customer.activity.description} />
      <CustomerOverview />
    </>
  );
}
