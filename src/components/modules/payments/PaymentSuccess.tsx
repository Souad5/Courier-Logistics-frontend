"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { AppButton } from "@/components/shared/AppButton";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/i18n/client";
import { queryKeys } from "@/lib/query-keys";

/**
 * Stripe redirects here after checkout. The payment is confirmed by the
 * backend webhook (not by this page), so we only refresh cached parcel data.
 */
export function PaymentSuccess({ sessionId }: { sessionId?: string }) {
  const queryClient = useQueryClient();
  const { t, format } = useI18n();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.parcels.all });
  }, [queryClient]);

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="rounded-full bg-emerald-100 p-4 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          <CircleCheck className="size-8" />
        </div>
        <h1 className="text-2xl font-semibold">{t.payments.success.title}</h1>
        <p className="text-muted-foreground text-sm">{t.payments.success.description}</p>
        {sessionId && (
          <p className="text-muted-foreground font-mono text-sm break-all">
            {format(t.payments.success.reference, { id: sessionId })}
          </p>
        )}
        <AppButton asChild>
          <Link href="/customer/parcels">{t.payments.success.viewParcels}</Link>
        </AppButton>
      </CardContent>
    </Card>
  );
}
