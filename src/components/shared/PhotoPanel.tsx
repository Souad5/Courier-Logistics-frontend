import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Rounded photo with a slow zoom on hover; optional caption over a bottom gradient. */
export function PhotoPanel({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  caption,
}: {
  src: StaticImageData;
  alt: string;
  className?: string;
  sizes?: string;
  caption?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5 dark:ring-white/10",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        placeholder="blur"
        sizes={sizes}
        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
      />
      {caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-16 text-white">
          {caption}
        </div>
      )}
    </div>
  );
}
