import { Calculator, ChevronDown, Package, Scale, Warehouse } from "lucide-react";
import type { Metadata } from "next";

import boxesImg from "@/assets/landing/boxes.jpg";
import { FeeCalculator } from "@/components/modules/landing/FeeCalculator";
import { FadeIn } from "@/components/shared/FadeIn";
import { PhotoCta } from "@/components/shared/PhotoCta";
import { PublicPageHeader, SectionHeading } from "@/components/shared/SectionHeading";
import { estimateFee, FAQS, PRICING } from "@/config/content";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return pageMetadata({
    title: t.publicPages.pricing.meta.title,
    description: t.publicPages.pricing.meta.description,
    path: "/pricing",
  });
}

// Text: `publicPages.pricing.parts[key]`.
const PARTS = [
  { key: "base", icon: Package },
  { key: "weight", icon: Scale },
  { key: "zones", icon: Warehouse },
] as const;

const EXAMPLE = { weightKg: 2.5, origin: PRICING.zones[0], destination: PRICING.zones[4] };
const FROM_ZONE = PRICING.zones[0];
const CHARGE_WEIGHTS = [0.5, 1, 2, 5];
const PRICING_FAQS = FAQS.filter((faq) => faq.pricing);

export default async function PricingPage() {
  const { t, f, format } = await getI18n();
  const p = t.publicPages.pricing;
  const example = estimateFee(EXAMPLE.weightKg, EXAMPLE.origin.code, EXAMPLE.destination.code);
  const zoneName = (zone: { code: string; label: string }) => t.enums.zone[zone.code] ?? zone.label;
  const partValue = {
    base: f.currency(PRICING.baseFee),
    weight: format(p.parts.weight.value, { amount: f.currency(PRICING.perKg) }),
    zones: p.parts.zones.value,
  };
  const faqVars = {
    currency: PRICING.currency,
    baseFee: f.number(PRICING.baseFee),
    perKg: f.number(PRICING.perKg),
  };

  return (
    <>
      <PublicPageHeader
        image={boxesImg}
        imagePosition="50% 60%"
        eyebrow={p.header.eyebrow}
        title={p.header.title}
        description={p.header.description}
      />

      {/* Formula cards overlapping the header */}
      <div className="relative z-10 container mx-auto -mt-16 px-4">
        <div className="grid gap-4 md:grid-cols-3">
          {PARTS.map((part, index) => (
            <FadeIn key={part.key} delay={0.2 + index * 0.08}>
              <div className="bg-card h-full space-y-3 rounded-2xl p-6 shadow-xl shadow-black/10">
                <div className="flex items-center justify-between">
                  <p className="eyebrow">
                    {index > 0 && <span aria-hidden>+ </span>}
                    {p.parts[part.key].label}
                  </p>
                  <part.icon className="text-muted-foreground size-5" aria-hidden />
                </div>
                <p className="text-3xl font-semibold tracking-tight tabular-nums">
                  {partValue[part.key]}
                </p>
                <p className="text-muted-foreground text-sm">{p.parts[part.key].note}</p>
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
                <h2 className="text-2xl font-semibold tracking-tight">{p.calculator.title}</h2>
                <p className="text-muted-foreground text-sm">{p.calculator.description}</p>
              </div>
            </div>
            <FeeCalculator />
          </div>
        </FadeIn>
      </section>

      {/* Charges table + worked example */}
      <section className="bg-muted/40 border-y">
        <div className="container mx-auto grid gap-12 px-4 py-20 md:py-24 lg:grid-cols-[1.3fr_0.7fr]">
          {/* min-w-0: let the table scroll inside its card instead of widening the grid column. */}
          <FadeIn className="min-w-0 space-y-5">
            <SectionHeading
              eyebrow={p.table.eyebrow}
              title={p.table.title}
              description={format(p.table.description, { zone: zoneName(FROM_ZONE).toLowerCase() })}
            />
            <div className="bg-card overflow-x-auto rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left font-medium">
                      {p.table.deliveryZone}
                    </th>
                    {CHARGE_WEIGHTS.map((w) => (
                      <th key={w} scope="col" className="px-4 py-3 text-right font-medium">
                        {format(p.table.weight, { kg: f.number(w) })}
                      </th>
                    ))}
                    <th scope="col" className="px-4 py-3 text-right font-medium">
                      {p.table.zoneSurcharge}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {PRICING.zones.map((zone) => (
                    <tr key={zone.code} className="hover:bg-muted/40 transition-colors">
                      <th scope="row" className="px-4 py-3 text-left font-normal">
                        {zoneName(zone)}
                      </th>
                      {CHARGE_WEIGHTS.map((w) => (
                        <td key={w} className="px-4 py-3 text-right tabular-nums">
                          {f.currency(estimateFee(w, FROM_ZONE.code, zone.code).total)}
                        </td>
                      ))}
                      <td className="text-muted-foreground px-4 py-3 text-right tabular-nums">
                        {zone.surcharge === 0 ? "—" : `+${f.currency(zone.surcharge)}`}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th
                      scope="row"
                      className="text-muted-foreground px-4 py-3 text-left font-normal"
                    >
                      {p.table.otherZone}
                    </th>
                    <td colSpan={CHARGE_WEIGHTS.length} />
                    <td className="text-muted-foreground px-4 py-3 text-right tabular-nums">
                      +{f.currency(PRICING.defaultZoneSurcharge)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="min-w-0 space-y-5">
            <h2 className="text-xl font-semibold tracking-tight">{p.example.title}</h2>
            <div className="bg-card overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10">
              <p className="text-muted-foreground border-b border-dashed px-5 py-4 text-sm">
                {format(p.example.description, {
                  kg: f.number(EXAMPLE.weightKg),
                  from: zoneName(EXAMPLE.origin).toLowerCase(),
                  to: zoneName(EXAMPLE.destination).toLowerCase(),
                })}
              </p>
              <div className="space-y-2.5 px-5 py-4 font-mono text-sm">
                <Row label={p.example.baseFee} value={f.currency(example.baseFee)} />
                <Row
                  label={format(p.example.weight, {
                    kg: f.number(EXAMPLE.weightKg),
                    rate: f.number(PRICING.perKg),
                  })}
                  value={f.currency(example.weightFee)}
                />
                <Row
                  label={format(p.example.origin, { zone: zoneName(EXAMPLE.origin) })}
                  value={f.currency(EXAMPLE.origin.surcharge)}
                />
                <Row
                  label={format(p.example.destination, { zone: zoneName(EXAMPLE.destination) })}
                  value={f.currency(EXAMPLE.destination.surcharge)}
                />
              </div>
              <div className="bg-muted/40 flex justify-between border-t border-dashed px-5 py-4 font-mono font-semibold">
                <span>{p.example.total}</span>
                <span className="tabular-nums">{f.currency(example.total)}</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">{p.example.note}</p>
          </FadeIn>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="container mx-auto grid gap-12 px-4 py-20 md:py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <FadeIn>
          <SectionHeading eyebrow={p.faq.eyebrow} title={p.faq.title} />
        </FadeIn>
        <div className="divide-y border-y">
          {PRICING_FAQS.map(({ key }) => {
            const item = t.landing.content.faqs[key];
            return (
              <details key={key} className="group py-5">
                <summary className="focus-visible:ring-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded font-medium focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown
                    className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="text-muted-foreground mt-3 max-w-prose text-sm text-pretty">
                  {format(item.a, faqVars)}
                </p>
              </details>
            );
          })}
        </div>
      </section>

      <PhotoCta
        title={p.cta.title}
        description={p.cta.description}
        primary={{ label: p.cta.primary, href: "/register" }}
        secondary={{ label: p.cta.secondary, href: "/services" }}
      />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
