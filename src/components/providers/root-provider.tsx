"use client";

import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./query-provider";
import { StoreHydrator } from "./store-hydrator";
import { ThemeProvider } from "./theme-provider";

export function RootProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}) {
  return (
    <I18nProvider locale={locale} dictionary={dictionary}>
      <ThemeProvider>
        <QueryProvider>
          <StoreHydrator />
          <AuthProvider>{children}</AuthProvider>
          <Toaster richColors closeButton position="top-right" />
        </QueryProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
