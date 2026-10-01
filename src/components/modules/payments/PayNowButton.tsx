"use client";

import { useMutation } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

import { AppButton } from "@/components/shared/AppButton";
import { ENDPOINTS } from "@/config/api.config";
import { useI18n } from "@/i18n/client";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import type { InitiatePaymentPayload } from "@/types";

/**
 * Starts a Stripe Checkout session on the backend and redirects to it. Stripe
 * sends the customer back to /success or /cancel; the backend webhook is what
 * actually marks the payment PAID.
 */
export function PayNowButton({ parcelId, className }: { parcelId: string; className?: string }) {
  const { t } = useI18n();
  const initiate = useMutation({
    mutationFn: () => {
      const origin = window.location.origin;
      return apiClient.post<InitiatePaymentPayload>(ENDPOINTS.payments.initiate, {
        parcelId,
        // {CHECKOUT_SESSION_ID} is substituted by Stripe on redirect.
        successUrl: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/cancel?parcel_id=${parcelId}`,
      });
    },
    onSuccess: (result) => window.location.assign(result.data.checkoutUrl),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    // Stays in the loading state after success while the browser leaves for Stripe.
    <AppButton
      className={className}
      loading={initiate.isPending || initiate.isSuccess}
      leftIcon={<CreditCard />}
      onClick={() => initiate.mutate()}
    >
      {t.payments.payNow}
    </AppButton>
  );
}
