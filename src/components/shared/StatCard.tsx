import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  hint?: string;
  loading?: boolean;
  className?: string;
}

/** Typography-led metric tile: the number carries the weight, the icon only labels. */
export function StatCard({ title, value, icon: Icon, hint, loading, className }: StatCardProps) {
  return (
    <Card className={cn("gap-0 py-4", className)}>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs font-medium">{title}</p>
          {Icon && <Icon className="text-muted-foreground size-4" aria-hidden />}
        </div>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        )}
        {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
      </CardContent>
    </Card>
  );
}
