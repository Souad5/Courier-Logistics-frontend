import { cookies } from "next/headers";
import { cache } from "react";

import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import { dictionaries } from "./dictionaries";
import { createFormatters, interpolate } from "./format";

/** The visitor's language from the `lang` cookie. Reading it makes the route dynamic. */
export const getLocale = cache(async (): Promise<Locale> => {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
});

/** Server-component counterpart of useI18n(). */
export const getI18n = cache(async () => {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale], f: createFormatters(locale), format: interpolate };
});
