"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Calculator, PackageSearch } from "lucide-react";
import { useId, useState } from "react";

import { TrackParcelForm } from "@/components/modules/parcels/TrackParcelForm";
import { cn } from "@/lib/utils";

import { FeeCalculator } from "./FeeCalculator";

const TABS = [
  { key: "track", label: "Track parcel", icon: PackageSearch },
  { key: "calculate", label: "Delivery calculator", icon: Calculator },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/** The card that overlaps the bottom of the hero: tracking first, fee estimate one tab away. */
export function HeroToolsCard() {
  const [tab, setTab] = useState<TabKey>("track");
  const uid = useId();
  const reduceMotion = useReducedMotion();

  return (
    <div
      id="track"
      className="bg-card scroll-mt-28 rounded-2xl p-2 shadow-2xl shadow-black/15 sm:p-3"
    >
      <div
        role="tablist"
        aria-label="Parcel tools"
        className="bg-muted/70 flex gap-1 rounded-xl p-1 sm:w-fit"
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`${uid}-${t.key}-tab`}
            aria-selected={tab === t.key}
            aria-controls={`${uid}-${t.key}-panel`}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 sm:flex-none sm:px-5",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              tab === t.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <t.icon className="size-4" aria-hidden />
            {t.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${uid}-${tab}-panel`}
        aria-labelledby={`${uid}-${tab}-tab`}
        className="px-2 pt-5 pb-3 sm:px-4 sm:pt-6 sm:pb-4"
      >
        <motion.div
          key={tab}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {tab === "track" ? (
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-muted-foreground text-sm">
                Enter the tracking number from your booking — no account needed.
              </p>
              <TrackParcelForm />
            </div>
          ) : (
            <FeeCalculator />
          )}
        </motion.div>
      </div>
    </div>
  );
}
