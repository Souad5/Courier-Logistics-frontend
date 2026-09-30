import type { Metadata } from "next";
import { Suspense } from "react";

import { CourierEarnings } from "@/components/modules/courier/CourierEarnings";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Earnings" };

export default function CourierEarningsPage() {
  return (
    <>
      <PageHeader title="Earnings" description="What you've earned from completed deliveries." />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <CourierEarnings />
      </Suspense>
    </>
  );
}
