"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { AppButton } from "@/components/shared/AppButton";
import { useI18n } from "@/i18n/client";

// Next 16 passes `retry` (formerly `reset`) to error boundaries.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const { t, format } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <div className="bg-destructive/10 text-destructive rounded-full p-4">
        <AlertTriangle className="size-8" />
      </div>
      <h1 className="text-2xl font-semibold">{t.errors.boundary.title}</h1>
      <p className="text-muted-foreground max-w-md text-sm">{t.errors.boundary.description}</p>
      {error.digest && (
        <p className="text-muted-foreground font-mono text-xs">
          {format(t.errors.boundary.reference, { digest: error.digest })}
        </p>
      )}
      <div className="flex gap-2">
        <AppButton leftIcon={<RotateCcw />} onClick={() => retry()}>
          {t.common.actions.tryAgain}
        </AppButton>
        <AppButton asChild variant="outline">
          <Link href="/">{t.common.actions.goHome}</Link>
        </AppButton>
      </div>
    </div>
  );
}
