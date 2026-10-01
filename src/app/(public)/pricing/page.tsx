import { Calculator, ChevronDown, Package, Scale, Warehouse } from "lucide-react";
import type { Metadata } from "next";

import boxesImg from "@/assets/landing/boxes.jpg";
import { FeeCalculator } from "@/components/modules/landing/FeeCalculator";
import { FadeIn } from "@/components/shared/FadeIn";
import { PhotoCta } from "@/components/shared/PhotoCta";
import { PublicPageHeader, SectionHeading } from "@/components/shared/SectionHeading";
import { estimateFee, FAQS, PRICING } from "@/config/content";
import { pageMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Transparent courier pricing: a flat base fee, a per-kg weight rate and zone surcharges. See exactly what your parcel costs before you pay.",
  path: "/pricing",
});

const PARTS = [
  {
    icon: Package,
    label: "Base fee",
    value: formatCurrency(PRICING.baseFee),
    note: "Charged once on every parcel.",
  },
  {
    icon: Scale,
    label: "Weight",
    value: `${formatCurrency(PRICING.perKg)} / kg`,
    note: "Billed on the actual weight you enter.",
  },
  {
    icon: Warehouse,
    label: "Zones",
    value: "Per hub",
    note: "Added for both the pickup and the delivery hub.",
  },
];

const EXAMPLE = { weightKg: 2.5, origin: PRICING.zones[0], destination: PRICING.zones[4] };
const FROM_ZONE = PRICING.zones[0];
const CHARGE_WEIGHTS = [0.5, 1, 2, 5];
const PRICING_FAQS = FAQS.filter((f) => /fee|pay/i.test(f.q));

export default function PricingPage() {
  const example = estimateFee(EXAMPLE.weightKg, EXAMPLE.origin.code, EXAMPLE.destination.code);

  return (
    <>
      <PublicPageHeader
        image={boxesImg}
        imagePosition="50% 60%"
        eyebrow="Pricing"
        title="Simple, transparent pricing."
        description="Every fee comes from three things: a flat base fee, the parcel's weight, and the zones of the pickup and delivery hubs. You see the total before you pay."
      />

      {/* Formula cards overlapping the header */}
      <div className="relative z-10 container mx-auto -mt-16 px-4">
        <div className="grid gap-4 md:grid-cols-3">
          {PARTS.map((part, index) => (
            <FadeIn key={part.label} delay={0.2 + index * 0.08}>
              <div className="bg-card h-full space-y-3 rounded-2xl p-6 shadow-xl shadow-black/10">
                <div className="flex items-center justify-between">
                  <p className="eyebrow">
                    {index > 0 && <span aria-hidden>+ </span>}
                    {part.label}
                  </p>
                  <part.icon className="text-muted-foreground size-5" aria-hidden />
                </div>
                <p className="text-3xl font-semibold tracking-tight tabular-nums">{part.value}</p>
                <p className="text-muted-foreground text-sm">{part.note}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Calculator */}
      <section className="container mx-auto px-4 py-20 md:py-24">
        <FadeIn>
          <div className="bg-card rounded-3xl p-6 shadow-sm ring-1 ring-black/5 md:p-10 dark:ring-white/10">
            <div className="mb-8 flex items-start gap-4">
              <span className="bg-muted grid size-12 shrink-0 place-items-center rounded-2xl">
                <Calculator className="size-5" aria-hidden />
              </span>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">Delivery calculator</h2>
                <p className="text-muted-foreground text-sm">
                  Pick real hubs from our network and a weight — this is the fee you&apos;ll be
                  charged.
                </p>
              </div>
            </div>
            <FeeCalculator />
          </div>
        </FadeIn>
      </section>

      {/* Charges table + worked example */}
      <section className="bg-muted/40 border-y">
        <div className="container mx-auto grid gap-12 px-4 py-20 md:py-24 lg:grid-cols-[1.3fr_0.7fr]">
          <FadeIn className="space-y-5">
            <SectionHeading
              eyebrow="Delivery charges"
              title="Common prices at a glance."
              description={`Sending from an ${FROM_ZONE.label.toLowerCase()} hub. Surcharges for each zone are shown in the last column.`}
            />
            <div className="bg-card overflow-x-auto rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left font-medium">
                      Delivery zone
                    </th>
                    {CHARGE_WEIGHTS.map((w) => (
                      <th key={w} scope="col" className="px-4 py-3 text-right font-medium">
                        {w} kg
                      </th>
                    ))}
                    <th scope="col" className="px-4 py-3 text-right font-medium">
                      Zone surcharge
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {PRICING.zones.map((zone) => (
                    <tr key={zone.code} className="hover:bg-muted/40 transition-colors">
                      <th scope="row" className="px-4 py-3 text-left font-normal">
                        {zone.label}
                      </th>
                      {CHARGE_WEIGHTS.map((w) => (
                        <td key={w} className="px-4 py-3 text-right tabular-nums">
                          {formatCurrency(estimateFee(w, FROM_ZONE.code, zone.code).total)}
                        </td>
                      ))}
                      <td className="text-muted-foreground px-4 py-3 text-right tabular-nums">
                        {zone.surcharge === 0 ? "—" : `+${formatCurrency(zone.surcharge)}`}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th
                      scope="row"
                      className="text-muted-foreground px-4 py-3 text-left font-normal"
                    >
                      Any other zone
                    </th>
                    <td colSpan={CHARGE_WEIGHTS.length} />
                    <td className="text-muted-foreground px-4 py-3 text-right tabular-nums">
                      +{formatCurrency(PRICING.defaultZoneSurcharge)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="space-y-5">
            <h2 className="text-xl font-semibold tracking-tight">Worked example</h2>
            <div className="bg-card overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10">
              <p className="text-muted-foreground border-b border-dashed px-5 py-4 text-sm">
                A {EXAMPLE.weightKg} kg parcel from an {EXAMPLE.origin.label.toLowerCase()} hub to
                an {EXAMPLE.destination.label.toLowerCase()} hub.
              </p>
              <div className="space-y-2.5 px-5 py-4 font-mono text-sm">
                <Row label="Base fee" value={example.baseFee} />
                <Row
                  label={`Weight ${EXAMPLE.weightKg} kg × ${PRICING.perKg}`}
                  value={example.weightFee}
                />
                <Row label={`Origin · ${EXAMPLE.origin.label}`} value={EXAMPLE.origin.surcharge} />
                <Row
                  label={`Destination · ${EXAMPLE.destination.label}`}
                  value={EXAMPLE.destination.surcharge}
                />
              </div>
              <div className="bg-muted/40 flex justify-between border-t border-dashed px-5 py-4 font-mono font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(example.total)}</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              The server always calculates the final fee with the same rule — this page mirrors it.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="container mx-auto grid gap-12 px-4 py-20 md:py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <FadeIn>
          <SectionHeading eyebrow="FAQ" title="Pricing questions." />
        </FadeIn>
        <div className="divide-y border-y">
          {PRICING_FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="focus-visible:ring-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded font-medium focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown
                  className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="text-muted-foreground mt-3 max-w-prose text-sm text-pretty">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <PhotoCta
        title="Know the price? Book it now."
        description="Create a free account and the fee you just saw is the fee you pay."
        primary={{ label: "Send a parcel", href: "/register" }}
        secondary={{ label: "Explore services", href: "/services" }}
      />
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
