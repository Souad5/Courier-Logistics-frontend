"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TrackParcelForm({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState(defaultValue);

  return (
    <form
      className="flex w-full max-w-lg gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const value = trackingNumber.trim().toUpperCase();
        if (value) router.push(`/track/${encodeURIComponent(value)}`);
      }}
    >
      <Input
        value={trackingNumber}
        onChange={(event) => setTrackingNumber(event.target.value)}
        placeholder="Enter tracking number, e.g. BCM1A2B3C4D"
        aria-label="Tracking number"
        className="h-11"
      />
      <Button type="submit" size="lg" className="h-11">
        <Search /> Track
      </Button>
    </form>
  );
}
