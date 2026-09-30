import { TriangleAlert } from "lucide-react";

import { AppButton } from "./AppButton";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="border-destructive/30 bg-destructive/5 flex flex-col items-center gap-3 rounded-lg border px-4 py-8 text-center"
    >
      <TriangleAlert className="text-destructive size-6" aria-hidden />
      <div className="space-y-1">
        <p className="font-medium">Something went wrong</p>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
      {onRetry && (
        <AppButton variant="outline" size="sm" onClick={onRetry}>
          Try again
        </AppButton>
      )}
    </div>
  );
}
