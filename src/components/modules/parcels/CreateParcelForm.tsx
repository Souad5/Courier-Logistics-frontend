"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Control, type FieldPath, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { AppButton } from "@/components/shared/AppButton";
import { FormInput, FormSelect, FormTextarea } from "@/components/shared/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { estimateFee } from "@/config/content";
import { useHubs } from "@/hooks/useHubs";
import { useCreateParcel } from "@/hooks/useParcels";
import { useI18n } from "@/i18n/client";
import type { Dictionary } from "@/i18n/dictionaries";
import { type Formatters, interpolate } from "@/i18n/format";
import { cn } from "@/lib/utils";
import type { Hub } from "@/types";
import { PARCEL_TYPES } from "@/types/enums";

// Mirrors courier-backend parcel.validation.ts; optional text fields accept "" in the form.
// Built per render so the messages follow the active language.
function createParcelSchema(t: Dictionary, f: Formatters) {
  const atLeast = (n: number) => interpolate(t.booking.errors.atLeast, { n: f.number(n) });
  const optionalText = (max: number, min = 2) =>
    z.union([z.literal(""), z.string().trim().min(min, atLeast(min)).max(max)]);

  return z
    .object({
      type: z.enum(PARCEL_TYPES, t.booking.errors.typeRequired),
      weightKg: z
        .number(t.booking.errors.weightRequired)
        .positive(t.booking.errors.weightPositive)
        .max(1000, t.booking.errors.weightMax),
      dimensions: optionalText(50, 1),
      notes: optionalText(500, 1),
      originHubId: z.string().min(1, t.booking.errors.originRequired),
      destinationHubId: z.string().min(1, t.booking.errors.destinationRequired),
      senderName: z.string().trim().min(2, atLeast(2)).max(60),
      senderPhone: z.string().trim().min(6, atLeast(6)).max(20),
      senderAddress: z.string().trim().min(3, atLeast(3)).max(200),
      senderCity: optionalText(60),
      receiverName: z.string().trim().min(2, atLeast(2)).max(60),
      receiverPhone: z.string().trim().min(6, atLeast(6)).max(20),
      receiverAddress: z.string().trim().min(3, atLeast(3)).max(200),
      receiverCity: optionalText(60),
    })
    .refine((v) => v.originHubId !== v.destinationHubId, {
      path: ["destinationHubId"],
      message: t.booking.errors.sameHub,
    });
}

type ParcelFormValues = z.infer<ReturnType<typeof createParcelSchema>>;

const STEPS: Array<{
  key: keyof Dictionary["booking"]["steps"];
  fields: FieldPath<ParcelFormValues>[];
}> = [
  {
    key: "route",
    fields: ["type", "weightKg", "dimensions", "notes", "originHubId", "destinationHubId"],
  },
  { key: "sender", fields: ["senderName", "senderPhone", "senderAddress", "senderCity"] },
  {
    key: "recipient",
    fields: ["receiverName", "receiverPhone", "receiverAddress", "receiverCity"],
  },
  { key: "review", fields: [] },
];

const withoutEmpty = <T extends Record<string, unknown>>(values: T) =>
  Object.fromEntries(Object.entries(values).filter(([, v]) => v !== "")) as Partial<T>;

