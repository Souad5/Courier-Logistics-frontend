import { Package } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact,
  wordmarkClassName,
}: {
  className?: string;
  compact?: boolean;
  /** Extra classes for the name, e.g. to hide it visually on very narrow screens. */
  wordmarkClassName?: string;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 font-semibold", className)}>
      <span className="bg-foreground text-background grid size-8 place-items-center rounded-lg">
        <Package className="size-4" />
      </span>
      {!compact && (
        <span className={cn("text-lg tracking-tight", wordmarkClassName)}>{siteConfig.name}</span>
      )}
    </Link>
  );
}
