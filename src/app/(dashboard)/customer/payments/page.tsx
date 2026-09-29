import type { Metadata } from "next";

import { ComingSoon } from "@/components/shared/ComingSoon";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Payments" };

export default function CustomerPaymentsPage() {
  return (
    <>
      <PageHeader title="Payments" description="Payment status for each of your parcels." />
      <ComingSoon
        endpoint="GET /parcels/my-parcels (payment summary) · GET /payments/:id"
        note="The backend has no 'list my payments' endpoint yet; derive this list from each parcel's payment summary."
      />
    </>
  );
}
