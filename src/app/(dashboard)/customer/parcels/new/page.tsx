import type { Metadata } from "next";

import { CreateParcelForm } from "@/components/modules/parcels/CreateParcelForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.booking.page.title };
}

export default async function CustomerParcelsNewPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHeader title={t.booking.page.title} description={t.booking.page.description} />
      <CreateParcelForm />
    </>
  );
}
