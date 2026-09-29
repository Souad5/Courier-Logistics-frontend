"use client";

import { PackageSearch } from "lucide-react";

import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrackParcel } from "@/hooks/useParcels";
import { getErrorMessage } from "@/lib/api-client";
import { formatDate, humanize } from "@/lib/utils";

import { ParcelStatusTimeline } from "./ParcelStatusTimeline";

export function TrackingResult({ trackingNumber }: { trackingNumber: string }) {
  const { data: parcel, isLoading, error } = useTrackParcel(trackingNumber);

  if (isLoading) return <Skeleton className="h-80 rounded-xl" />;

  if (error || !parcel) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <PackageSearch className="text-muted-foreground size-8" />
          <p className="font-medium">We couldn&apos;t find that parcel</p>
          <p className="text-muted-foreground text-sm">{getErrorMessage(error)}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="font-mono">{parcel.trackingNumber}</CardTitle>
          <StatusBadge status={parcel.status} />
        </div>
        <CardDescription>
          {humanize(parcel.type)} · {parcel.senderCity ?? "Origin"} → {parcel.receiverCity ?? "Destination"} ·
          for {parcel.receiverName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Booked</dt>
            <dd>{formatDate(parcel.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Delivered</dt>
            <dd>{formatDate(parcel.deliveredAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Delivery attempts</dt>
            <dd>{parcel.deliveryAttempts}</dd>
          </div>
        </dl>

        {parcel.proofOfDeliveryUrl && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Proof of delivery</p>
            {/* Cloudinary URL; plain <img> avoids configuring next/image remote patterns. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={parcel.proofOfDeliveryUrl}
              alt="Proof of delivery"
              className="max-h-72 rounded-lg border object-cover"
            />
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm font-medium">History</p>
          <ParcelStatusTimeline history={parcel.history} />
        </div>
      </CardContent>
    </Card>
  );
}
