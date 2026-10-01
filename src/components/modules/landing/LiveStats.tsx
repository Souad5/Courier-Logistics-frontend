"use client";

import { CountUp } from "@/components/shared/CountUp";
import { Skeleton } from "@/components/ui/skeleton";
import { useHubs } from "@/hooks/useHubs";

/**
 * Network numbers counted from the public hub list — real figures, not marketing
 * totals — shown as a frosted panel over the hero photo. Live numbers are dropped
 * if the API is unreachable.
 */
export function LiveStats() {
  const { data, isLoading, isError } = useHubs({ limit: 100 });
  const hubs = data?.data.hubs ?? [];

  const stats: Array<{ value: number; suffix?: string; label: string; live: boolean }> = [
    { value: data?.meta?.total ?? hubs.length, label: "Hubs in the network", live: true },
    {
      value: new Set(hubs.map((h) => h.city).filter(Boolean)).size,
      label: "Cities served",
      live: true,
    },
    { value: new Set(hubs.map((h) => h.zoneCode)).size, label: "Delivery zones", live: true },
    { value: 3, suffix: "×", label: "Delivery attempts before return", live: false },
  ];
  const visible = stats.filter((s) => !(isError && s.live));

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/15 shadow-2xl backdrop-blur-md">
      {visible.map((stat) => (
        <div key={stat.label} className="flex flex-col-reverse gap-1 bg-black/35 p-5 sm:p-6">
          <dt className="text-sm text-white/70">{stat.label}</dt>
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
