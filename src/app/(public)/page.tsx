import {
  ArrowRight,
  Check,
  ChevronDown,
  ClipboardList,
  type LucideIcon,
  PackagePlus,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { HeroWaybill } from "@/components/modules/landing/HeroWaybill";
import { LifecycleShowcase } from "@/components/modules/landing/LifecycleShowcase";
import { TrackParcelForm } from "@/components/modules/parcels/TrackParcelForm";
import { AppButton } from "@/components/shared/AppButton";
import { FadeIn } from "@/components/shared/FadeIn";
import { JsonLd } from "@/components/shared/JsonLd";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FEATURES, PRICING } from "@/config/content";
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

const FACTS = [
  { value: "Stripe", label: "Card checkout, confirmed by webhook" },
  { value: "Photo", label: "Proof uploaded on every delivery" },
  { value: "3×", label: "Delivery attempts before return" },
  { value: String(PRICING.zones.length), label: "Pricing zones, one clear formula" },
];

const ROLES: Array<{
  icon: LucideIcon;
  role: string;
  title: string;
  points: string[];
  cta: { label: string; href: string };
}> = [
  {
    icon: PackagePlus,
    role: "Customers",
    title: "Send and follow",
    points: ["Book in four short steps", "See the fee, pay by card", "Track every status change"],
    cta: { label: "Create an account", href: "/register" },
  },
  {
    icon: ClipboardList,
    role: "Couriers",
    title: "Deliver and get paid",
    points: [
      "A clear list of assigned tasks",
      "Update status from the road",
      "Upload a photo as proof",
    ],
    cta: { label: "Join as a courier", href: "/register" },
  },
  {
    icon: ShieldCheck,
    role: "Admins",
    title: "Run the network",
    points: [
      "Assign couriers to parcels",
      "Manage hubs, zones and users",
      "Audit trail and live analytics",
    ],
    cta: { label: "Try the admin demo", href: "/login" },
  },
];

