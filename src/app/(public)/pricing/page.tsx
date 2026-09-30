import type { Metadata } from "next";

import { PublicPageHeader } from "@/components/shared/SectionHeading";
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
  const weightFee = example.weightKg * PRICING.perKg;
  const exampleTotal =
    PRICING.baseFee + weightFee + example.origin.surcharge + example.destination.surcharge;

  const parts = [
    { label: "Base fee", value: formatCurrency(PRICING.baseFee), note: "Charged on every parcel." },
    {
      label: "Weight",
      value: `${formatCurrency(PRICING.perKg)} / kg`,
      note: "Billed on actual weight.",
    },
    {
      label: "Zones",
      value: "Per hub",
      note: "Added for both the origin and the destination hub.",
    },
  ];

  return (
    <>
      <PublicPageHeader
        eyebrow="Pricing"
        title="Simple, transparent pricing."
        description="Every fee is calculated from three things: a flat base fee, the parcel's weight, and the zones of the pickup and destination hubs."
      >
        <dl className="bg-border grid gap-px overflow-hidden rounded-2xl border md:grid-cols-3">
          {parts.map((part, index) => (
            <div key={part.label} className="bg-background space-y-2 p-6">
              <dt className="eyebrow">
                {index > 0 && <span aria-hidden>+ </span>}
                {part.label}
              </dt>
              <dd className="text-3xl font-semibold tracking-tight tabular-nums">{part.value}</dd>
              <dd className="text-muted-foreground text-sm">{part.note}</dd>
            </div>
          ))}
        </dl>
      </PublicPageHeader>

      <section className="container mx-auto grid gap-12 px-4 py-16 md:py-20 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Zone surcharges</h2>
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground text-xs">Zone</TableHead>
                  <TableHead className="text-muted-foreground text-right text-xs">
                    Surcharge per hub
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PRICING.zones.map((zone) => (
                  <TableRow key={zone.code}>
                    <TableCell>{zone.label}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {formatCurrency(zone.surcharge)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="text-muted-foreground">Any other zone</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatCurrency(PRICING.defaultZoneSurcharge)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Worked example</h2>
          <div className="bg-card rounded-xl border">
            <p className="text-muted-foreground border-b border-dashed px-5 py-4 text-sm">
              A {example.weightKg} kg parcel from an {example.origin.label.toLowerCase()} hub to an{" "}
              {example.destination.label.toLowerCase()} hub.
            </p>
            <div className="space-y-2.5 px-5 py-4 font-mono text-sm">
              <Row label="Base fee" value={PRICING.baseFee} />
              <Row label={`Weight ${example.weightKg} kg × ${PRICING.perKg}`} value={weightFee} />
              <Row label={`Origin · ${example.origin.label}`} value={example.origin.surcharge} />
              <Row
                label={`Destination · ${example.destination.label}`}
                value={example.destination.surcharge}
              />
            </div>
            <div className="flex justify-between border-t border-dashed px-5 py-4 font-mono font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatCurrency(exampleTotal)}</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            The server always calculates the final fee; this page mirrors its rules.
          </p>
        </div>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{formatCurrency(value)}</span>
    </div>
  );
}
