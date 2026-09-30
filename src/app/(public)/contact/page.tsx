import { Mail, PackageSearch } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/modules/contact/ContactForm";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Questions about a delivery, pricing or becoming a courier? Get in touch with our support team.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container mx-auto grid gap-12 px-4 py-14 md:py-20 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-10">
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Talk to a person."
          description="Questions about a delivery, pricing, or becoming a courier? Send us a message."
        />
        <dl className="divide-y border-y text-sm">
          <div className="flex items-start gap-4 py-5">
            <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div className="space-y-1">
              <dt className="font-medium">Email</dt>
              <dd>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-muted-foreground hover:text-foreground font-mono"
                >
                  {siteConfig.contactEmail}
                </a>
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-4 py-5">
            <PackageSearch className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div className="space-y-1">
              <dt className="font-medium">About a delivery?</dt>
              <dd className="text-muted-foreground">
                Include your tracking number. You can also check its status on the{" "}
                <Link href="/" className="text-foreground underline underline-offset-4">
                  tracking page
                </Link>
                .
              </dd>
            </div>
          </div>
        </dl>
      </div>
      <div className="bg-card rounded-2xl border p-6 md:p-8">
        <ContactForm />
      </div>
    </div>
  );
}
