export const LOCALES = ["en", "bn"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
/** Read on the server (root layout) and written by LanguageToggle. */
export const LOCALE_COOKIE = "lang";

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (LOCALES as readonly string[]).includes(value);
