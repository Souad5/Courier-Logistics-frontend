import type { Metadata } from "next";

import { ProfileForm } from "@/components/modules/profile/ProfileForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.profile.page.title };
}

export default async function CourierProfilePage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHeader title={t.profile.page.title} description={t.profile.page.description} />
      <ProfileForm />
    </>
  );
}
