import type { Metadata } from "next";

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
    title: "Reliability",
    text: "Every status change is recorded with a timestamp, so nothing goes missing without a trace.",
  },
  {
    title: "Transparency",
    text: "Fees follow one published formula and are shown before you pay.",
  },
  {
    title: "Accountability",
    text: "Couriers confirm deliveries with a photo, and every critical action is written to an audit log.",
  },
];

const MODEL = [
  { term: "Hubs", text: "Parcels move between hubs. Each hub belongs to a delivery zone." },
  { term: "Zones", text: "A zone sets the surcharge for pickups and deliveries at its hubs." },
  { term: "Roles", text: "Customers, couriers and admins each get their own workspace." },
];

export default function AboutPage() {
  return (
    <>
      <PublicPageHeader
        eyebrow={`About ${siteConfig.name}`}
        title="We connect people who need things delivered with the couriers who deliver them."
        description="A hub network, clear pricing and end-to-end tracking sit in between — so everyone involved can see where a parcel is and who is responsible for it."
      />

      <section className="container mx-auto grid gap-10 px-4 py-16 md:py-20 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading eyebrow="What we value" title="Three promises we build around." />
        <ol className="divide-y border-y">
          {VALUES.map((value, index) => (
            <li key={value.title} className="grid gap-2 py-6 sm:grid-cols-[4rem_1fr]">
              <span className="text-muted-foreground font-mono text-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="space-y-1">
                <h3 className="font-semibold">{value.title}</h3>
                <p className="text-muted-foreground text-sm text-pretty">{value.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-muted/40 border-t">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <SectionHeading eyebrow="How it's organised" title="Hubs, zones and roles." />
          <dl className="mt-10 grid gap-8 md:grid-cols-3">
            {MODEL.map((item) => (
              <div key={item.term} className="space-y-2 border-t pt-5">
                <dt className="font-semibold">{item.term}</dt>
                <dd className="text-muted-foreground text-sm text-pretty">{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
