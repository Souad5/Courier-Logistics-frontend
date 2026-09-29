import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FEATURES, PARCEL_TYPE_INFO } from "@/config/content";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <div className="container mx-auto space-y-12 px-4 py-14">
      <PageHeader
        title="Services"
        description="Door-to-door delivery for every kind of shipment, across every zone we serve."
      />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What we carry</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(PARCEL_TYPE_INFO).map(([type, info]) => (
            <Card key={type}>
              <CardHeader>
                <info.icon className="text-primary size-6" />
                <CardTitle>{info.label}</CardTitle>
                <CardDescription>{info.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Included with every delivery</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="flex gap-4">
                <feature.icon className="text-primary size-6 shrink-0" />
                <div>
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
