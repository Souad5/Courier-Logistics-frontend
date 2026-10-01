"use client";

import { CountUp } from "@/components/shared/CountUp";
import { Skeleton } from "@/components/ui/skeleton";
import { useHubs } from "@/hooks/useHubs";
import { useI18n } from "@/i18n/client";

/**
 * Network numbers counted from the public hub list — real figures, not marketing
 * totals — shown as a frosted panel over the hero photo. Live numbers are dropped
 * if the API is unreachable.
 */
export function LiveStats() {
  const { t } = useI18n();
  const { data, isLoading, isError } = useHubs({ limit: 100 });
  const hubs = data?.data.hubs ?? [];

  const stats: Array<{
    key: keyof typeof t.landing.stats;
    value: number;
    suffix?: string;
    live: boolean;
  }> = [
    { key: "hubs", value: data?.meta?.total ?? hubs.length, live: true },
    { key: "cities", value: new Set(hubs.map((h) => h.city).filter(Boolean)).size, live: true },
    { key: "zones", value: new Set(hubs.map((h) => h.zoneCode)).size, live: true },
    { key: "attempts", value: 3, suffix: "×", live: false },
  ];
  const visible = stats.filter((s) => !(isError && s.live));

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/15 shadow-2xl backdrop-blur-md">
      {visible.map((stat) => (
        <div
          key={stat.key}
          className="flex flex-col-reverse gap-1 bg-black/35 p-4 min-[380px]:p-5 sm:p-6"
        >
          <dt className="text-xs text-pretty text-white/70 min-[380px]:text-sm">
            {t.landing.stats[stat.key]}
          </dt>
          <dd className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {stat.live && isLoading ? (
              <Skeleton className="h-9 w-12 bg-white/20" />
            ) : (
              <>
                <CountUp value={stat.value} />
                {stat.suffix}
              </>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
