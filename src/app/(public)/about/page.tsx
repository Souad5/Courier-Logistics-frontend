import { BadgeCheck, Eye, MapPin, ShieldCheck, Users, Warehouse } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import courierStreetImg from "@/assets/landing/courier-street.jpg";
import streetImg from "@/assets/landing/street.jpg";
import teamImg from "@/assets/landing/team.jpg";
import { LiveStats } from "@/components/modules/landing/LiveStats";
import { FadeIn } from "@/components/shared/FadeIn";
import { PhotoCta } from "@/components/shared/PhotoCta";
import { PhotoPanel } from "@/components/shared/PhotoPanel";
import { PublicPageHeader, SectionHeading } from "@/components/shared/SectionHeading";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "We connect customers with couriers through a hub network, clear pricing and end-to-end parcel tracking.",
  path: "/about",
});

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Reliability",
    text: "Every status change is recorded with a timestamp, so nothing goes missing without a trace.",
  },
  {
    icon: Eye,
    title: "Transparency",
    text: "Fees follow one published formula and are shown before you pay.",
  },
  {
    icon: BadgeCheck,
    title: "Accountability",
    text: "Couriers confirm deliveries with a photo, and every critical action is written to an audit log.",
  },
];

const MODEL = [
  {
    icon: Warehouse,
    term: "Hubs",
    text: "Parcels move between hubs. Each hub has a code, an address and belongs to a zone.",
  },
  {
    icon: MapPin,
    term: "Zones",
    text: "A zone sets the surcharge for pickups and deliveries at its hubs — inner city to remote.",
  },
  {
    icon: Users,
    term: "Roles",
    text: "Customers, couriers and admins each get their own workspace, checked on every request.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PublicPageHeader
        image={streetImg}
        imagePosition="50% 55%"
        eyebrow={`About ${siteConfig.name}`}
        title="We connect people who need things delivered with the couriers who deliver them."
        description="A hub network, clear pricing and end-to-end tracking sit in between — so everyone involved can see where a parcel is and who is responsible for it."
      />

      {/* Story */}
      <section className="container mx-auto grid items-center gap-12 px-4 py-20 md:py-28 lg:grid-cols-2">
        <FadeIn>
          <PhotoPanel
            src={teamImg}
            alt="A team loading cardboard parcels into the back of a truck"
            className="aspect-[4/3]"
          />
        </FadeIn>
        <FadeIn delay={0.1} className="space-y-6">
          <SectionHeading eyebrow="Our story" title="Built around the parcel, not the paperwork." />
          <div className="text-muted-foreground space-y-4 text-pretty">
            <p>
              Sending a parcel shouldn&apos;t mean phone calls to find out where it is.{" "}
              {siteConfig.name} puts the booking, the payment and every scan of the journey in one
              place.
            </p>
            <p>
              Customers see the fee before they pay. Couriers get a clear task list and update the
              status from the road. Admins assign work, manage hubs and can audit every critical
              action.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Values */}
      <section className="bg-muted/40 border-y">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <FadeIn>
            <SectionHeading
              eyebrow="What we value"
              title="Three promises we build around."
              align="center"
              className="mx-auto"
            />
          </FadeIn>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((value, index) => (
              <FadeIn key={value.title} delay={index * 0.08} className="h-full">
                <div className="bg-card h-full space-y-4 rounded-2xl p-7 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:ring-white/10">
                  <div className="flex items-center justify-between">
                    <span className="bg-muted grid size-12 place-items-center rounded-2xl">
                      <value.icon className="size-5" aria-hidden />
                    </span>
                    <span className="text-muted-foreground font-mono text-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground text-sm text-pretty">{value.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Network in numbers, over a photo */}
      <section className="relative isolate overflow-hidden text-white">
        <Image
          src={courierStreetImg}
          alt=""
          fill
          placeholder="blur"
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/65" />
        <div className="container mx-auto grid items-center gap-10 px-4 py-20 md:py-28 lg:grid-cols-2">
          <FadeIn className="max-w-lg space-y-3">
            <p className="font-mono text-sm tracking-widest text-white/80 uppercase">
              The network today
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              Real numbers, straight from our hub list.
            </h2>
            <p className="text-pretty text-white/75">
              No rounded-up marketing figures — these update as hubs are added to the network.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <LiveStats />
          </FadeIn>
        </div>
      </section>

      {/* How it's organised */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <FadeIn>
          <SectionHeading eyebrow="How it's organised" title="Hubs, zones and roles." />
        </FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {MODEL.map((item, index) => (
            <FadeIn key={item.term} delay={index * 0.08}>
              <div className="relative flex h-full gap-4 pt-6">
                <span
                  aria-hidden
                  className="from-signal absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r to-transparent"
                />
                <span className="bg-muted grid size-11 shrink-0 place-items-center rounded-xl">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <div className="space-y-1.5">
                  <h3 className="font-semibold">{item.term}</h3>
                  <p className="text-muted-foreground text-sm text-pretty">{item.text}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <PhotoCta
        title="Join the network."
        description="Send your first parcel, or sign up as a courier and start delivering."
        primary={{ label: "Create free account", href: "/register" }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </>
  );
}
