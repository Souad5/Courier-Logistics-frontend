"use client";

import { PackageSearch, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/form";

export function TrackParcelForm({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState(defaultValue);
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <search className="w-full max-w-lg">
      <form
        className="flex w-full items-start gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const value = trackingNumber.trim().toUpperCase();
          if (!value || value === defaultValue) return;
          setIsNavigating(true);
          router.push(`/track/${encodeURIComponent(value)}`);
        }}
      >
        <AppInput
          value={trackingNumber}
          onChange={(event) => setTrackingNumber(event.target.value)}
          placeholder="Tracking number, e.g. BCM1A2B3C4D"
          aria-label="Tracking number"
          autoComplete="off"
          spellCheck={false}
          leftIcon={<PackageSearch />}
          className="h-11"
          containerClassName="flex-1"
        />
        <AppButton
          type="submit"
          size="lg"
          className="h-11"
          leftIcon={<Search />}
          loading={isNavigating}
        >
          Track
        </AppButton>
      </form>
    </search>
  );
}
