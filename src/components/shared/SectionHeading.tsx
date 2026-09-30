import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

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

/** Top band for public content pages (About, Services, Pricing, Contact). */
export function PublicPageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="border-b">
      <div className="container mx-auto space-y-8 px-4 py-14 md:py-20">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} />
        {children}
      </div>
    </section>
  );
}
