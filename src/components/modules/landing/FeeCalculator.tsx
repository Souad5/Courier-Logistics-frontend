"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { HubSelect } from "@/components/modules/hubs/HubSelect";
import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/form";
import { estimateFee } from "@/config/content";
import { useHubs } from "@/hooks/useHubs";
import { useI18n } from "@/i18n/client";
import { useAuthStore } from "@/store/auth.store";

const MAX_WEIGHT_KG = 1000; // parcel.validation.ts

/** Delivery calculator: weight + pickup hub + delivery hub → the same formula the backend charges. */
export function FeeCalculator() {
  const { t, f, format } = useI18n();
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
          label={t.landing.calculator.weight}
          type="number"
          inputMode="decimal"
          min={0}
          max={MAX_WEIGHT_KG}
          step={0.1}
          value={weight}
          onChange={(event) => setWeight(event.target.value)}
          error={
            weight && !validWeight
              ? format(t.landing.calculator.weightError, { max: f.number(MAX_WEIGHT_KG) })
              : undefined
          }
        />
        <HubSelect label={t.landing.calculator.pickupHub} value={originId} onChange={setOriginId} />
        <HubSelect
          label={t.landing.calculator.deliveryHub}
          value={destinationId}
          onChange={setDestinationId}
        />
      </div>

      <div className="bg-muted/50 flex flex-col justify-between gap-4 rounded-xl p-4">
        {fee ? (
          <dl className="space-y-1.5 text-sm">
            <Row label={t.landing.calculator.baseFee} value={f.currency(fee.baseFee)} />
            <Row label={t.landing.calculator.weightCharge} value={f.currency(fee.weightFee)} />
            <Row
              label={t.landing.calculator.zoneSurcharges}
              value={f.currency(fee.zoneSurcharge)}
            />
            <div className="flex items-baseline justify-between border-t pt-2">
              <dt className="font-medium">{t.landing.calculator.estimatedFee}</dt>
              <dd className="text-2xl font-semibold tabular-nums">{f.currency(fee.total)}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-muted-foreground text-sm">{t.landing.calculator.hint}</p>
        )}
        <AppButton asChild className="group w-full">
          <Link href={bookHref}>
            {t.landing.calculator.book}
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
