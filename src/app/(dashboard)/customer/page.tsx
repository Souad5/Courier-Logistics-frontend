import type { Metadata } from "next";
import { Suspense } from "react";

import { MyParcelsTable } from "@/components/modules/parcels/MyParcelsTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "My Activity" };

export default function CustomerHomePage() {
  return (
    <>
      <PageHeader title="My Activity" description="Your recent parcels. Pay for pending ones to get them moving." />
      {/* MyParcelsTable keeps pagination/search in the URL (useSearchParams). */}
      <Suspense fallback={<Skeleton className="h-72 rounded-xl" />}>
        <MyParcelsTable showPayAction />
      </Suspense>
    </>
  );
}
