import type { Metadata } from "next";

import { AvailabilityToggle } from "@/components/modules/courier/AvailabilityToggle";
import { PageHeader } from "@/components/shared/PageHeader";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.courier.pages.availability.title };
}

export default async function CourierAvailabilityPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHeader
        title={t.courier.pages.availability.title}
        description={t.courier.pages.availability.description}
      />
      <AvailabilityToggle />
    </>
  );
}
