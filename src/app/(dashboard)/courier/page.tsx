import type { Metadata } from "next";
import { Suspense } from "react";

import { MyParcelsTable } from "@/components/modules/parcels/MyParcelsTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "My Tasks" };

export default function CourierTasksPage() {
  return (
    <>
      <PageHeader title="My Tasks" description="Parcels assigned to you." />
      {/* MyParcelsTable keeps pagination/search in the URL (useSearchParams). */}
      <Suspense fallback={<Skeleton className="h-72 rounded-xl" />}>
        <MyParcelsTable />
      </Suspense>
    </>
  );
}
