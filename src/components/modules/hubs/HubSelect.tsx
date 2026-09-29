"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHubs } from "@/hooks/useHubs";

interface HubSelectProps {
  value?: string;
  onChange: (hubId: string) => void;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
}

/** Select bound to the public hub list; pass to react-hook-form via <Controller>. */
export function HubSelect({ value, onChange, placeholder = "Select a hub", id, disabled }: HubSelectProps) {
  const { data, isLoading } = useHubs({ limit: 100 });
  const hubs = data?.data.hubs ?? [];

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled || isLoading}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={isLoading ? "Loading hubs…" : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {hubs.map((hub) => (
          <SelectItem key={hub.id} value={hub.id}>
            {hub.name} · {hub.zoneName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
