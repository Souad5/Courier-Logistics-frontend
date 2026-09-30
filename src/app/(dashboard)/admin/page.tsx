import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminOverview } from "@/components/modules/admin/AdminOverview";
import { OverviewSkeleton } from "@/components/modules/admin/overview/OverviewSkeleton";

export const metadata: Metadata = { title: "Admin overview" };

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <AdminOverview />
    </Suspense>
  );
}
