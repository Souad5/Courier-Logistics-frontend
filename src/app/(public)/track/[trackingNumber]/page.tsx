import type { Metadata } from "next";

import { TrackingResult } from "@/components/modules/parcels/TrackingResult";
import { TrackParcelForm } from "@/components/modules/parcels/TrackParcelForm";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(
  props: PageProps<"/track/[trackingNumber]">,
): Promise<Metadata> {
  const { trackingNumber } = await props.params;
  // One URL per parcel: useful to share, but not something to index.
  return pageMetadata({
    title: `Track ${decodeURIComponent(trackingNumber)}`,
    description: "Live status and delivery history for your parcel.",
    noIndex: true,
  });
}

export default async function TrackPage(props: PageProps<"/track/[trackingNumber]">) {
  const trackingNumber = decodeURIComponent((await props.params).trackingNumber);

  return (
    <div className="container mx-auto max-w-3xl space-y-8 px-4 py-14">
      {/* Keyed so the form (and its loading state) resets when searching another number. */}
      <TrackParcelForm key={trackingNumber} defaultValue={trackingNumber} />
      <TrackingResult trackingNumber={trackingNumber} />
    </div>
  );
}
