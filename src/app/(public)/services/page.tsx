import type { Metadata } from "next";

import Link from "next/link";

import { AppButton } from "@/components/shared/AppButton";
import { PublicPageHeader, SectionHeading } from "@/components/shared/SectionHeading";
import { FEATURES, PARCEL_TYPE_INFO } from "@/config/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Door-to-door delivery for documents, parcels, fragile and perishable goods — with live tracking, proof of delivery and smart retries.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PublicPageHeader
        eyebrow="Services"
        title="Door-to-door delivery for every kind of shipment."
        description="Documents, everyday parcels, fragile items and perishables — booked online, carried by our couriers and tracked across every zone we serve."
      />

      <section className="container mx-auto px-4 py-16 md:py-20">
        <SectionHeading eyebrow="What we carry" title="Four parcel types, one booking flow." />
        <div className="bg-border mt-10 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(PARCEL_TYPE_INFO).map(([type, info]) => (
            <div key={type} className="bg-background space-y-3 p-6">
              <info.icon className="size-5" aria-hidden />
              <h3 className="font-semibold">{info.label}</h3>
              <p className="text-muted-foreground text-sm">{info.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t">
        <div className="container mx-auto grid gap-10 px-4 py-16 md:py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Included"
            title="With every delivery."
            description="No add-ons to choose. Every parcel gets the same service."
          />
          <ul className="divide-y border-y">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex gap-4 py-5">
                <feature.icon className="mt-0.5 size-5 shrink-0" aria-hidden />
                <div className="space-y-1">
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-10">
          <p className="font-medium">Ready to book? It takes about a minute.</p>
          <div className="flex gap-2">
            <AppButton asChild>
              <Link href="/register">Send a parcel</Link>
            </AppButton>
            <AppButton asChild variant="outline">
              <Link href="/pricing">See pricing</Link>
            </AppButton>
          </div>
        </div>
      </section>
    </>
  );
}
