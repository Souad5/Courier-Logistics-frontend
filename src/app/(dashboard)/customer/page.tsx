import type { Metadata } from "next";

import { CustomerOverview } from "@/components/modules/customer/CustomerOverview";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "My Activity" };

export default function CustomerHomePage() {
  return (
    <>
      <PageHeader
        title="My Activity"
        description="A quick look at your shipments. Pay for pending ones to get them moving."
      />
      <CustomerOverview />
    </>
  );
}