const FAQS = [
  {
    q: "How is the delivery fee calculated?",
    a: `A base fee of ${PRICING.currency} ${PRICING.baseFee}, plus ${PRICING.currency} ${PRICING.perKg} per kilogram, plus a surcharge for the zone of each hub. The exact fee is shown before you pay.`,
  },
  {
    q: "How do I pay?",
    a: "By card through Stripe Checkout. The parcel is marked as paid as soon as Stripe confirms the payment.",
  },
  {
    q: "What happens if nobody is home?",
    a: "Failed deliveries are retried up to three times. After that the parcel is returned to the sender.",
  },
  {
    q: "How do I know it arrived?",
    a: "The courier uploads a photo on delivery. It appears on the tracking page next to the full status history.",
  },
  {
    q: "Do I need an account to track a parcel?",
    a: "No. Anyone with a tracking number can follow it from the tracking page.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={structuredData} />

      <section className="relative overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
        <div className="container mx-auto grid items-center gap-14 px-4 pt-12 pb-20 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-28">
          <div className="space-y-8">
            <FadeIn className="space-y-5">
              <p className="eyebrow flex items-center gap-2">
                <span aria-hidden className="bg-signal size-1.5 rounded-full" />
                Courier & logistics platform
              </p>
              <h1 className="text-[2.5rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.5rem]">
                Book it, pay for it, and watch it arrive.
              </h1>
              <p className="text-muted-foreground max-w-xl text-lg text-pretty">
                {siteConfig.name} connects the people sending parcels, the couriers carrying them
                and the team running the hubs — with clear zone pricing, card checkout and a full
                status history for every shipment.
              </p>
            </FadeIn>
            <FadeIn delay={0.08} className="flex flex-wrap items-center gap-3">
              <AppButton asChild size="lg" className="group h-10 px-4">
                <Link href="/register">
                  Send a parcel
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </AppButton>
              <AppButton asChild size="lg" variant="ghost" className="h-10 px-4">
                <Link href="/login">Try a demo account</Link>
              </AppButton>
            </FadeIn>
            <FadeIn delay={0.16} className="max-w-lg space-y-2 border-t pt-6">
              <p className="text-muted-foreground text-sm">Already sent something? Track it:</p>
              <TrackParcelForm />
            </FadeIn>
          </div>
          <HeroWaybill />
        </div>
      </section>

      <section aria-label="What every delivery includes" className="border-y">
        <dl className="container mx-auto grid grid-cols-2 px-4 lg:grid-cols-4">
          {FACTS.map((fact) => (
            <div
              key={fact.label}
              className="space-y-1 py-7 pr-4 pl-6 odd:pl-0 even:border-l [&:nth-child(n+3)]:border-t lg:border-l lg:pl-6 lg:odd:pl-6 lg:first:border-l-0 lg:first:pl-0 lg:[&:nth-child(n+3)]:border-t-0"
            >
              <dt className="text-2xl font-semibold tracking-tight">{fact.value}</dt>
              <dd className="text-muted-foreground text-sm">{fact.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container mx-auto px-4 py-20 md:py-28">
        <FadeIn>
          <SectionHeading
            eyebrow="Who it's for"
            title="One platform, three roles."
            description="Each role gets its own workspace, and the backend checks every request against it."
          />
        </FadeIn>
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x">
          {ROLES.map((role, index) => (
            <FadeIn
              key={role.role}
              delay={index * 0.06}
              className="space-y-5 md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <div className="flex items-center gap-2.5">
                <role.icon className="size-4" aria-hidden />
                <p className="eyebrow text-foreground">{role.role}</p>
              </div>
              <h3 className="text-xl font-semibold tracking-tight">{role.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {role.points.map((point) => (
                  <li key={point} className="text-muted-foreground flex gap-2.5">
                    <Check className="text-signal mt-0.5 size-4 shrink-0" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href={role.cta.href}
                className="group focus-visible:ring-ring inline-flex items-center gap-1 rounded text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
              >
                {role.cta.label}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

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

      <section className="container mx-auto grid gap-12 px-4 py-20 md:py-28 lg:grid-cols-[0.8fr_1.2fr]">
        <FadeIn>
          <SectionHeading eyebrow="Included" title="The details that matter after you press pay." />
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
      </section>

      <section className="border-t">
        <div className="container mx-auto grid gap-12 px-4 py-20 md:py-28 lg:grid-cols-2 lg:items-start">
          <FadeIn className="space-y-8">
            <SectionHeading
              eyebrow="Pricing"
              title="One formula. No surprises."
              description="The server calculates every fee with the same rule, and you see the total before checkout."
            />
            <p className="bg-muted/60 rounded-xl border px-5 py-4 font-mono text-sm leading-relaxed">
              <span className="text-muted-foreground">fee = </span>
              {PRICING.baseFee}
              <span className="text-muted-foreground"> + </span>
              {PRICING.perKg} × kg
              <span className="text-muted-foreground"> + </span>
              zone(origin)
              <span className="text-muted-foreground"> + </span>
              zone(destination)
            </p>
            <AppButton asChild variant="outline" className="group">
              <Link href="/pricing">
                Full pricing and an example
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </AppButton>
          </FadeIn>
          <FadeIn delay={0.08}>
            <table className="w-full text-sm">
              <caption className="eyebrow mb-3 text-left">
                Zone surcharge per hub ({PRICING.currency})
              </caption>
              <tbody className="divide-y border-y">
                {PRICING.zones.map((zone) => (
                  <tr key={zone.code}>
                    <th scope="row" className="py-3 text-left font-normal">
                      {zone.label}
                    </th>
                    <td className="py-3 text-right font-mono tabular-nums">
                      {zone.surcharge === 0 ? "—" : `+${zone.surcharge}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FadeIn>
        </div>
      </section>

      <section className="border-t">
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

      <section className="container mx-auto px-4 pb-20 md:pb-28">
        <FadeIn>
          <div className="surface-ink flex flex-col gap-8 rounded-2xl px-6 py-12 md:flex-row md:items-end md:justify-between md:px-12 md:py-14">
            <div className="max-w-xl space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                Your next parcel is four steps away.
              </h2>
              <p className="text-pretty opacity-70">
                Create a free customer account, or sign up as a courier and start delivering.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <AppButton asChild size="lg" className="h-10 border-transparent px-4">
                <Link href="/register">Create free account</Link>
              </AppButton>
              <Link
                href="/login"
                className="focus-visible:ring-ring rounded px-2 py-2 text-sm font-medium opacity-80 hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
              >
                Try a demo account
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
