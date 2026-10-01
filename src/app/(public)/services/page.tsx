import { Camera, CreditCard, PackageCheck, Truck, Warehouse } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import parcelImg from "@/assets/landing/boxes.jpg";
import courierStreetImg from "@/assets/landing/courier-street.jpg";
import documentsImg from "@/assets/landing/documents.jpg";
import fragileImg from "@/assets/landing/fragile.jpg";
import hubImg from "@/assets/landing/hub.jpg";
import perishableImg from "@/assets/landing/perishable.jpg";
import { FadeIn } from "@/components/shared/FadeIn";
import { PhotoCta } from "@/components/shared/PhotoCta";
import { PhotoPanel } from "@/components/shared/PhotoPanel";
import { PublicPageHeader, SectionHeading } from "@/components/shared/SectionHeading";
import { FEATURES, PARCEL_TYPE_INFO } from "@/config/content";
import { pageMetadata } from "@/lib/seo";
import { PARCEL_TYPES, type ParcelType } from "@/types";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Door-to-door delivery for documents, parcels, fragile and perishable goods — with live tracking, proof of delivery and smart retries.",
  path: "/services",
});

// Unsplash photos — sources in src/assets/landing/CREDITS.md.
const TYPE_PHOTOS: Record<ParcelType, { src: typeof documentsImg; alt: string }> = {
  DOCUMENT: { src: documentsImg, alt: "A hand holding a sealed white envelope" },
  PARCEL: { src: parcelImg, alt: "A neat stack of brown cardboard boxes" },
  FRAGILE: { src: fragileImg, alt: "A small parcel marked Fragile, handle with care" },
  PERISHABLE: {
    src: perishableImg,
    alt: "Fresh pineapples and oranges packed in a cardboard crate",
  },
};

const TYPE_TIPS: Record<ParcelType, string> = {
  DOCUMENT: "Contracts, certificates, letters",
  PARCEL: "Clothes, books, electronics in boxes",
  FRAGILE: "Glass, ceramics, screens — packed well",
  PERISHABLE: "Food and produce that can't wait",
};

const STEPS = [
  {
    icon: CreditCard,
    title: "Book and pay",
    text: "Choose the type, weight and hubs. See the fee, pay by card.",
  },
  {
    icon: Warehouse,
    title: "Hub pickup",
    text: "An admin assigns a courier, who collects it from the origin hub.",
  },
  {
    icon: Truck,
    title: "In transit",
    text: "Every scan — picked up, in transit, out for delivery — is timestamped.",
  },
  {
    icon: Camera,
    title: "Delivered with proof",
    text: "The courier uploads a photo, visible on the tracking page.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PublicPageHeader
        image={hubImg}
        imagePosition="50% 40%"
        eyebrow="Services"
        title="Door-to-door delivery for every kind of shipment."
        description="Documents, everyday parcels, fragile items and perishables — booked online, carried by our couriers and tracked across every zone we serve."
      />

      {/* Parcel types */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <FadeIn>
          <SectionHeading
            eyebrow="What we carry"
            title="Four parcel types, one booking flow."
            description="Pick the type when you book so the courier knows how to handle it. The price is the same formula for all four."
          />
        </FadeIn>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PARCEL_TYPES.map((type, index) => {
            const info = PARCEL_TYPE_INFO[type];
            const photo = TYPE_PHOTOS[type];
            return (
              <FadeIn key={type} delay={index * 0.06} className="h-full">
                <article className="group bg-card flex h-full flex-col overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:ring-white/10">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <div className="flex items-center gap-2">
                      <info.icon className="size-4" aria-hidden />
                      <h3 className="font-semibold">{info.label}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{info.description}</p>
                    <p className="mt-auto pt-2 text-sm font-medium">{TYPE_TIPS[type]}</p>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* How a delivery works */}
      <section className="bg-muted/40 border-y">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <FadeIn>
            <SectionHeading
              eyebrow="How a delivery works"
              title="Four steps from booking to doorstep."
            />
          </FadeIn>
          <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
            <span
              aria-hidden
              className="bg-border absolute top-6 right-[12.5%] left-[12.5%] hidden h-px md:block"
            />
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <FadeIn
                  delay={index * 0.1}
                  className="relative flex gap-4 md:flex-col md:items-center md:text-center"
                >
                  <span className="bg-background relative grid size-12 shrink-0 place-items-center rounded-full shadow-md ring-1 ring-black/5 dark:ring-white/10">
                    <step.icon className="size-5" aria-hidden />
                    <span className="bg-signal text-background absolute -top-1 -right-1 grid size-5 place-items-center rounded-full font-mono text-[0.7rem] font-semibold">
                      {index + 1}
                    </span>
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground text-sm text-pretty">{step.text}</p>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Included with every delivery */}
      <section className="container mx-auto grid items-center gap-12 px-4 py-20 md:py-28 lg:grid-cols-2">
        <FadeIn>
          <PhotoPanel
            src={courierStreetImg}
            alt="A courier carrying a parcel along a busy city street"
            className="aspect-[4/5] lg:aspect-[4/4.5]"
            caption={
              <p className="flex items-center gap-2 text-sm font-medium">
                <PackageCheck className="size-4" aria-hidden />
                Every parcel gets the same service — no add-ons to choose.
              </p>
            }
          />
        </FadeIn>
        <div className="space-y-8">
          <FadeIn>
            <SectionHeading
              eyebrow="Included"
              title="With every delivery."
              description="Tracking, clear pricing, photo proof and retries come as standard."
            />
          </FadeIn>
          <ul className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature, index) => (
              <li key={feature.title}>
                <FadeIn
                  delay={index * 0.06}
                  className="bg-muted/40 hover:bg-muted h-full space-y-3 rounded-2xl p-5 transition-colors"
                >
                  <span className="bg-background grid size-10 place-items-center rounded-xl shadow-sm">
                    <feature.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PhotoCta
        title="Ready to book? It takes about a minute."
        description="Create a free account, enter the parcel details and pay by card — we take it from there."
        primary={{ label: "Send a parcel", href: "/register" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
