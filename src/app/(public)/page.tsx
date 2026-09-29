import { ArrowRight, Boxes, Truck, UserCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { TrackParcelForm } from "@/components/modules/parcels/TrackParcelForm";
import { AppButton } from "@/components/shared/AppButton";
import { FadeIn } from "@/components/shared/FadeIn";
import { JsonLd } from "@/components/shared/JsonLd";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURES } from "@/config/content";
import { siteConfig } from "@/config/site";
import { defaultTitle, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: defaultTitle,
  absoluteTitle: true,
  description:
    "Book, pay for and track parcels online. Transparent zone-based pricing, live tracking and photo proof of delivery.",
  path: "/",
});

// Structured data: tells search engines who we are and that the site offers
// tracking-number search (eligible for a sitelinks search box).
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/og`,
    email: siteConfig.contactEmail,
    description: siteConfig.description,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/track/{tracking_number}` },
      "query-input": "required name=tracking_number",
    },
  },
];

const STEPS = [
  {
    icon: Boxes,
    title: "Book & pay",
    text: "Create a parcel, see the fee instantly, pay securely with Stripe.",
  },
  {
    icon: UserCheck,
    title: "We assign a courier",
    text: "An available courier is matched to your parcel and hub.",
  },
  {
    icon: Truck,
    title: "Track to the door",
    text: "Follow every scan until it's delivered — with photo proof.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <section className="from-primary/5 border-b bg-linear-to-b to-transparent">
        <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-20 text-center md:py-28">
          <FadeIn className="space-y-4">
            <p className="text-primary text-sm font-medium">Courier & logistics, simplified</p>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-balance md:text-6xl">
              Send anything, anywhere — and always know where it is.
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-pretty">
              {siteConfig.description}
            </p>
          </FadeIn>
          <FadeIn delay={0.1} className="flex w-full justify-center">
            <TrackParcelForm />
          </FadeIn>
          <FadeIn delay={0.2} className="flex flex-wrap justify-center gap-3">
            <AppButton asChild size="lg">
              <Link href="/register">
                Send a parcel <ArrowRight />
              </Link>
            </AppButton>
            <AppButton asChild size="lg" variant="outline">
              <Link href="/pricing">See pricing</Link>
            </AppButton>
          </FadeIn>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight">How it works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.08}>
              <Card className="h-full">
                <CardContent className="space-y-3">
                  <div className="bg-primary/10 text-primary w-fit rounded-lg p-2.5">
                    <step.icon className="size-5" />
                  </div>
                  <p className="text-muted-foreground text-xs font-medium">Step {i + 1}</p>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.text}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 border-y">
        <div className="container mx-auto grid gap-6 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.06} className="space-y-2">
              <feature.icon className="text-primary size-6" />
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Ready to ship?</h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-xl">
          Create a free account as a customer — or join as a courier and start delivering.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <AppButton asChild size="lg">
            <Link href="/register">Create account</Link>
          </AppButton>
          <AppButton asChild size="lg" variant="outline">
            <Link href="/login">Try a demo account</Link>
          </AppButton>
        </div>
      </section>
    </>
  );
}
