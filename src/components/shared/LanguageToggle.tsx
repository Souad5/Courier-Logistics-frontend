"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { useI18n } from "@/i18n/client";
import { LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

import { AppButton } from "./AppButton";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Switches between English and Bangla. The choice lives in a cookie so the server
 * renders the next request in that language; refresh() re-renders this one.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, t, format } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next: Locale = locale === "en" ? "bn" : "en";
  const nextName = t.common.language.names[next];

  const switchLanguage = () => {
    // biome-ignore lint/suspicious/noDocumentCookie: a plain preference cookie; the server reads it on the next render
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    document.documentElement.lang = next;
    startTransition(() => router.refresh());
  };

  return (
    <AppButton
      variant="ghost"
      className={cn("rounded-full px-2 sm:px-2.5", className)}
      aria-label={format(t.common.language.switchTo, { language: nextName })}
      title={format(t.common.language.switchTo, { language: nextName })}
      disabled={pending}
      onClick={switchLanguage}
    >
      <Languages className={cn("hidden size-4 sm:block", pending && "animate-pulse")} aria-hidden />
      {/* Shows the language currently on screen; the aria-label says what a click does. */}
      <span lang={locale} className="text-sm font-medium">
        {t.common.language.names[locale]}
      </span>
    </AppButton>
  );
}
