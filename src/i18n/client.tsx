"use client";

import { createContext, type ReactNode, use } from "react";

import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries";
import { createFormatters, interpolate } from "./format";

const I18nContext = createContext<{ locale: Locale; t: Dictionary } | null>(null);

/** Receives the request's locale and dictionary from the root layout (server). */
export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}) {
  return <I18nContext value={{ locale, t: dictionary }}>{children}</I18nContext>;
}

/** `t` is the active dictionary, `f` the locale-bound formatters, `format` fills `{placeholders}`. */
export function useI18n() {
  const context = use(I18nContext);
  if (!context) throw new Error("useI18n must be used inside <I18nProvider>.");
  return { ...context, f: createFormatters(context.locale), format: interpolate };
}
