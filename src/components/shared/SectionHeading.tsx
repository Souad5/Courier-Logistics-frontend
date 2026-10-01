import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { FadeIn } from "./FadeIn";
import { HeroBackdrop } from "./HeroBackdrop";

/** Eyebrow + heading + lede. Marketing sections use h2; public page headers use h1. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  as?: "h1" | "h2";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn("max-w-2xl space-y-3", align === "center" && "mx-auto text-center", className)}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Heading
        className={cn(
          "font-semibold tracking-tight text-balance",
          Heading === "h1" ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p className="text-muted-foreground text-base text-pretty md:text-lg">{description}</p>
      )}
    </div>
  );
}

/**
 * Top band for public content pages (About, Services, Pricing, Contact). With `image`
 * it becomes a full-bleed photo header (dark gradient, white text, one-time zoom-out).
 */
export function PublicPageHeader({
  eyebrow,
  title,
  description,
  children,
  image,
  imagePosition,
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
  image?: StaticImageData;
  imagePosition?: string;
}) {
  if (!image) {
    return (
      <section className="border-b">
        <div className="container mx-auto space-y-8 px-4 pt-32 pb-14 md:pt-36 md:pb-20">
          <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} />
          {children}
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden text-white">
      <HeroBackdrop src={image} position={imagePosition} />
      <div className="container mx-auto space-y-10 px-4 pt-36 pb-24 md:pt-44 md:pb-32">
        <div className="max-w-2xl space-y-4">
          <FadeIn>
            <p className="flex items-center gap-2 font-mono text-sm tracking-widest text-white/80 uppercase">
              <span aria-hidden className="size-1.5 rounded-full bg-emerald-400" />
              {eyebrow}
            </p>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h1 className="text-4xl leading-[1.08] font-semibold tracking-tight text-balance md:text-6xl">
              {title}
            </h1>
          </FadeIn>
          <FadeIn delay={0.14}>
            <p className="text-lg text-pretty text-white/80">{description}</p>
          </FadeIn>
        </div>
        {children && <FadeIn delay={0.22}>{children}</FadeIn>}
      </div>
    </section>
  );
}
