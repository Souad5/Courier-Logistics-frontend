import type { Metadata } from "next";

import { ComingSoon } from "@/components/shared/ComingSoon";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Parcels" };

export default function AdminParcelsPage() {
  return (
    <>
      <PageHeader title="Parcels" description="Manage all parcels, assign couriers and update statuses." />
      <ComingSoon
        endpoint="GET /parcels · PATCH /parcels/:id/assign · PATCH /parcels/:id/status"
      />
    </>
  );
}
