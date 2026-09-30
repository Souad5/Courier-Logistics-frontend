import type { Metadata } from "next";
import { Suspense } from "react";

import { PaymentsTable } from "@/components/modules/payments/PaymentsTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Payments" };

export default function CustomerPaymentsPage() {
  return (
    <>
      <PageHeader title="Payments" description="Payment status for each of your parcels." />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <PaymentsTable />
      </Suspense>
    </>
  );
}
