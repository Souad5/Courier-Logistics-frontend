"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

import { useI18n } from "@/i18n/client";

/** Counts from 0 to `value` once it scrolls into view; shows the final number under reduced motion. */
export function CountUp({ value, duration = 1.2 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  // Always 0 initially: the server can't know the motion preference, so seeding from it
  // renders different text on the client and breaks hydration.
  const count = useMotionValue(0);
  const { f } = useI18n();
  const text = useTransform(count, (v) => f.number(Math.round(v)));

  useEffect(() => {
    if (reduceMotion) {
      count.set(value);
      return;
    }
    if (!inView) return;
    const controls = animate(count, value, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [count, duration, inView, reduceMotion, value]);

  return (
    <motion.span ref={ref} className="tabular-nums">
      {text}
    </motion.span>
  );
}
