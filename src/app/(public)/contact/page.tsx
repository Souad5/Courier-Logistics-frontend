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
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Questions about a delivery, pricing or becoming a courier? Get in touch with our support team.",
  path: "/contact",
});

const CHANNELS = [
  {
    icon: Mail,
    title: "Email us",
    detail: siteConfig.contactEmail,
    href: `mailto:${siteConfig.contactEmail}`,
    cta: "Write an email",
  },
  {
    icon: PackageSearch,
    title: "Where's my parcel?",
    detail: "Track it any time with your tracking number — no account needed.",
    href: "/#track",
    cta: "Track a parcel",
  },
  {
    icon: Bike,
    title: "Become a courier",
    detail: "Sign up, go on duty and start receiving delivery tasks.",
    href: "/register",
    cta: "Join as a courier",
  },
];

const TIPS = [
  "Include your tracking number if it's about a delivery",
  "Mention the pickup and delivery hubs for pricing questions",
  "Use the email address on your account so we can find it",
];

export default function ContactPage() {
  return (
    <>
      <PublicPageHeader
        image={supportImg}
        imagePosition="60% 35%"
        eyebrow="Contact"
        title="Talk to a person."
        description="Questions about a delivery, pricing, or becoming a courier? Send us a message and our support team will help."
      />

      {/* Channels overlapping the header */}
      <div className="relative z-10 container mx-auto -mt-16 px-4">
        <div className="grid gap-4 md:grid-cols-3">
          {CHANNELS.map((channel, index) => (
            <FadeIn key={channel.title} delay={0.2 + index * 0.08} className="h-full">
              <Link
                href={channel.href}
                className="group bg-card focus-visible:ring-ring flex h-full flex-col gap-3 rounded-2xl p-6 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:ring-2 focus-visible:outline-none"
              >
                <span className="bg-muted grid size-11 place-items-center rounded-xl">
                  <channel.icon className="size-5" aria-hidden />
                </span>
                <h2 className="font-semibold">{channel.title}</h2>
                <p className="text-muted-foreground flex-1 text-sm break-words">{channel.detail}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium">
                  {channel.cta}
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
              <h2 className="text-2xl font-semibold tracking-tight">Send us a message</h2>
              <p className="text-muted-foreground text-sm">
                Tell us what you need and we&apos;ll get back to you by email.
              </p>
            </div>
            <ContactForm />
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="space-y-6">
          <PhotoPanel
            src={sendImg}
            alt="A parcel being handed from one person to another"
            className="aspect-[4/3]"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
          <div className="bg-muted/40 space-y-4 rounded-3xl p-6 md:p-8">
            <h2 className="font-semibold">Before you write</h2>
            <ul className="space-y-3 text-sm">
              {TIPS.map((tip) => (
                <li key={tip} className="text-muted-foreground flex gap-2.5">
                  <Check className="text-signal mt-0.5 size-4 shrink-0" aria-hidden />
                  {tip}
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground border-t pt-4 text-sm">
              Quick answers are in the{" "}
              <Link
                href="/#faq"
                className="text-foreground font-medium underline-offset-4 hover:underline"
              >
                FAQ
              </Link>
              , and current rates are on the{" "}
              <Link
                href="/pricing"
                className="text-foreground font-medium underline-offset-4 hover:underline"
              >
                pricing page
              </Link>
              .
            </p>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
