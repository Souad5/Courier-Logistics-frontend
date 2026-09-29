import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  loading?: boolean;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, hint, loading, className }: StatCardProps) {
  return (
    <Card className={cn("gap-0 py-5", className)}>
      <CardContent className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">{title}</p>
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
          )}
          {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
        </div>
        <div className="bg-primary/10 text-primary rounded-lg p-2.5">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
