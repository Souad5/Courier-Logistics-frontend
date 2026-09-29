import { Mail } from "lucide-react";
import type { Metadata } from "next";

import { ContactForm } from "@/components/modules/contact/ContactForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="container mx-auto grid max-w-5xl gap-10 px-4 py-14 md:grid-cols-[1fr_1.4fr]">
      <div className="space-y-6">
        <PageHeader
          title="Contact us"
          description="Questions about a delivery, pricing, or becoming a courier? We'd love to hear from you."
        />
        <div className="flex items-center gap-3 text-sm">
          <Mail className="text-primary size-4" />
          {siteConfig.contactEmail}
        </div>
      </div>
      <Card>
        <CardContent>
          <ContactForm />
        </CardContent>
      </Card>
    </div>
  );
}
