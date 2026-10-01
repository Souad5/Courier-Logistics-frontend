import type { Metadata } from "next";

import { TrackingResult } from "@/components/modules/parcels/TrackingResult";
import { TrackParcelForm } from "@/components/modules/parcels/TrackParcelForm";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(
  props: PageProps<"/track/[trackingNumber]">,
): Promise<Metadata> {
  const { trackingNumber } = await props.params;
  const { t, format } = await getI18n();
  // One URL per parcel: useful to share, but not something to index.
  return pageMetadata({
    title: format(t.tracking.meta.title, { trackingNumber: decodeURIComponent(trackingNumber) }),
    description: t.tracking.meta.description,
    noIndex: true,
  });
}

export default async function TrackPage(props: PageProps<"/track/[trackingNumber]">) {
  const trackingNumber = decodeURIComponent((await props.params).trackingNumber);

  return (
    <div className="container mx-auto max-w-3xl space-y-8 px-4 pt-32 pb-14">
      {/* Keyed so the form (and its loading state) resets when searching another number. */}
      <TrackParcelForm key={trackingNumber} defaultValue={trackingNumber} />
      <TrackingResult trackingNumber={trackingNumber} />
    </div>
  );
}
