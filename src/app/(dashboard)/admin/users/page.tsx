import type { Metadata } from "next";

import { ComingSoon } from "@/components/shared/ComingSoon";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Users" };

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader title="Users" description="Browse users and change roles." />
      <ComingSoon endpoint="GET /users · PATCH /users/:id/role" />
    </>
  );
}
