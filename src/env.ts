import { z } from "zod";

/**
 * Public env vars are inlined at build time, so each one must be referenced
 * explicitly (`process.env.NEXT_PUBLIC_X`) — never via a dynamic lookup.
 */
const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.url().default("http://localhost:5000/api/v1"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || undefined,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || undefined,
});
