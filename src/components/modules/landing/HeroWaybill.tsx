"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Truck } from "lucide-react";

import { StatusBadge } from "@/components/shared/StatusBadge";
import { PRICING } from "@/config/content";
import { cn, formatCurrency } from "@/lib/utils";

// Illustrative example, priced with the real fee rules so the numbers stay honest.
const ORIGIN = PRICING.zones[0];
const DESTINATION = PRICING.zones[4];
const WEIGHT_KG = 2.5;
const FEE = PRICING.baseFee + WEIGHT_KG * PRICING.perKg + ORIGIN.surcharge + DESTINATION.surcharge;
const PROGRESS = 0.62;

const EVENTS = [
  { label: "Paid by card", time: "09:12", done: true },
  { label: "Picked up by courier", time: "11:40", done: true },
  { label: "In transit between hubs", time: "14:05", done: false },
];

export function HeroWaybill() {
  const reduceMotion = useReducedMotion();
  // Always pass `animate`: the server renders the initial (hidden) state before the
  // reduced-motion preference is known, so the element must still animate to visible.
  const enter = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion
      ? { duration: 0 }
      : { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay },
  });

  return (
    <figure className="relative mx-auto w-full max-w-md">
      {/* Two offset sheets read as a stack of waybills. */}
      <div
        aria-hidden
        className="bg-card absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border"
      />
      <div
        aria-hidden
        className="bg-card absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-2xl border"
      />

      <motion.div
        {...enter(0.1)}
        className="bg-card relative rounded-2xl border shadow-[0_24px_48px_-24px_rgb(0_0_0/0.25)]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-dashed px-5 py-4">
          <div className="space-y-1">
            <p className="eyebrow">Waybill · example</p>
            <p className="font-mono text-lg font-semibold tracking-tight">SP-2F9K4L7Q</p>
          </div>
          <StatusBadge status="IN_TRANSIT" />
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="flex items-end justify-between gap-4 text-sm">
            <div>
              <p className="eyebrow">From</p>
              <p className="font-medium">{ORIGIN.label} hub</p>
            </div>
            <div className="text-right">
              <p className="eyebrow">To</p>
              <p className="font-medium">{DESTINATION.label} hub</p>
            </div>
          </div>

          <div className="relative h-6" aria-hidden>
            <div className="border-border absolute inset-x-1.5 top-1/2 border-t-2 border-dashed" />
            <motion.div
              className="bg-signal absolute top-1/2 left-1.5 h-0.5 -translate-y-1/2 rounded-full"
              initial={reduceMotion ? false : { width: 0 }}
              animate={{ width: `calc(${PROGRESS * 100}% - 0.75rem)` }}
              transition={{ duration: 1.1, ease: "easeInOut", delay: 0.5 }}
            />
            <span className="bg-foreground absolute top-1/2 left-0 size-3 -translate-y-1/2 rounded-full" />
            <span className="border-foreground bg-card absolute top-1/2 right-0 size-3 -translate-y-1/2 rounded-full border-2" />
            <motion.span
              className="bg-card absolute top-1/2 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border shadow-sm"
              initial={reduceMotion ? false : { left: "0%" }}
              animate={{ left: `${PROGRESS * 100}%` }}
              transition={{ duration: 1.1, ease: "easeInOut", delay: 0.5 }}
            >
              <Truck className="size-3.5" />
            </motion.span>
          </div>

          <dl className="grid grid-cols-3 gap-3 border-y py-3 text-sm">
            <div>
              <dt className="eyebrow">Weight</dt>
              <dd className="tabular-nums">{WEIGHT_KG} kg</dd>
            </div>
            <div>
              <dt className="eyebrow">Type</dt>
              <dd>Parcel</dd>
            </div>
            <div className="text-right">
              <dt className="eyebrow">Fee</dt>
              <dd className="font-medium tabular-nums">{formatCurrency(FEE, PRICING.currency)}</dd>
            </div>
          </dl>

          <ol className="space-y-2.5">
            {EVENTS.map((event, index) => (
              <motion.li
                key={event.label}
                {...enter(0.7 + index * 0.12)}
                className="flex items-center gap-3 text-sm"
              >
                <span
                  aria-hidden
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-full border",
                    event.done
                      ? "bg-foreground text-background border-foreground"
                      : "border-signal",
                  )}
                >
                  {event.done ? (
                    <Check className="size-3" />
                  ) : (
                    <span className="bg-signal size-1.5 rounded-full" />
                  )}
                </span>
                <span className={cn("flex-1", !event.done && "font-medium")}>{event.label}</span>
                <span className="text-muted-foreground font-mono text-xs">{event.time}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </motion.div>
      <figcaption className="sr-only">
        Example waybill for a {WEIGHT_KG} kg parcel from the {ORIGIN.label} zone to the{" "}
        {DESTINATION.label} zone, currently in transit.
      </figcaption>
    </figure>
  );
}
