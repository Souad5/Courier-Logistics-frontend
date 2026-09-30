import type { Metadata } from "next";
import { Suspense } from "react";

import { HubsTable } from "@/components/modules/hubs/HubsTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Hubs" };

export default function AdminHubsPage() {
  return (
    <>
      <PageHeader title="Hubs" description="Create and maintain hubs and delivery zones." />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <HubsTable />
      </Suspense>
    </>
  );
}
