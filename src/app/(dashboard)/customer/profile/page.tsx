import type { Metadata } from "next";

import { ProfileForm } from "@/components/modules/profile/ProfileForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Profile" };

export default function CustomerProfilePage() {
  return (
    <>
      <PageHeader title="Profile" description="Your account details." />
      <ProfileForm />
    </>
  );
}
