import {
  ArrowRight,
  Check,
  ChevronDown,
  ClipboardList,
  Mail,
  MessageSquare,
  PackagePlus,
  PackageSearch,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import deliverImg from "@/assets/landing/deliver.jpg";
import fragileImg from "@/assets/landing/fragile.jpg";
import scooterImg from "@/assets/landing/scooter.jpg";
import sendImg from "@/assets/landing/send.jpg";
import streetImg from "@/assets/landing/street.jpg";
import trackImg from "@/assets/landing/track.jpg";
import vanImg from "@/assets/landing/van.jpg";

import { CoverageFinder } from "@/components/modules/landing/CoverageFinder";
import { HeroToolsCard } from "@/components/modules/landing/HeroToolsCard";
import { LifecycleShowcase } from "@/components/modules/landing/LifecycleShowcase";
import { LiveStats } from "@/components/modules/landing/LiveStats";
import { AppButton } from "@/components/shared/AppButton";
import { FadeIn } from "@/components/shared/FadeIn";
import { HeroBackdrop } from "@/components/shared/HeroBackdrop";
import { JsonLd } from "@/components/shared/JsonLd";
import { PhotoCta } from "@/components/shared/PhotoCta";
import { PhotoPanel } from "@/components/shared/PhotoPanel";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { estimateFee, FAQS, FEATURES, PARCEL_TYPE_INFO, PRICING, SERVICES } from "@/config/content";
import { siteConfig } from "@/config/site";
import { defaultTitle, pageMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";
import { PARCEL_TYPES } from "@/types";

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

// Delivery-charge table: sending from the cheapest (inner-city) hub to each zone.
const FROM_ZONE = PRICING.zones[0];
const CHARGE_WEIGHTS = [0.5, 1, 2];

const AUDIENCES = [
  {
    icon: PackagePlus,
    role: "For senders",
    title: "Ship without the guesswork.",
    points: [
      "Book in four short steps",
      "See the exact fee, pay by card",
      "Follow every status change",
      "Photo proof when it's delivered",
    ],
    cta: { label: "Create a free account", href: "/register" },
    photo: { src: vanImg, alt: "The back of a delivery van stacked with parcels ready to go out" },
  },
  {
    icon: ClipboardList,
    role: "For couriers",
    title: "Deliver and keep it simple.",
    points: [
      "A clear list of assigned tasks",
      "Go on or off duty in one tap",
      "Update status from the road",
      "Earnings from every delivered parcel",
    ],
    cta: { label: "Join as a courier", href: "/register" },
    photo: {
      src: scooterImg,
      alt: "A courier riding a scooter with a delivery box along a city street",
    },
  },
];

// Unsplash photos (free Unsplash License); sources listed in src/assets/landing/CREDITS.md.
const SERVICE_PHOTOS = [
  { src: sendImg, alt: "A customer handing a cardboard parcel to another person" },
  { src: trackImg, alt: "A courier in a hi-vis vest delivering a parcel to a front door" },
  { src: deliverImg, alt: "A courier on a scooter with a delivery box riding through the city" },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={structuredData} />

      {/* Hero — full-bleed photo, bold claim + live network numbers (Steadfast), tools card overlapping its edge (RedX). */}
      <section className="relative isolate overflow-hidden text-white">
        <HeroBackdrop />
        <div className="container mx-auto grid min-h-[38rem] items-center gap-12 px-4 pt-32 pb-36 md:pt-40 lg:min-h-[44rem] lg:grid-cols-[1.15fr_0.85fr] lg:pb-44">
          <div className="space-y-7">
            <FadeIn>
              <p className="flex items-center gap-2 font-mono text-sm tracking-widest text-white/80 uppercase">
                <span aria-hidden className="size-1.5 rounded-full bg-emerald-400" />
                Courier delivery in Bangladesh
              </p>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h1 className="text-[2.6rem] leading-[1.04] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                Parcels across Bangladesh, tracked to the door.
              </h1>
            </FadeIn>
            <FadeIn delay={0.14}>
              <p className="max-w-xl text-lg text-pretty text-white/80">
                Clear zone-based pricing, card checkout, a timestamped status for every step and a
                photo when it&apos;s delivered.
              </p>
            </FadeIn>
            <FadeIn delay={0.22} className="flex flex-wrap items-center gap-3">
              <AppButton
                asChild
                size="lg"
                className="group h-12 border-transparent px-6 shadow-lg shadow-black/20"
              >
                <Link href="/register">
                  Send a parcel
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </AppButton>
              <AppButton
                asChild
                size="lg"
                variant="ghost"
                className="h-12 border border-white/30 bg-white/10 px-6 text-white backdrop-blur hover:bg-white/20 hover:text-white"
              >
                <Link href="/register">Become a courier</Link>
              </AppButton>
            </FadeIn>
          </div>
          <FadeIn delay={0.3}>
            <LiveStats />
          </FadeIn>
        </div>
      </section>

      <div className="relative z-10 container mx-auto -mt-24 px-4 lg:-mt-28">
        <FadeIn delay={0.36}>
          <HeroToolsCard />
        </FadeIn>
      </div>

      {/* Three jobs, one platform */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <FadeIn>
          <SectionHeading
            eyebrow="What you can do"
            title="Three jobs, one platform."
            description="Send, track and deliver — each with its own workspace, all on the same network."
          />
        </FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SERVICES.map((service, index) => (
            <FadeIn key={service.title} delay={index * 0.08} className="h-full">
              <Link
                href={service.cta.href}
                className="group bg-card focus-visible:ring-ring flex h-full flex-col overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:outline-none dark:ring-white/10"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={SERVICE_PHOTOS[index].src}
                    alt={SERVICE_PHOTOS[index].alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 font-mono text-sm text-white backdrop-blur">
                    0{index + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center gap-2.5">
                    <service.icon className="size-5" aria-hidden />
                    <h3 className="text-xl font-semibold tracking-tight">{service.title}</h3>
                  </div>
                  <p className="text-muted-foreground flex-1 text-sm text-pretty">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium">
                    {service.cta.label}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* What we carry */}
      <section className="border-t">
        <div className="container mx-auto grid items-center gap-12 px-4 py-20 md:py-28 lg:grid-cols-2">
          <FadeIn className="space-y-8">
            <SectionHeading
              eyebrow="What we carry"
              title="From a single letter to a box of mangoes."
              description="Pick the type when you book so the courier knows how to handle it."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {PARCEL_TYPES.map((type) => {
                const info = PARCEL_TYPE_INFO[type];
                return (
                  <div
                    key={type}
                    className="bg-muted/40 hover:bg-muted flex gap-3 rounded-xl p-4 transition-colors"
                  >
                    <span className="bg-background grid size-10 shrink-0 place-items-center rounded-lg shadow-sm">
                      <info.icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-semibold">{info.label}</h3>
                      <p className="text-muted-foreground text-sm">{info.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <PhotoPanel
              src={fragileImg}
              alt="A small parcel marked Fragile, handle with care, held in an open hand"
              className="aspect-[4/3]"
            />
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/40 border-y">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <FadeIn className="mb-12">
            <SectionHeading
              eyebrow="How it works"
              title="Follow a parcel from booking to doorstep."
              description="Every stage below is a real status in the system, recorded with a timestamp."
            />
          </FadeIn>
          <FadeIn>
            <LifecycleShowcase />
          </FadeIn>
        </div>
      </section>

      {/* Delivery charges */}
      <section id="charges" className="scroll-mt-28">
        <div className="container mx-auto grid gap-12 px-4 py-20 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <FadeIn className="space-y-6">
            <SectionHeading
              eyebrow="Delivery charges"
              title="Know the price before you book."
              description={`Base ${formatCurrency(PRICING.baseFee)} + ${formatCurrency(PRICING.perKg)} per kg + a surcharge for each hub's zone. The server uses the same formula, so the fee you see is the fee you pay.`}
            />
            <div className="flex flex-wrap gap-3">
              <AppButton asChild>
                <Link href="/#track">Use the calculator</Link>
              </AppButton>
              <AppButton asChild variant="outline" className="group">
                <Link href="/pricing">
                  Full pricing
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </AppButton>
            </div>
          </FadeIn>
          <FadeIn delay={0.08} className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <caption className="text-muted-foreground border-b px-4 py-3 text-left">
                Sending from an {FROM_ZONE.label.toLowerCase()} hub to…
              </caption>
              <thead className="bg-muted/40">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left font-medium">
                    Delivery zone
                  </th>
                  {CHARGE_WEIGHTS.map((w) => (
                    <th key={w} scope="col" className="px-4 py-3 text-right font-medium">
                      {w} kg
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    Each extra kg
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y border-t">
                {PRICING.zones.map((zone) => (
                  <tr key={zone.code}>
                    <th scope="row" className="px-4 py-3 text-left font-normal">
                      {zone.label}
                    </th>
                    {CHARGE_WEIGHTS.map((w) => (
                      <td key={w} className="px-4 py-3 text-right tabular-nums">
                        {formatCurrency(estimateFee(w, FROM_ZONE.code, zone.code).total)}
                      </td>
                    ))}
                    <td className="text-muted-foreground px-4 py-3 text-right tabular-nums">
                      +{formatCurrency(PRICING.perKg)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FadeIn>
        </div>
      </section>

      {/* Coverage */}
      <section id="coverage" className="bg-muted/40 scroll-mt-28 border-y">
        <div className="container mx-auto space-y-10 px-4 py-20 md:py-28">
          <FadeIn>
            <div className="group relative isolate flex aspect-[4/3] overflow-hidden rounded-3xl text-white shadow-xl sm:aspect-[21/9]">
              <Image
                src={streetImg}
                alt="A busy street in Bangladesh with rickshaws, motorbikes and pedestrians"
                fill
                placeholder="blur"
                sizes="100vw"
                className="-z-10 object-cover object-[50%_60%] transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/40 to-black/10 sm:bg-gradient-to-r sm:from-black/80 sm:via-black/45 sm:to-transparent"
              />
              <div className="mt-auto max-w-xl space-y-3 p-6 md:p-10">
                <p className="flex items-center gap-2 font-mono text-sm tracking-widest text-white/80 uppercase">
                  <span aria-hidden className="size-1.5 rounded-full bg-emerald-400" />
                  Coverage
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                  Find a hub near you.
                </h2>
                <p className="text-base text-pretty text-white/80 md:text-lg">
                  Every hub in the network, live. Parcels travel between any two of them.
                </p>
              </div>
            </div>
          </FadeIn>
          <FadeIn>
            <CoverageFinder />
          </FadeIn>
        </div>
      </section>

      {/* For senders / for couriers */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="grid gap-6 md:grid-cols-2">
          {AUDIENCES.map((audience, index) => (
            <FadeIn key={audience.role} delay={index * 0.08} className="h-full">
              <div className="group bg-card flex h-full flex-col overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-xl dark:ring-white/10">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={audience.photo.src}
                    alt={audience.photo.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-5 p-6 md:p-10">
                  <div className="flex items-center gap-2.5">
                    <audience.icon className="size-4" aria-hidden />
                    <p className="eyebrow text-foreground">{audience.role}</p>
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    {audience.title}
                  </h2>
                  <ul className="flex-1 space-y-2.5 text-sm">
                    {audience.points.map((point) => (
                      <li key={point} className="text-muted-foreground flex gap-2.5">
                        <Check className="text-signal mt-0.5 size-4 shrink-0" aria-hidden />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <AppButton asChild className="group/cta w-fit">
                    <Link href={audience.cta.href}>
                      {audience.cta.label}
                      <ArrowRight className="transition-transform group-hover/cta:translate-x-0.5" />
                    </Link>
                  </AppButton>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Running the network?{" "}
          <Link
            href="/login"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Try the admin demo
          </Link>
        </p>
      </section>

      {/* Why us */}
      <section className="border-t">
        <div className="container mx-auto grid gap-12 px-4 py-20 md:py-28 lg:grid-cols-[0.8fr_1.2fr]">
          <FadeIn>
            <SectionHeading
              eyebrow="Included"
              title="The details that matter after you press pay."
            />
          </FadeIn>
          <FadeIn className="bg-border grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="bg-background h-full space-y-3 p-6 md:p-8">
                <feature.icon className="size-5" aria-hidden />
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm text-pretty">{feature.description}</p>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-28 border-t">
        <div className="container mx-auto grid gap-12 px-4 py-20 md:py-28 lg:grid-cols-[0.8fr_1.2fr]">
          <FadeIn>
            <SectionHeading eyebrow="FAQ" title="Questions, answered." />
          </FadeIn>
          <div className="divide-y border-y">
            {FAQS.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="focus-visible:ring-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded font-medium focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown
                    className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="text-muted-foreground mt-3 max-w-prose text-sm text-pretty">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section aria-label="Get in touch" className="border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-border grid gap-px overflow-hidden rounded-2xl border md:grid-cols-3">
            <ContactItem
              icon={Mail}
              title="Email us"
              detail={siteConfig.contactEmail}
              href={`mailto:${siteConfig.contactEmail}`}
            />
            <ContactItem
              icon={MessageSquare}
              title="Send a message"
              detail="Questions about a delivery or your account"
              href="/contact"
            />
            <ContactItem
              icon={PackageSearch}
              title="Where's my parcel?"
              detail="Track it with your tracking number"
              href="/#track"
            />
          </div>
        </div>
      </section>

      <PhotoCta
        title="Your next parcel is four steps away."
        description="Create a free customer account, or sign up as a courier and start delivering."
        primary={{ label: "Create free account", href: "/register" }}
        secondary={{ label: "Try a demo account", href: "/login" }}
      />
    </>
  );
}

function ContactItem({
  icon: Icon,
  title,
  detail,
  href,
}: {
  icon: typeof Mail;
  title: string;
  detail: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-background hover:bg-muted/40 focus-visible:ring-ring group flex items-center gap-4 p-6 transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
    >
      <span className="bg-muted grid size-10 shrink-0 place-items-center rounded-full">
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{title}</span>
        <span className="text-muted-foreground block truncate text-sm">{detail}</span>
      </span>
      <ArrowRight
        className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
