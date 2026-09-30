import type { Metadata } from "next";

import { AvailabilityToggle } from "@/components/modules/courier/AvailabilityToggle";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Availability" };

export default function CourierAvailabilityPage() {
  return (
    <>
      <PageHeader
        title="Availability"
        description="Toggle whether you can receive new assignments."
      />
      <AvailabilityToggle />
    </>
  );
}
