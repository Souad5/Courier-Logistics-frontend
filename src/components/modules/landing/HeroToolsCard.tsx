"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Calculator, PackageSearch } from "lucide-react";
import { useId, useState } from "react";

import { TrackParcelForm } from "@/components/modules/parcels/TrackParcelForm";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/utils";

import { FeeCalculator } from "./FeeCalculator";

const TABS = [
  { key: "track", label: "track", short: "trackShort", icon: PackageSearch },
  { key: "calculate", label: "calculate", short: "calculateShort", icon: Calculator },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/** The card that overlaps the bottom of the hero: tracking first, fee estimate one tab away. */
export function HeroToolsCard() {
  const { t } = useI18n();
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
        aria-label={t.landing.tools.label}
        className="bg-muted/70 flex gap-1 rounded-xl p-1 sm:w-fit"
      >
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            id={`${uid}-${item.key}-tab`}
            aria-selected={tab === item.key}
            aria-controls={`${uid}-${item.key}-panel`}
            onClick={() => setTab(item.key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 sm:flex-none sm:px-5",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              tab === item.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" aria-hidden />
            <span className="sm:hidden">{t.landing.tools[item.short]}</span>
            <span className="hidden sm:inline">{t.landing.tools[item.label]}</span>
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
              <p className="text-muted-foreground text-sm">{t.landing.tools.trackHint}</p>
              <TrackParcelForm className="lg:max-w-lg" />
            </div>
          ) : (
            <FeeCalculator />
          )}
        </motion.div>
      </div>
    </div>
  );
}
