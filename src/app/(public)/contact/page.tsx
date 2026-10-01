import { ArrowRight, Bike, Check, Mail, PackageSearch } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import sendImg from "@/assets/landing/send.jpg";
import supportImg from "@/assets/landing/support.jpg";
import { ContactForm } from "@/components/modules/contact/ContactForm";
import { FadeIn } from "@/components/shared/FadeIn";
import { PhotoPanel } from "@/components/shared/PhotoPanel";
import { PublicPageHeader } from "@/components/shared/SectionHeading";
import { siteConfig } from "@/config/site";
import { interpolateNodes } from "@/i18n/rich";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return pageMetadata({
    title: t.publicPages.contact.meta.title,
    description: t.publicPages.contact.meta.description,
    path: "/contact",
  });
}

// Text: `publicPages.contact.channels[key]`; the email channel shows the address itself.
const CHANNELS = [
  { key: "email", icon: Mail, href: `mailto:${siteConfig.contactEmail}` },
  { key: "track", icon: PackageSearch, href: "/#track" },
  { key: "courier", icon: Bike, href: "/register" },
] as const;

export default async function ContactPage() {
  const { t } = await getI18n();
  const c = t.publicPages.contact;
  const channelDetail = {
    email: siteConfig.contactEmail,
    track: c.channels.track.detail,
    courier: c.channels.courier.detail,
  };
  const linkClass = "text-foreground font-medium underline-offset-4 hover:underline";
  return (
    <>
      <PublicPageHeader
        image={supportImg}
        imagePosition="60% 35%"
        eyebrow={c.header.eyebrow}
        title={c.header.title}
        description={c.header.description}
      />

      {/* Channels overlapping the header */}
      <div className="relative z-10 container mx-auto -mt-16 px-4">
        <div className="grid gap-4 md:grid-cols-3">
          {CHANNELS.map((channel, index) => (
            <FadeIn key={channel.key} delay={0.2 + index * 0.08} className="h-full">
              <Link
                href={channel.href}
                className="group bg-card focus-visible:ring-ring flex h-full flex-col gap-3 rounded-2xl p-6 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:ring-2 focus-visible:outline-none"
              >
                <span className="bg-muted grid size-11 place-items-center rounded-xl">
                  <channel.icon className="size-5" aria-hidden />
                </span>
                <h2 className="font-semibold">{c.channels[channel.key].title}</h2>
                <p className="text-muted-foreground flex-1 text-sm wrap-break-word">
                  {channelDetail[channel.key]}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium">
                  {c.channels[channel.key].cta}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Form + side panel */}
      <section className="container mx-auto grid gap-10 px-4 py-20 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <FadeIn>
          <div className="bg-card rounded-3xl p-6 shadow-sm ring-1 ring-black/5 md:p-10 dark:ring-white/10">
            <div className="mb-8 space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">{c.form.title}</h2>
              <p className="text-muted-foreground text-sm">{c.form.description}</p>
            </div>
            <ContactForm />
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="space-y-6">
          <PhotoPanel
            src={sendImg}
            alt={c.aside.photoAlt}
            className="aspect-4/3"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
          <div className="bg-muted/40 space-y-4 rounded-3xl p-6 md:p-8">
            <h2 className="font-semibold">{c.aside.title}</h2>
            <ul className="space-y-3 text-sm">
              {c.aside.tips.map((tip) => (
                <li key={tip} className="text-muted-foreground flex gap-2.5">
                  <Check className="text-signal mt-0.5 size-4 shrink-0" aria-hidden />
                  {tip}
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground border-t pt-4 text-sm">
              {interpolateNodes(c.aside.more, {
                faq: (
                  <Link href="/#faq" className={linkClass}>
                    {c.aside.faqLink}
                  </Link>
                ),
                pricing: (
                  <Link href="/pricing" className={linkClass}>
                    {c.aside.pricingLink}
                  </Link>
                ),
              })}
            </p>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
