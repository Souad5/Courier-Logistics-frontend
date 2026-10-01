"use client";

import { AppSelect, type AppSelectProps } from "@/components/shared/form";
import { useHubs } from "@/hooks/useHubs";
import { useI18n } from "@/i18n/client";

export type HubSelectProps = Omit<AppSelectProps, "options" | "onValueChange"> & {
  onChange: (hubId: string) => void;
};

/**
 * AppSelect bound to the public hub list. Accepts every AppSelect prop
 * (label, error, required…); with react-hook-form wrap it in a <Controller>.
 */
export function HubSelect({ onChange, placeholder, disabled, ...props }: HubSelectProps) {
  const { t } = useI18n();
  const { data, isLoading } = useHubs({ limit: 100 });

  const options = (data?.data.hubs ?? []).map((hub) => ({
    value: hub.id,
    label: `${hub.name} · ${hub.zoneName}`,
  }));

  return (
    <AppSelect
      {...props}
      options={options}
      onValueChange={onChange}
      placeholder={isLoading ? t.hubs.select.loading : (placeholder ?? t.hubs.select.placeholder)}
      disabled={disabled || isLoading}
    />
  );
}
