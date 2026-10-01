"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image, { type StaticImageData } from "next/image";

import heroImage from "@/assets/landing/hero.jpg";

/**
 * Full-bleed hero photo with a one-time slow zoom-out (no loop) and gradients that
 * keep the white headline readable. Static import → automatic blur-up while loading.
 */
export function HeroBackdrop({
  src = heroImage,
  position = "70% 50%",
}: {
  src?: StaticImageData;
  /** CSS object-position, so the subject stays clear of the headline. */
  position?: string;
} = {}) {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-neutral-950">
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { scale: 1.12, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={src}
          alt=""
          fill
          preload
          fetchPriority="high"
          placeholder="blur"
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: position }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
    </div>
  );
}
