import type { Locale } from "@/i18n/config";
import type { DashboardTimelinePoint } from "@/types";

export const CHART_COLORS = {
  primary: "var(--chart-1)",
  accent: "var(--chart-2)",
  warning: "var(--chart-3)",
  danger: "var(--chart-4)",
  success: "var(--chart-5)",
};

export function formatDayLabel(date: string, locale: Locale = "en"): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(locale === "bn" ? "bn-BD" : "en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Sums the backend's daily points into 7-day buckets (keyed by each bucket's first day). */
export function toWeekly(points: DashboardTimelinePoint[]): DashboardTimelinePoint[] {
  const weeks: DashboardTimelinePoint[] = [];
  for (let i = 0; i < points.length; i += 7) {
    const chunk = points.slice(i, i + 7);
    weeks.push({
      date: chunk[0].date,
      parcels: chunk.reduce((sum, p) => sum + p.parcels, 0),
      delivered: chunk.reduce((sum, p) => sum + p.delivered, 0),
      revenue: chunk.reduce((sum, p) => sum + p.revenue, 0),
    });
  }
  return weeks;
}
