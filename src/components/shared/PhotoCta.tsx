import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import warehouseImg from "@/assets/landing/warehouse.jpg";

import { AppButton } from "./AppButton";
import { FadeIn } from "./FadeIn";

/** Closing call-to-action band over a darkened photo. */
export function PhotoCta({
  title,
  description,
  primary,
  secondary,
  image = warehouseImg,
}: {
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  image?: StaticImageData;
}) {
  return (
    <section className="container mx-auto px-4 pb-20 md:pb-28">
      <FadeIn>
        <div className="relative isolate flex flex-col gap-8 overflow-hidden rounded-3xl px-6 py-14 text-white md:flex-row md:items-end md:justify-between md:px-12 md:py-20">
          <Image
            src={image}
            alt=""
            fill
            placeholder="blur"
            sizes="100vw"
            className="-z-10 object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/70 to-black/40"
          />
          <div className="max-w-xl space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              {title}
            </h2>
            <p className="text-pretty text-white/75">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <AppButton asChild size="lg" className="h-11 border-transparent px-5">
              <Link href={primary.href}>{primary.label}</Link>
            </AppButton>
            {secondary && (
              <Link
                href={secondary.href}
                className="rounded px-2 py-2 text-sm font-medium text-white/85 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
