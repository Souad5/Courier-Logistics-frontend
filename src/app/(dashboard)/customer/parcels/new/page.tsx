import type { Metadata } from "next";

import { ComingSoon } from "@/components/shared/ComingSoon";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Send a Parcel" };

export default function CustomerParcelsNewPage() {
  return (
    <>
      <PageHeader
        title="Send a Parcel"
        description="Book a new shipment; the fee is calculated by the server."
      />
      <ComingSoon
        endpoint="POST /parcels"
        note="Build with react-hook-form + HubSelect for origin/destination; on success, offer PayNowButton."
      />
    </>
  );
}
