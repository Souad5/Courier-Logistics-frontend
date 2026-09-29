import type { Metadata } from "next";

import { ComingSoon } from "@/components/shared/ComingSoon";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Hubs" };

export default function AdminHubsPage() {
  return (
    <>
      <PageHeader title="Hubs" description="Create and maintain hubs and delivery zones." />
      <ComingSoon endpoint="GET/POST /hubs · PATCH/DELETE /hubs/:id" />
    </>
  );
}
