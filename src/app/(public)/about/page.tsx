import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
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
    text: "Every status change is recorded, so nothing goes missing without a trace.",
  },
  { title: "Transparency", text: "Fees are calculated by clear rules and shown before you pay." },
  {
    title: "Accountability",
    text: "Couriers confirm deliveries with photo proof; every critical action is audited.",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-10 px-4 py-14">
      <PageHeader
        title={`About ${siteConfig.name}`}
        description="We connect customers who need things delivered with couriers who deliver them — with a hub network, clear pricing and end-to-end tracking in between."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {VALUES.map((value) => (
          <Card key={value.title}>
            <CardContent className="space-y-2">
              <h2 className="font-semibold">{value.title}</h2>
              <p className="text-muted-foreground text-sm">{value.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
