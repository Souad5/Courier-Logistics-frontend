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

/** Counts from 0 to `value` once it scrolls into view; shows the final number under reduced motion. */
export function CountUp({ value, duration = 1.2 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(reduceMotion ? value : 0);
  const text = useTransform(count, (v) => Math.round(v).toLocaleString("en"));

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