export function CreateParcelForm() {
  const router = useRouter();
  const { t, f, format } = useI18n();
  const [step, setStep] = useState(0);
  const { control, handleSubmit, trigger, getValues } = useForm<ParcelFormValues>({
    resolver: zodResolver(createParcelSchema(t, f)),
    defaultValues: {
      type: "PARCEL",
      dimensions: "",
      notes: "",
      originHubId: "",
      destinationHubId: "",
      senderName: "",
      senderPhone: "",
      senderAddress: "",
      senderCity: "",
      receiverName: "",
      receiverPhone: "",
      receiverAddress: "",
      receiverCity: "",
    },
  });

  const { data: hubsData } = useHubs({ limit: 100 });
  const create = useCreateParcel();

  const hubs = hubsData?.data.hubs ?? [];
  const hubOptions = hubs.map((h) => ({ label: `${h.name} (${h.zoneName})`, value: h.id }));
  const hubName = (id: string) => hubs.find((h) => h.id === id)?.name ?? "—";

  const isLast = step === STEPS.length - 1;

  const next = async () => {
    if (await trigger(STEPS[step].fields)) setStep(step + 1);
  };

  const onSubmit = (values: ParcelFormValues) => {
    const payload = withoutEmpty(values) as Omit<
      ParcelFormValues,
      "dimensions" | "notes" | "senderCity" | "receiverCity"
    >;
    create.mutate(payload, { onSuccess: () => router.push("/customer/parcels") });
  };

  const review = getValues();

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-6">
        <ol className="flex items-center gap-2" aria-label={t.booking.progress}>
          {STEPS.map((s, index) => (
            <li
              key={s.key}
              aria-current={index === step ? "step" : undefined}
              className="flex flex-1 flex-col gap-1.5"
            >
              <span
                className={cn("h-1.5 rounded-full", index <= step ? "bg-signal" : "bg-muted")}
              />
              <span
                className={cn(
                  "hidden items-center gap-2 text-sm sm:flex",
                  index === step ? "font-medium" : "text-muted-foreground",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "grid size-5 place-items-center rounded-full border text-[0.7rem] tabular-nums",
                    index < step && "bg-signal border-transparent text-background",
                    index === step && "border-signal text-foreground",
                  )}
                >
                  {index < step ? <Check className="size-3" /> : f.number(index + 1)}
                </span>
                {t.booking.steps[s.key].title}
              </span>
            </li>
          ))}
        </ol>

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            if (isLast) handleSubmit(onSubmit)();
            else next();
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {format(t.booking.stepHeading, {
                  step: f.number(step + 1),
                  total: f.number(STEPS.length),
                  title: t.booking.steps[STEPS[step].key].title,
                })}
              </CardTitle>
              <CardDescription>{t.booking.steps[STEPS[step].key].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 0 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormSelect
                      control={control}
                      name="type"
                      label={t.booking.fields.type}
                      options={PARCEL_TYPES.map((type) => ({
                        label: t.enums.parcelType[type],
                        value: type,
                      }))}
                      required
                    />
                    <FormInput
                      control={control}
                      name="weightKg"
                      label={t.booking.fields.weight}
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={1000}
                      step="0.1"
                      placeholder="0.5"
                      required
                    />
                  </div>
                  <FormInput
                    control={control}
                    name="dimensions"
                    label={t.booking.fields.dimensions}
                    placeholder="30×20×10"
                  />
                  <FormTextarea
                    control={control}
                    name="notes"
                    label={t.booking.fields.notes}
                    placeholder={t.booking.fields.notesPlaceholder}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormSelect
                      control={control}
                      name="originHubId"
                      label={t.booking.fields.originHub}
                      placeholder={t.booking.fields.originPlaceholder}
                      options={hubOptions}
                      required
                    />
                    <FormSelect
                      control={control}
                      name="destinationHubId"
                      label={t.booking.fields.destinationHub}
                      placeholder={t.booking.fields.destinationPlaceholder}
                      options={hubOptions}
                      required
                    />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormInput
                      control={control}
                      name="senderName"
                      label={t.booking.fields.fullName}
                      required
                    />
                    <FormInput
                      control={control}
                      name="senderPhone"
                      label={t.booking.fields.phone}
                      type="tel"
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                    <FormInput
                      control={control}
                      name="senderAddress"
                      label={t.booking.fields.address}
                      required
                    />
                    <FormInput control={control} name="senderCity" label={t.booking.fields.city} />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormInput
                      control={control}
                      name="receiverName"
                      label={t.booking.fields.fullName}
                      required
                    />
                    <FormInput
                      control={control}
                      name="receiverPhone"
                      label={t.booking.fields.phone}
                      type="tel"
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                    <FormInput
                      control={control}
                      name="receiverAddress"
                      label={t.booking.fields.address}
                      required
                    />
                    <FormInput
                      control={control}
                      name="receiverCity"
                      label={t.booking.fields.city}
                    />
                  </div>
                </>
              )}

              {isLast && (
                <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                  <ReviewItem
                    label={t.booking.review.type}
                    value={t.enums.parcelType[review.type]}
                  />
                  <ReviewItem
                    label={t.booking.review.weight}
                    value={format(t.booking.kg, { n: f.number(review.weightKg) })}
                  />
                  <ReviewItem
                    label={t.booking.review.originHub}
                    value={hubName(review.originHubId)}
                  />
                  <ReviewItem
                    label={t.booking.review.destinationHub}
                    value={hubName(review.destinationHubId)}
                  />
                  <ReviewItem
                    label={t.booking.review.dimensions}
                    value={review.dimensions || "—"}
                  />
                  <ReviewItem label={t.booking.review.notes} value={review.notes || "—"} />
                  <ReviewItem
                    label={t.booking.review.sender}
                    value={`${review.senderName} · ${review.senderPhone}`}
                    detail={[review.senderAddress, review.senderCity].filter(Boolean).join(", ")}
                  />
                  <ReviewItem
                    label={t.booking.review.recipient}
                    value={`${review.receiverName} · ${review.receiverPhone}`}
                    detail={[review.receiverAddress, review.receiverCity]
                      .filter(Boolean)
                      .join(", ")}
                  />
                  <p className="text-muted-foreground sm:col-span-2">{t.booking.review.feeNote}</p>
                </dl>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-wrap gap-3">
            {step > 0 && (
              <AppButton
                type="button"
                variant="outline"
                disabled={create.isPending}
                onClick={() => setStep(step - 1)}
              >
                {t.booking.actions.back}
              </AppButton>
            )}
            <AppButton type="submit" loading={create.isPending}>
              {isLast ? t.booking.actions.book : t.booking.actions.continue}
            </AppButton>
            <AppButton
              type="button"
              variant="ghost"
              disabled={create.isPending}
              onClick={() => router.back()}
            >
              {t.booking.actions.cancel}
            </AppButton>
          </div>
        </form>
      </div>

      <ShipmentSummary control={control} hubs={hubs} />
    </div>
  );
}

