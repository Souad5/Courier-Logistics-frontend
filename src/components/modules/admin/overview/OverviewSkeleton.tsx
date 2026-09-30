import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TOTAL_KEYS = ["t1", "t2", "t3", "t4", "t5", "t6"];
const PANEL_KEYS = ["p1", "p2", "p3"];

export function OverviewSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-live="polite">
      <span className="sr-only">Loading dashboard</span>
      <Card className="gap-0 py-0">
        <CardHeader className="flex items-center justify-between border-b py-5">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-40" />
        </CardHeader>
        <div className="grid grid-cols-2 border-b">
          {["a", "b"].map((key) => (
            <div key={key} className="space-y-2 border-r px-6 py-4 last:border-r-0">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          ))}
        </div>
        <CardContent className="py-6">
          <Skeleton className="h-[280px] w-full" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {TOTAL_KEYS.map((key) => (
          <Skeleton key={key} className="h-20 w-full" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {PANEL_KEYS.map((key) => (
          <Card key={key}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-56 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
