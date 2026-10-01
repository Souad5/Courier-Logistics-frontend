import type { Locale } from "./config";

/** "Showing {from}–{to}" + { from: 1, to: 10 } → "Showing 1–10". Unknown keys stay as-is. */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/**
 * Locale-bound number/date formatters. Bangla uses bn-BD, which renders Bengali
 * digits and month names; English keeps the formats the app always used.
 */
export function createFormatters(locale: Locale) {
  const numberLocale = locale === "bn" ? "bn-BD" : "en-BD";
  const dateLocale = locale === "bn" ? "bn-BD" : "en-GB";
  const plainLocale = locale === "bn" ? "bn-BD" : "en";

  return {
    locale,
    /** Backend amounts (Prisma Decimals arrive as strings). */
    currency(amount: number | string, currency = "BDT"): string {
      const value = typeof amount === "string" ? Number(amount) : amount;
      return new Intl.NumberFormat(numberLocale, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(Number.isFinite(value) ? value : 0);
    },
    date(value: string | Date | null | undefined, withTime = false): string {
      if (!value) return "—";
      return new Intl.DateTimeFormat(dateLocale, {
        dateStyle: "medium",
        ...(withTime ? { timeStyle: "short" } : {}),
      }).format(new Date(value));
    },
    number(value: number, options?: Intl.NumberFormatOptions): string {
      return new Intl.NumberFormat(plainLocale, options).format(value);
    },
    /** 1200 → "1.2K" — chart axes and tight KPI spaces. */
    compact(value: number): string {
      return new Intl.NumberFormat(plainLocale, {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value);
    },
    /** "5 minutes ago" style label. */
    relative(value: string | Date): string {
      const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
      const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
      ];
      const formatter = new Intl.RelativeTimeFormat(plainLocale, { numeric: "auto" });
      for (const [unit, size] of units) {
        if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit);
      }
      return formatter.format(seconds, "second");
    },
  };
}

export type Formatters = ReturnType<typeof createFormatters>;
