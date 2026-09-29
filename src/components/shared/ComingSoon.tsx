import { Construction } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

/** Placeholder body for scaffolded dashboard pages that aren't built yet. */
export function ComingSoon({ endpoint, note }: { endpoint?: string; note?: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <Construction className="text-muted-foreground size-8" />
        <p className="font-medium">This section is scaffolded and ready to build.</p>
        {endpoint && (
          <p className="text-muted-foreground text-sm">
            Backed by <code className="bg-muted rounded px-1.5 py-0.5 text-xs">{endpoint}</code>
          </p>
        )}
        {note && <p className="text-muted-foreground max-w-md text-sm">{note}</p>}
      </CardContent>
    </Card>
  );
}
