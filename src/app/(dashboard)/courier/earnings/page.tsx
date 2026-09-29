import type { Metadata } from "next";

import { ComingSoon } from "@/components/shared/ComingSoon";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Earnings" };

export default function CourierEarningsPage() {
  return (
    <>
      <PageHeader title="Earnings" description="What you've earned from completed deliveries." />
      <ComingSoon
        endpoint="GET /parcels/my-parcels?status=DELIVERED"
        note="The backend has no earnings endpoint; compute totals from delivered parcels."
      />
    </>
  );
}
