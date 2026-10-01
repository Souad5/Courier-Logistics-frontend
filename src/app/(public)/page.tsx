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
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { PARCEL_TYPES } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return pageMetadata({
    title: t.meta.defaultTitle,
    absoluteTitle: true,
    description: t.landing.meta.description,
    path: "/",
  });
}

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

// Text: `landing.audiences[key]`.
const AUDIENCES = [
  { key: "senders", icon: PackagePlus, href: "/register", photo: vanImg },
  { key: "couriers", icon: ClipboardList, href: "/register", photo: scooterImg },
] as const;

// Unsplash photos (free Unsplash License); sources listed in src/assets/landing/CREDITS.md.
// Alt text: `landing.services.photoAlts[key]`.
const SERVICE_PHOTOS = { send: sendImg, track: trackImg, deliver: deliverImg };

export default async function HomePage() {
  const { t, f, format } = await getI18n();
  const zoneName = (code: string, fallback: string) => t.enums.zone[code] ?? fallback;
  const faqVars = {
    currency: PRICING.currency,
    baseFee: f.number(PRICING.baseFee),
    perKg: f.number(PRICING.perKg),
  };
  return (
    <>
      <JsonLd data={structuredData} />

      {/* Hero — full-bleed photo, bold claim + live network numbers (Steadfast), tools card overlapping its edge (RedX). */}
      <section className="relative isolate overflow-hidden text-white">
        <HeroBackdrop />
        <div className="container mx-auto grid min-h-[38rem] items-center gap-10 px-4 pt-28 pb-36 sm:pt-32 md:gap-12 md:pt-40 lg:min-h-[44rem] lg:grid-cols-[1.15fr_0.85fr] lg:pb-44">
          <div className="space-y-7">
            <FadeIn>
              <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-white/80 uppercase min-[380px]:text-sm">
                <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-emerald-400" />
                {t.landing.hero.eyebrow}
              </p>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h1 className="text-[2.25rem] leading-[1.05] font-semibold tracking-tight text-balance min-[380px]:text-[2.6rem] sm:text-6xl xl:text-7xl">
                {t.landing.hero.title}
              </h1>
            </FadeIn>
            <FadeIn delay={0.14}>
              <p className="max-w-xl text-base text-pretty text-white/80 sm:text-lg">
                {t.landing.hero.subtitle}
              </p>
            </FadeIn>
            <FadeIn delay={0.22} className="flex flex-wrap items-center gap-3">
              <AppButton
                asChild
                size="lg"
                className="group h-12 flex-1 border-transparent px-6 shadow-lg shadow-black/20 sm:flex-none"
              >
                <Link href="/register">
                  {t.landing.hero.sendParcel}
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </AppButton>
              <AppButton
                asChild
                size="lg"
                variant="ghost"
                className="h-12 flex-1 border border-white/30 bg-white/10 px-6 text-white backdrop-blur hover:bg-white/20 hover:text-white sm:flex-none"
              >
                <Link href="/register">{t.landing.hero.becomeCourier}</Link>
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
            eyebrow={t.landing.services.eyebrow}
            title={t.landing.services.title}
            description={t.landing.services.description}
          />
        </FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SERVICES.map((service, index) => {
            const text = t.landing.content.services[service.key];
            return (
              <FadeIn key={service.key} delay={index * 0.08} className="h-full">
                <Link
                  href={service.href}
                  className="group bg-card focus-visible:ring-ring flex h-full flex-col overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:outline-none dark:ring-white/10"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={SERVICE_PHOTOS[service.key]}
                      alt={t.landing.services.photoAlts[service.key]}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 font-mono text-sm text-white backdrop-blur">
                      {f.number(0)}
                      {f.number(index + 1)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <div className="flex items-center gap-2.5">
                      <service.icon className="size-5" aria-hidden />
                      <h3 className="text-xl font-semibold tracking-tight">{text.title}</h3>
                    </div>
                    <p className="text-muted-foreground flex-1 text-sm text-pretty">
                      {text.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium">
                      {text.cta}
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* What we carry */}
      <section className="border-t">
        <div className="container mx-auto grid items-center gap-12 px-4 py-20 md:py-28 lg:grid-cols-2">
          <FadeIn className="space-y-8">
            <SectionHeading
              eyebrow={t.landing.carry.eyebrow}
              title={t.landing.carry.title}
              description={t.landing.carry.description}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {PARCEL_TYPES.map((type) => {
                const info = PARCEL_TYPE_INFO[type];
                const text = t.landing.content.parcelTypes[type];
                return (
                  <div
                    key={type}
                    className="bg-muted/40 hover:bg-muted flex gap-3 rounded-xl p-4 transition-colors"
                  >
                    <span className="bg-background grid size-10 shrink-0 place-items-center rounded-lg shadow-sm">
                      <info.icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-semibold">{text.label}</h3>
                      <p className="text-muted-foreground text-sm">{text.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <PhotoPanel
              src={fragileImg}
              alt={t.landing.carry.photoAlt}
              className="aspect-[4/3] md:aspect-[16/9] lg:aspect-[4/3]"
            />
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/40 border-y">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <FadeIn className="mb-12">
            <SectionHeading
              eyebrow={t.landing.howItWorks.eyebrow}
              title={t.landing.howItWorks.title}
              description={t.landing.howItWorks.description}
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
              eyebrow={t.landing.charges.eyebrow}
              title={t.landing.charges.title}
              description={format(t.landing.charges.description, {
                baseFee: f.currency(PRICING.baseFee),
                perKg: f.currency(PRICING.perKg),
              })}
            />
            <div className="flex flex-wrap gap-3">
              <AppButton asChild>
                <Link href="/#track">{t.landing.charges.useCalculator}</Link>
              </AppButton>
              <AppButton asChild variant="outline" className="group">
                <Link href="/pricing">
                  {t.landing.charges.fullPricing}
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </AppButton>
            </div>
          </FadeIn>
          <FadeIn delay={0.08} className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <caption className="text-muted-foreground border-b px-3 py-3 text-left sm:px-4">
                {format(t.landing.charges.caption, {
                  zone: zoneName(FROM_ZONE.code, FROM_ZONE.label).toLowerCase(),
                })}
                <span className="block text-xs sm:hidden">
                  {format(t.landing.charges.mobileNote, {
                    currency: PRICING.currency,
                    perKg: f.number(PRICING.perKg),
                  })}
                </span>
              </caption>
              <thead className="bg-muted/40">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left font-medium sm:px-4">
                    <span className="sm:hidden">{t.landing.charges.zone}</span>
                    <span className="hidden sm:inline">{t.landing.charges.deliveryZone}</span>
                  </th>
                  {CHARGE_WEIGHTS.map((w) => (
                    <th
                      key={w}
                      scope="col"
                      className="px-3 py-3 text-right font-medium whitespace-nowrap sm:px-4"
                    >
                      {format(t.landing.charges.weight, { kg: f.number(w) })}
                    </th>
                  ))}
                  <th scope="col" className="hidden px-4 py-3 text-right font-medium sm:table-cell">
                    {t.landing.charges.extraKg}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y border-t">
                {PRICING.zones.map((zone) => (
                  <tr key={zone.code}>
                    <th scope="row" className="px-3 py-3 text-left font-normal sm:px-4">
                      {zoneName(zone.code, zone.label)}
                    </th>
                    {CHARGE_WEIGHTS.map((w) => (
                      <td key={w} className="px-3 py-3 text-right tabular-nums sm:px-4">
                        <span className="sm:hidden">
                          {f.number(estimateFee(w, FROM_ZONE.code, zone.code).total, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <span className="hidden whitespace-nowrap sm:inline">
                          {f.currency(estimateFee(w, FROM_ZONE.code, zone.code).total)}
                        </span>
                      </td>
                    ))}
                    <td className="text-muted-foreground hidden px-4 py-3 text-right whitespace-nowrap tabular-nums sm:table-cell">
                      +{f.currency(PRICING.perKg)}
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
                alt={t.landing.coverage.photoAlt}
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
                  {t.landing.coverage.eyebrow}
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                  {t.landing.coverage.title}
                </h2>
                <p className="text-base text-pretty text-white/80 md:text-lg">
                  {t.landing.coverage.description}
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
          {AUDIENCES.map((audience, index) => {
            const text = t.landing.audiences[audience.key];
            return (
              <FadeIn key={audience.key} delay={index * 0.08} className="h-full">
                <div className="group bg-card flex h-full flex-col overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-xl dark:ring-white/10">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={audience.photo}
                      alt={text.photoAlt}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-5 p-6 md:p-10">
                    <div className="flex items-center gap-2.5">
                      <audience.icon className="size-4" aria-hidden />
                      <p className="eyebrow text-foreground">{text.role}</p>
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                      {text.title}
                    </h2>
                    <ul className="flex-1 space-y-2.5 text-sm">
                      {text.points.map((point) => (
                        <li key={point} className="text-muted-foreground flex gap-2.5">
                          <Check className="text-signal mt-0.5 size-4 shrink-0" aria-hidden />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <AppButton asChild className="group/cta w-fit">
                      <Link href={audience.href}>
                        {text.cta}
                        <ArrowRight className="transition-transform group-hover/cta:translate-x-0.5" />
                      </Link>
                    </AppButton>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
        <p className="text-muted-foreground mt-6 text-center text-sm">
          {t.landing.audiences.adminPrompt}{" "}
          <Link
            href="/login"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            {t.landing.audiences.adminDemo}
          </Link>
        </p>
      </section>

      {/* Why us */}
      <section className="border-t">
        <div className="container mx-auto grid gap-12 px-4 py-20 md:py-28 lg:grid-cols-[0.8fr_1.2fr]">
          <FadeIn>
            <SectionHeading eyebrow={t.landing.included.eyebrow} title={t.landing.included.title} />
          </FadeIn>
          <FadeIn className="bg-border grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.key} className="bg-background h-full space-y-3 p-6 md:p-8">
                <feature.icon className="size-5" aria-hidden />
                <h3 className="font-semibold">{t.landing.content.features[feature.key].title}</h3>
                <p className="text-muted-foreground text-sm text-pretty">
                  {t.landing.content.features[feature.key].description}
                </p>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-28 border-t">
        <div className="container mx-auto grid gap-12 px-4 py-20 md:py-28 lg:grid-cols-[0.8fr_1.2fr]">
          <FadeIn>
            <SectionHeading eyebrow={t.landing.faq.eyebrow} title={t.landing.faq.title} />
          </FadeIn>
          <div className="divide-y border-y">
            {FAQS.map(({ key }) => {
              const item = t.landing.content.faqs[key];
              return (
                <details key={key} className="group py-5">
                  <summary className="focus-visible:ring-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded font-medium focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <ChevronDown
                      className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <p className="text-muted-foreground mt-3 max-w-prose text-sm text-pretty">
                    {format(item.a, faqVars)}
                  </p>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section aria-label={t.landing.contactStrip.label} className="border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-border grid gap-px overflow-hidden rounded-2xl border md:grid-cols-3">
            <ContactItem
              icon={Mail}
              title={t.landing.contactStrip.email}
              detail={siteConfig.contactEmail}
              href={`mailto:${siteConfig.contactEmail}`}
            />
            <ContactItem
              icon={MessageSquare}
              title={t.landing.contactStrip.message}
              detail={t.landing.contactStrip.messageDetail}
              href="/contact"
            />
            <ContactItem
              icon={PackageSearch}
              title={t.landing.contactStrip.track}
              detail={t.landing.contactStrip.trackDetail}
              href="/#track"
            />
          </div>
        </div>
      </section>

      <PhotoCta
        title={t.landing.cta.title}
        description={t.landing.cta.description}
        primary={{ label: t.landing.cta.primary, href: "/register" }}
        secondary={{ label: t.landing.cta.secondary, href: "/login" }}
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
