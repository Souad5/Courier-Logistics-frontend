import { z } from "zod";

/**
 * Public env vars are inlined at build time, so each one must be referenced
 * explicitly (`process.env.NEXT_PUBLIC_X`) — never via a dynamic lookup.
 */
const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.url().default("http://localhost:5000/api/v1"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  /** Public origin of this site — used for canonical URLs, Open Graph and the sitemap. */
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || undefined,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || undefined,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
});
