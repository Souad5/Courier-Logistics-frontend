"use client";

import { TriangleAlert } from "lucide-react";

import { useI18n } from "@/i18n/client";

import { AppButton } from "./AppButton";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { t } = useI18n();
  return (
    <div
      role="alert"
      className="border-destructive/30 bg-destructive/5 flex flex-col items-center gap-3 rounded-lg border px-4 py-8 text-center"
    >
      <TriangleAlert className="text-destructive size-6" aria-hidden />
      <div className="space-y-1">
        <p className="font-medium">{t.common.states.somethingWentWrong}</p>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
      {onRetry && (
        <AppButton variant="outline" size="sm" onClick={onRetry}>
          {t.common.actions.tryAgain}
        </AppButton>
      )}
    </div>
  );
}
