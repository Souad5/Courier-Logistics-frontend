import type { Metadata } from "next";

import { CreateParcelForm } from "@/components/modules/parcels/CreateParcelForm";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Send a Parcel" };

export default function CustomerParcelsNewPage() {
  return (
    <>
      <PageHeader
        title="Send a Parcel"
        description="Book a new shipment; the fee is calculated by the server."
      />
      <CreateParcelForm />
    </>
  );
}
