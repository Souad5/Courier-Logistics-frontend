"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";

import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";
import type { ParcelStatus } from "@/types";

const STAGES: Array<{ status: ParcelStatus; actor: string; title: string; text: string }> = [
  {
    status: "PENDING",
    actor: "Customer",
    title: "Book and pay",
    text: "Enter sender, recipient and route, then pay by card. The fee is calculated from weight and delivery zone.",
  },
  {
    status: "ACCEPTED",
    actor: "Admin",
    title: "Assigned to a courier",
    text: "An admin matches your parcel with an available courier. You can see who is responsible for it.",
  },
  {
    status: "PICKED_UP",
    actor: "Courier",
    title: "Picked up",
    text: "The courier collects the parcel and updates its status, so the history starts filling in immediately.",
  },
  {
    status: "IN_TRANSIT",
    actor: "Courier",
    title: "In transit",
    text: "Each status change is recorded with a timestamp and an optional location note.",
  },
  {
    status: "OUT_FOR_DELIVERY",
    actor: "Courier",
    title: "Out for delivery",
    text: "The parcel is on its final leg. If a delivery fails it is retried up to three times before returning to the sender.",
  },
  {
    status: "DELIVERED",
    actor: "Courier",
    title: "Delivered with proof",
    text: "The courier uploads a delivery photo that appears on the public tracking page.",
  },
];

/** Interactive walk through the real parcel lifecycle; arrow keys move between stages. */
export function LifecycleShowcase() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const stage = STAGES[index];

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      setIndex((index + 1) % STAGES.length);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      setIndex((index - 1 + STAGES.length) % STAGES.length);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-8">
      <div
        role="tablist"
        aria-label="Parcel lifecycle stages"
        aria-orientation="vertical"
        className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
        onKeyDown={onKeyDown}
      >
        {STAGES.map((item, i) => (
          <button
            key={item.status}
            type="button"
            role="tab"
            id={`${baseId}-tab-${i}`}
            aria-selected={i === index}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === index ? 0 : -1}
            onClick={() => setIndex(i)}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              i === index
                ? "border-foreground/20 bg-muted text-foreground font-medium"
                : "hover:bg-muted text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full text-xs",
                i < index
                  ? "bg-foreground text-background"
                  : i === index
                    ? "bg-signal text-background"
                    : "bg-muted",
              )}
            >
              {i + 1}
            </span>
            <span className="whitespace-nowrap lg:whitespace-normal">{item.title}</span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${index}`}
        className="bg-card relative min-h-64 overflow-hidden rounded-2xl border p-6 md:p-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.status}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative space-y-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={stage.status} />
              <span className="text-muted-foreground text-xs">Handled by {stage.actor}</span>
            </div>
            <p className="eyebrow">
              Stage {index + 1} of {STAGES.length}
            </p>
            <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{stage.title}</h3>
            <p className="text-muted-foreground max-w-prose text-pretty">{stage.text}</p>
            <div className="bg-muted mt-2 h-1.5 overflow-hidden rounded-full" aria-hidden>
              <motion.div
                className="bg-signal h-full rounded-full"
                animate={{ width: `${((index + 1) / STAGES.length) * 100}%` }}
                transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
