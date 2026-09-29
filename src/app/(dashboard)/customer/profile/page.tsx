import type { Metadata } from "next";

import { ComingSoon } from "@/components/shared/ComingSoon";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Profile" };

export default function CustomerProfilePage() {
  return (
    <>
      <PageHeader title="Profile" description="Your account details." />
      <ComingSoon
        endpoint="GET /users/me · PATCH /users/me"
      />
    </>
  );
}
