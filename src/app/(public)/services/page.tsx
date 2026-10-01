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
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { PARCEL_TYPES, type ParcelType } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return pageMetadata({
    title: t.publicPages.services.meta.title,
    description: t.publicPages.services.meta.description,
    path: "/services",
  });
}

// Unsplash photos — sources in src/assets/landing/CREDITS.md.
// Alt text: `publicPages.services.types.photoAlts[type]`.
const TYPE_PHOTOS: Record<ParcelType, typeof documentsImg> = {
  DOCUMENT: documentsImg,
  PARCEL: parcelImg,
  FRAGILE: fragileImg,
  PERISHABLE: perishableImg,
};

// Text: `publicPages.services.steps.items[key]`.
const STEPS = [
  { key: "book", icon: CreditCard },
  { key: "pickup", icon: Warehouse },
  { key: "transit", icon: Truck },
  { key: "delivered", icon: Camera },
] as const;

export default async function ServicesPage() {
  const { t, f } = await getI18n();
  const s = t.publicPages.services;
  return (
    <>
      <PublicPageHeader
        image={hubImg}
        imagePosition="50% 40%"
        eyebrow={s.header.eyebrow}
        title={s.header.title}
        description={s.header.description}
      />

      {/* Parcel types */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <FadeIn>
          <SectionHeading
            eyebrow={s.types.eyebrow}
            title={s.types.title}
            description={s.types.description}
          />
        </FadeIn>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PARCEL_TYPES.map((type, index) => {
            const info = PARCEL_TYPE_INFO[type];
            const text = t.landing.content.parcelTypes[type];
            return (
              <FadeIn key={type} delay={index * 0.06} className="h-full">
                <article className="group bg-card flex h-full flex-col overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:ring-white/10">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={TYPE_PHOTOS[type]}
                      alt={s.types.photoAlts[type]}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <div className="flex items-center gap-2">
                      <info.icon className="size-4" aria-hidden />
                      <h3 className="font-semibold">{text.label}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{text.description}</p>
                    <p className="mt-auto pt-2 text-sm font-medium">{s.types.tips[type]}</p>
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
            <SectionHeading eyebrow={s.steps.eyebrow} title={s.steps.title} />
          </FadeIn>
          <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
            <span
              aria-hidden
              className="bg-border absolute top-6 right-[12.5%] left-[12.5%] hidden h-px md:block"
            />
            {STEPS.map((step, index) => (
              <li key={step.key}>
                <FadeIn
                  delay={index * 0.1}
                  className="relative flex gap-4 md:flex-col md:items-center md:text-center"
                >
                  <span className="bg-background relative grid size-12 shrink-0 place-items-center rounded-full shadow-md ring-1 ring-black/5 dark:ring-white/10">
                    <step.icon className="size-5" aria-hidden />
                    <span className="bg-signal text-background absolute -top-1 -right-1 grid size-5 place-items-center rounded-full font-mono text-[0.7rem] font-semibold">
                      {f.number(index + 1)}
                    </span>
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{s.steps.items[step.key].title}</h3>
                    <p className="text-muted-foreground text-sm text-pretty">
                      {s.steps.items[step.key].text}
                    </p>
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
            alt={s.included.photoAlt}
            className="aspect-[4/5] lg:aspect-[4/4.5]"
            caption={
              <p className="flex items-center gap-2 text-sm font-medium">
                <PackageCheck className="size-4" aria-hidden />
                {s.included.caption}
              </p>
            }
          />
        </FadeIn>
        <div className="space-y-8">
          <FadeIn>
            <SectionHeading
              eyebrow={s.included.eyebrow}
              title={s.included.title}
              description={s.included.description}
            />
          </FadeIn>
          <ul className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature, index) => (
              <li key={feature.key}>
                <FadeIn
                  delay={index * 0.06}
                  className="bg-muted/40 hover:bg-muted h-full space-y-3 rounded-2xl p-5 transition-colors"
                >
                  <span className="bg-background grid size-10 place-items-center rounded-xl shadow-sm">
                    <feature.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-semibold">{t.landing.content.features[feature.key].title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t.landing.content.features[feature.key].description}
                  </p>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PhotoCta
        title={s.cta.title}
        description={s.cta.description}
        primary={{ label: s.cta.primary, href: "/register" }}
        secondary={{ label: s.cta.secondary, href: "/pricing" }}
      />
    </>
  );
}
