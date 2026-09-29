import type { Metadata } from "next";

import { TrackingResult } from "@/components/modules/parcels/TrackingResult";
import { TrackParcelForm } from "@/components/modules/parcels/TrackParcelForm";

export async function generateMetadata(
  props: PageProps<"/track/[trackingNumber]">,
): Promise<Metadata> {
  const { trackingNumber } = await props.params;
  return { title: `Track ${decodeURIComponent(trackingNumber)}` };
}

export default async function TrackPage(props: PageProps<"/track/[trackingNumber]">) {
  const trackingNumber = decodeURIComponent((await props.params).trackingNumber);

  return (
    <div className="container mx-auto max-w-3xl space-y-8 px-4 py-14">
      <TrackParcelForm defaultValue={trackingNumber} />
      <TrackingResult trackingNumber={trackingNumber} />
    </div>
  );
}
