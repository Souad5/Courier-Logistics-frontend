"use client";

import { PackageSearch } from "lucide-react";
import Image from "next/image";

import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrackParcel } from "@/hooks/useParcels";
import { useI18n } from "@/i18n/client";
import { getErrorMessage } from "@/lib/api-client";

import { ParcelStatusTimeline } from "./ParcelStatusTimeline";

export function TrackingResult({ trackingNumber }: { trackingNumber: string }) {
  const { t, f, format } = useI18n();
  const { data: parcel, isLoading, error } = useTrackParcel(trackingNumber);

  if (isLoading) return <Skeleton className="h-80 rounded-xl" />;

  if (error || !parcel) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <PackageSearch className="text-muted-foreground size-8" />
          <p className="font-medium">{t.tracking.result.notFound}</p>
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
          {format(t.tracking.result.summary, {
            type: t.enums.parcelType[parcel.type],
            from: parcel.senderCity ?? t.tracking.result.origin,
            to: parcel.receiverCity ?? t.tracking.result.destination,
            receiver: parcel.receiverName,
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">{t.tracking.result.booked}</dt>
            <dd>{f.date(parcel.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t.tracking.result.delivered}</dt>
            <dd>{f.date(parcel.deliveredAt)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t.tracking.result.attempts}</dt>
            <dd>{f.number(parcel.deliveryAttempts)}</dd>
          </div>
        </dl>

        {parcel.proofOfDeliveryUrl && (
          <div className="space-y-2">
            <p className="text-sm font-medium">{t.tracking.result.proof}</p>
            <Image
              src={parcel.proofOfDeliveryUrl}
              alt={t.tracking.result.proof}
              width={640}
              height={480}
              className="max-h-72 w-auto rounded-lg border object-cover"
            />
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm font-medium">{t.tracking.result.history}</p>
          <ParcelStatusTimeline history={parcel.history} />
        </div>
      </CardContent>
    </Card>
  );
}
