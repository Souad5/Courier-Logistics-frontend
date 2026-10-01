"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { HubSelect } from "@/components/modules/hubs/HubSelect";
import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/form";
import { estimateFee } from "@/config/content";
import { useHubs } from "@/hooks/useHubs";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

const MAX_WEIGHT_KG = 1000; // parcel.validation.ts

/** Delivery calculator: weight + pickup hub + delivery hub → the same formula the backend charges. */
export function FeeCalculator() {
  const [weight, setWeight] = useState("1");
  const [originId, setOriginId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const { data } = useHubs({ limit: 100 });
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  const hubs = data?.data.hubs ?? [];
  const origin = hubs.find((h) => h.id === originId);
  const destination = hubs.find((h) => h.id === destinationId);
  const kg = Number(weight);
  const validWeight = Number.isFinite(kg) && kg > 0 && kg <= MAX_WEIGHT_KG;
  const fee =
    validWeight && origin && destination
      ? estimateFee(kg, origin.zoneCode, destination.zoneCode)
      : null;

  const bookHref = hydrated && user?.role === "CUSTOMER" ? "/customer/parcels/new" : "/register";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="grid gap-4 sm:grid-cols-3">
        <AppInput
          label="Weight (kg)"
          type="number"
          inputMode="decimal"
          min={0.1}
          max={MAX_WEIGHT_KG}
          step={0.1}
          value={weight}
          onChange={(event) => setWeight(event.target.value)}
          error={weight && !validWeight ? `Enter 0.1–${MAX_WEIGHT_KG} kg` : undefined}
        />
        <HubSelect label="Pickup hub" value={originId} onChange={setOriginId} />
        <HubSelect label="Delivery hub" value={destinationId} onChange={setDestinationId} />
      </div>

      <div className="bg-muted/50 flex flex-col justify-between gap-4 rounded-xl p-4">
        {fee ? (
          <dl className="space-y-1.5 text-sm">
            <Row label="Base fee" value={formatCurrency(fee.baseFee)} />
            <Row label="Weight charge" value={formatCurrency(fee.weightFee)} />
            <Row label="Zone surcharges" value={formatCurrency(fee.zoneSurcharge)} />
            <div className="flex items-baseline justify-between border-t pt-2">
              <dt className="font-medium">Estimated fee</dt>
              <dd className="text-2xl font-semibold tabular-nums">{formatCurrency(fee.total)}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-muted-foreground text-sm">
            Pick a pickup and delivery hub to see the fee before you book.
          </p>
        )}
        <AppButton asChild className="group w-full">
          <Link href={bookHref}>
            Book this parcel
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </AppButton>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-muted-foreground flex justify-between gap-4">
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
