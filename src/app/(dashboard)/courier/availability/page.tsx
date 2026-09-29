import type { Metadata } from "next";

import { ComingSoon } from "@/components/shared/ComingSoon";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Availability" };

export default function CourierAvailabilityPage() {
  return (
    <>
      <PageHeader title="Availability" description="Toggle whether you can receive new assignments." />
      <ComingSoon
        endpoint="PATCH /users/me/availability"
      />
    </>
  );
}
