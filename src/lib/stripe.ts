import { loadStripe, type Stripe } from "@stripe/stripe-js";

import { env } from "@/env";

/**
 * Lazily loads Stripe.js. The current flow redirects to a backend-created
 * Checkout Session and doesn't need this; it's here for Elements-based UI
 * (e.g. an embedded card form) if the backend adds a PaymentIntent flow.
 */
let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) return Promise.resolve(null);
  stripePromise ??= loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  return stripePromise;
}
