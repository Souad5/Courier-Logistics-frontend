import type { Metadata } from "next";
import { Suspense } from "react";

import { AllParcelsTable } from "@/components/modules/parcels/AllParcelsTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Parcels" };

export default function AdminParcelsPage() {
  return (
    <>
      <PageHeader
        title="Parcels"
        description="Manage all parcels, assign couriers and update statuses."
      />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <AllParcelsTable />
      </Suspense>
    </>
  );
}
