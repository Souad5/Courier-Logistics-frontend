import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PRICING } from "@/config/content";
import { pageMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Transparent courier pricing: a flat base fee, a per-kg weight rate and zone surcharges. See exactly what your parcel costs before you pay.",
  path: "/pricing",
});

export default function PricingPage() {
  const example = { weightKg: 2.5, origin: PRICING.zones[0], destination: PRICING.zones[4] };
  const exampleTotal =
    PRICING.baseFee +
    example.weightKg * PRICING.perKg +
    example.origin.surcharge +
    example.destination.surcharge;

  return (
    <div className="container mx-auto space-y-10 px-4 py-14">
      <PageHeader
        title="Simple, transparent pricing"
        description="Every fee is calculated from three things: a flat base fee, the parcel's weight, and the zones of the pickup and destination hubs."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Base fee</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(PRICING.baseFee)}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Charged on every parcel.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Weight</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(PRICING.perKg)} / kg</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Billed on actual weight.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Zone surcharge</CardDescription>
            <CardTitle className="text-3xl">Per hub</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Added for both the origin and the destination hub.
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zone</TableHead>
                <TableHead className="text-right">Surcharge per hub</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PRICING.zones.map((zone) => (
                <TableRow key={zone.code}>
                  <TableCell>{zone.label}</TableCell>
                  <TableCell className="text-right">{formatCurrency(zone.surcharge)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="text-muted-foreground">Any other zone</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(PRICING.defaultZoneSurcharge)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Example</CardTitle>
            <CardDescription>
              A {example.weightKg} kg parcel from an {example.origin.label.toLowerCase()} hub to an{" "}
              {example.destination.label.toLowerCase()} hub.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Base fee" value={PRICING.baseFee} />
            <Row
              label={`Weight (${example.weightKg} kg × ${PRICING.perKg})`}
              value={example.weightKg * PRICING.perKg}
            />
            <Row label={`Origin zone (${example.origin.label})`} value={example.origin.surcharge} />
            <Row
              label={`Destination zone (${example.destination.label})`}
              value={example.destination.surcharge}
            />
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span>{formatCurrency(exampleTotal)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{formatCurrency(value)}</span>
    </div>
  );
}