/** Sticky side panel that follows the form; the fee is a preview of the server's calculateFee. */
function ShipmentSummary({ control, hubs }: { control: Control<ParcelFormValues>; hubs: Hub[] }) {
  const { t, f, format } = useI18n();
  const [type, weightKg, originHubId, destinationHubId, receiverName] = useWatch({
    control,
    name: ["type", "weightKg", "originHubId", "destinationHubId", "receiverName"],
  });
  const origin = hubs.find((h) => h.id === originHubId);
  const destination = hubs.find((h) => h.id === destinationHubId);
  const weight = Number.isFinite(weightKg) && weightKg > 0 ? weightKg : null;
  const fee =
    weight && origin && destination
      ? estimateFee(weight, origin.zoneCode, destination.zoneCode)
      : null;

  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader>
        <CardTitle>{t.booking.summary.title}</CardTitle>
        <CardDescription>{t.booking.summary.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 text-sm">
        <dl className="space-y-3">
          <SummaryRow label={t.booking.summary.type} value={t.enums.parcelType[type]} />
          <SummaryRow
            label={t.booking.summary.weight}
            value={weight ? format(t.booking.kg, { n: f.number(weight) }) : "—"}
          />
          <SummaryRow
            label={t.booking.summary.from}
            value={origin ? `${origin.name} · ${origin.zoneName}` : "—"}
          />
          <SummaryRow
            label={t.booking.summary.to}
            value={destination ? `${destination.name} · ${destination.zoneName}` : "—"}
          />
          <SummaryRow label={t.booking.summary.recipient} value={receiverName || "—"} />
        </dl>

        <div className="space-y-2 border-t pt-4">
          {fee ? (
            <>
              <SummaryRow label={t.booking.summary.baseFee} value={f.currency(fee.baseFee)} muted />
              <SummaryRow
                label={t.booking.summary.weightCharge}
                value={f.currency(fee.weightFee)}
                muted
              />
              <SummaryRow
                label={t.booking.summary.zoneSurcharges}
                value={f.currency(fee.zoneSurcharge)}
                muted
              />
              <div className="flex items-baseline justify-between border-t pt-3">
                <span className="font-medium">{t.booking.summary.estimatedFee}</span>
                <span className="text-xl font-semibold tabular-nums">{f.currency(fee.total)}</span>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">{t.booking.summary.needInputs}</p>
          )}
        </div>

        <p className="text-muted-foreground border-t pt-4">{t.booking.summary.finalNote}</p>
      </CardContent>
    </Card>
  );
}

function SummaryRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground shrink-0">{label}</dt>
      <dd
        className={cn("text-right tabular-nums", muted ? "text-muted-foreground" : "font-medium")}
      >
        {value}
      </dd>
    </div>
  );
}

function ReviewItem({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
      {detail && <dd className="text-muted-foreground">{detail}</dd>}
    </div>
  );
}
