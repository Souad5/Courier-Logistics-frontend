import { Package } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 font-semibold", className)}>
      <span className="bg-foreground text-background grid size-8 place-items-center rounded-lg">
        <Package className="size-4" />
      </span>
      {!compact && <span className="text-lg tracking-tight">{siteConfig.name}</span>}
    </Link>
  );
}
