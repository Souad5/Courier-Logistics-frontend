"use client";

import { MapPin, Search } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/shared/EmptyState";
import { AppInput, AppSelect } from "@/components/shared/form";
import { Skeleton } from "@/components/ui/skeleton";
import { PRICING } from "@/config/content";
import { useHubs } from "@/hooks/useHubs";
import { useI18n } from "@/i18n/client";
import type { Hub } from "@/types";

const ALL = "all";

/** Paperfly-style coverage finder over the live hub list, grouped by city. */
export function CoverageFinder() {
  const { t, f, format, locale } = useI18n();
  const { data, isLoading, isError } = useHubs({ limit: 100 });
  const [search, setSearch] = useState("");
  const [zone, setZone] = useState(ALL);

  const term = search.trim().toLowerCase();
  const hubs = (data?.data.hubs ?? []).filter(
    (h) =>
      (zone === ALL || h.zoneCode === zone) &&
      (!term ||
        [h.name, h.city, h.zoneName, h.address, h.code].some((v) =>
          v?.toLowerCase().includes(term),
        )),
  );

  const byCity = new Map<string, Hub[]>();
  for (const hub of hubs) {
    const city = hub.city || t.landing.coverageFinder.otherCity;
    byCity.set(city, [...(byCity.get(city) ?? []), hub]);
  }
  const cities = [...byCity.entries()].sort(([a], [b]) => a.localeCompare(b, locale));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <AppInput
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t.landing.coverageFinder.searchPlaceholder}
          aria-label={t.landing.coverageFinder.searchLabel}
          leftIcon={<Search />}
          containerClassName="flex-1"
        />
        <AppSelect
          ariaLabel={t.landing.coverageFinder.zoneLabel}
          value={zone}
          onValueChange={setZone}
          options={[
            { value: ALL, label: t.landing.coverageFinder.allZones },
            ...PRICING.zones.map((z) => ({
              value: z.code,
              label: t.enums.zone[z.code] ?? z.label,
            })),
          ]}
          containerClassName="w-full sm:w-48"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      ) : isError ? (
        <EmptyState
          icon={MapPin}
          title={t.landing.coverageFinder.unavailableTitle}
          description={t.landing.coverageFinder.unavailableDescription}
        />
      ) : cities.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title={t.landing.coverageFinder.emptyTitle}
          description={t.landing.coverageFinder.emptyDescription}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cities.map(([city, cityHubs]) => (
            <section key={city} className="rounded-xl border">
              <header className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="font-semibold">{city}</h3>
                <span className="text-muted-foreground text-sm">
                  {format(
                    cityHubs.length === 1
                      ? t.landing.coverageFinder.hubCountOne
                      : t.landing.coverageFinder.hubCountOther,
                    { count: f.number(cityHubs.length) },
                  )}
                </span>
              </header>
              <ul className="divide-y">
                {cityHubs.map((hub) => (
                  <li key={hub.id} className="space-y-0.5 px-4 py-3 text-sm">
                    <p className="flex items-center justify-between gap-3">
                      <span className="font-medium">{hub.name}</span>
                      <span className="text-muted-foreground font-mono">{hub.code}</span>
                    </p>
                    <p className="text-muted-foreground">
                      {hub.zoneName} · {hub.address}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
