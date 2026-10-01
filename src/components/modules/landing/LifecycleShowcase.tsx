"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";

import { StatusBadge } from "@/components/shared/StatusBadge";
import { useI18n } from "@/i18n/client";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

// Text: `landing.lifecycle.stages[status]`; the actor is shown as a translated role.
const STAGES: Array<{ status: keyof Dictionary["landing"]["lifecycle"]["stages"]; actor: Role }> = [
  { status: "PENDING", actor: "CUSTOMER" },
  { status: "ACCEPTED", actor: "ADMIN" },
  { status: "PICKED_UP", actor: "COURIER" },
  { status: "IN_TRANSIT", actor: "COURIER" },
  { status: "OUT_FOR_DELIVERY", actor: "COURIER" },
  { status: "DELIVERED", actor: "COURIER" },
];

/** Interactive walk through the real parcel lifecycle; arrow keys move between stages. */
export function LifecycleShowcase() {
  const { t, f, format } = useI18n();
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const stage = STAGES[index];
  const text = t.landing.lifecycle.stages[stage.status];

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
        aria-label={t.landing.lifecycle.tablistLabel}
        aria-orientation="vertical"
        className="-mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 [mask-image:linear-gradient(to_right,black_85%,transparent)] [scrollbar-width:none] lg:mx-0 lg:snap-none lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 lg:[mask-image:none]"
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
              "flex shrink-0 snap-start items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              i === index
                ? "border-foreground/20 bg-muted text-foreground font-medium"
                : "hover:bg-muted text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full text-sm",
                i < index
                  ? "bg-foreground text-background"
                  : i === index
                    ? "bg-signal text-background"
                    : "bg-muted",
              )}
            >
              {f.number(i + 1)}
            </span>
            <span className="whitespace-nowrap lg:whitespace-normal">
              {t.landing.lifecycle.stages[item.status].title}
            </span>
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
              <span className="text-muted-foreground text-sm">
                {format(t.landing.lifecycle.handledBy, { actor: t.enums.role[stage.actor] })}
              </span>
            </div>
            <p className="eyebrow">
              {format(t.landing.lifecycle.stage, {
                current: f.number(index + 1),
                total: f.number(STAGES.length),
              })}
            </p>
            <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{text.title}</h3>
            <p className="text-muted-foreground max-w-prose text-pretty">{text.text}</p>
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
