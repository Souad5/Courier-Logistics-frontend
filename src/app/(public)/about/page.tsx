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
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return pageMetadata({
    title: t.publicPages.about.meta.title,
    description: t.publicPages.about.meta.description,
    path: "/about",
  });
}

// Text: `publicPages.about.values.items[key]` / `publicPages.about.model.items[key]`.
const VALUES = [
  { key: "reliability", icon: ShieldCheck },
  { key: "transparency", icon: Eye },
  { key: "accountability", icon: BadgeCheck },
] as const;

const MODEL = [
  { key: "hubs", icon: Warehouse },
  { key: "zones", icon: MapPin },
  { key: "roles", icon: Users },
] as const;

export default async function AboutPage() {
  const { t, f, format } = await getI18n();
  const a = t.publicPages.about;
  return (
    <>
      <PublicPageHeader
        image={streetImg}
        imagePosition="50% 55%"
        eyebrow={format(a.header.eyebrow, { name: siteConfig.name })}
        title={a.header.title}
        description={a.header.description}
      />

      {/* Story */}
      <section className="container mx-auto grid items-center gap-12 px-4 py-20 md:py-28 lg:grid-cols-2">
        <FadeIn>
          <PhotoPanel src={teamImg} alt={a.story.photoAlt} className="aspect-[4/3]" />
        </FadeIn>
        <FadeIn delay={0.1} className="space-y-6">
          <SectionHeading eyebrow={a.story.eyebrow} title={a.story.title} />
          <div className="text-muted-foreground space-y-4 text-pretty">
            <p>{format(a.story.p1, { name: siteConfig.name })}</p>
            <p>{a.story.p2}</p>
          </div>
        </FadeIn>
      </section>

      {/* Values */}
      <section className="bg-muted/40 border-y">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <FadeIn>
            <SectionHeading
              eyebrow={a.values.eyebrow}
              title={a.values.title}
              align="center"
              className="mx-auto"
            />
          </FadeIn>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((value, index) => (
              <FadeIn key={value.key} delay={index * 0.08} className="h-full">
                <div className="bg-card h-full space-y-4 rounded-2xl p-7 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:ring-white/10">
                  <div className="flex items-center justify-between">
                    <span className="bg-muted grid size-12 place-items-center rounded-2xl">
                      <value.icon className="size-5" aria-hidden />
                    </span>
                    <span className="text-muted-foreground font-mono text-sm">
                      {f.number(index + 1, { minimumIntegerDigits: 2 })}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{a.values.items[value.key].title}</h3>
                  <p className="text-muted-foreground text-sm text-pretty">
                    {a.values.items[value.key].text}
                  </p>
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
              {a.network.eyebrow}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              {a.network.title}
            </h2>
            <p className="text-pretty text-white/75">{a.network.description}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <LiveStats />
          </FadeIn>
        </div>
      </section>

      {/* How it's organised */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <FadeIn>
          <SectionHeading eyebrow={a.model.eyebrow} title={a.model.title} />
        </FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {MODEL.map((item, index) => (
            <FadeIn key={item.key} delay={index * 0.08}>
              <div className="relative flex h-full gap-4 pt-6">
                <span
                  aria-hidden
                  className="from-signal absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r to-transparent"
                />
                <span className="bg-muted grid size-11 shrink-0 place-items-center rounded-xl">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <div className="space-y-1.5">
                  <h3 className="font-semibold">{a.model.items[item.key].term}</h3>
                  <p className="text-muted-foreground text-sm text-pretty">
                    {a.model.items[item.key].text}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <PhotoCta
        title={a.cta.title}
        description={a.cta.description}
        primary={{ label: a.cta.primary, href: "/register" }}
        secondary={{ label: a.cta.secondary, href: "/contact" }}
      />
    </>
  );
}
