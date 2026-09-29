"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { AppButton } from "@/components/shared/AppButton";

// Next 16 passes `retry` (formerly `reset`) to error boundaries.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <div className="bg-destructive/10 text-destructive rounded-full p-4">
        <AlertTriangle className="size-8" />
      </div>
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        An unexpected error occurred. You can try again, or head back to the home page.
      </p>
      {error.digest && (
        <p className="text-muted-foreground font-mono text-xs">Ref: {error.digest}</p>
      )}
      <div className="flex gap-2">
        <AppButton leftIcon={<RotateCcw />} onClick={() => retry()}>
          Try again
        </AppButton>
        <AppButton asChild variant="outline">
          <Link href="/">Go home</Link>
        </AppButton>
      </div>
    </div>
  );
}
