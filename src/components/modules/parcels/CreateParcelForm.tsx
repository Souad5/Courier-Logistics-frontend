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
import { cn, formatCurrency, humanize } from "@/lib/utils";
import type { Hub } from "@/types";
import { PARCEL_TYPES } from "@/types/enums";

// Mirrors courier-backend parcel.validation.ts; optional text fields accept "" in the form.
const optionalText = (max: number, min = 2) =>
  z.union([z.literal(""), z.string().trim().min(min, `At least ${min} characters`).max(max)]);

const parcelSchema = z
  .object({
    type: z.enum(PARCEL_TYPES, "Select a parcel type"),
    weightKg: z
      .number("Weight is required")
      .positive("Weight must be positive")
      .max(1000, "Weight exceeds maximum of 1000kg"),
    dimensions: optionalText(50, 1),
    notes: optionalText(500, 1),
    originHubId: z.string().min(1, "Select the origin hub"),
    destinationHubId: z.string().min(1, "Select the destination hub"),
    senderName: z.string().trim().min(2, "At least 2 characters").max(60),
    senderPhone: z.string().trim().min(6, "At least 6 characters").max(20),
    senderAddress: z.string().trim().min(3, "At least 3 characters").max(200),
    senderCity: optionalText(60),
    receiverName: z.string().trim().min(2, "At least 2 characters").max(60),
    receiverPhone: z.string().trim().min(6, "At least 6 characters").max(20),
    receiverAddress: z.string().trim().min(3, "At least 3 characters").max(200),
    receiverCity: optionalText(60),
  })
  .refine((v) => v.originHubId !== v.destinationHubId, {
    path: ["destinationHubId"],
    message: "Destination must differ from the origin hub",
  });

type ParcelFormValues = z.infer<typeof parcelSchema>;

const STEPS: Array<{ title: string; description: string; fields: FieldPath<ParcelFormValues>[] }> =
  [
    {
      title: "Parcel & route",
      description: "What you're shipping and where it goes.",
      fields: ["type", "weightKg", "dimensions", "notes", "originHubId", "destinationHubId"],
    },
    {
      title: "Sender",
      description: "Your details as the parcel sender.",
      fields: ["senderName", "senderPhone", "senderAddress", "senderCity"],
    },
    {
      title: "Recipient",
      description: "Who will receive this parcel.",
      fields: ["receiverName", "receiverPhone", "receiverAddress", "receiverCity"],
    },
    { title: "Review", description: "Check everything before booking.", fields: [] },
  ];

const withoutEmpty = <T extends Record<string, unknown>>(values: T) =>
  Object.fromEntries(Object.entries(values).filter(([, v]) => v !== "")) as Partial<T>;

export function CreateParcelForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const { control, handleSubmit, trigger, getValues } = useForm<ParcelFormValues>({
    resolver: zodResolver(parcelSchema),
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
        <ol className="flex items-center gap-2" aria-label="Progress">
          {STEPS.map((s, index) => (
            <li
              key={s.title}
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
                  {index < step ? <Check className="size-3" /> : index + 1}
                </span>
                {s.title}
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
                Step {step + 1} of {STEPS.length}: {STEPS[step].title}
              </CardTitle>
              <CardDescription>{STEPS[step].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 0 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormSelect
                      control={control}
                      name="type"
                      label="Parcel type"
                      options={PARCEL_TYPES.map((t) => ({ label: humanize(t), value: t }))}
                      required
                    />
                    <FormInput
                      control={control}
                      name="weightKg"
                      label="Weight (kg)"
                      type="number"
                      step="0.1"
                      placeholder="0.5"
                      required
                    />
                  </div>
                  <FormInput
                    control={control}
                    name="dimensions"
                    label="Dimensions (L×W×H in cm)"
                    placeholder="30×20×10"
                  />
                  <FormTextarea
                    control={control}
                    name="notes"
                    label="Additional notes"
                    placeholder="Special instructions or package contents"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormSelect
                      control={control}
                      name="originHubId"
                      label="Origin hub"
                      placeholder="Where the parcel starts"
                      options={hubOptions}
                      required
                    />
                    <FormSelect
                      control={control}
                      name="destinationHubId"
                      label="Destination hub"
                      placeholder="Where the parcel goes"
                      options={hubOptions}
                      required
                    />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormInput control={control} name="senderName" label="Full name" required />
                    <FormInput
                      control={control}
                      name="senderPhone"
                      label="Phone number"
                      type="tel"
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                    <FormInput control={control} name="senderAddress" label="Address" required />
                    <FormInput control={control} name="senderCity" label="City" />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormInput control={control} name="receiverName" label="Full name" required />
                    <FormInput
                      control={control}
                      name="receiverPhone"
                      label="Phone number"
                      type="tel"
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                    <FormInput control={control} name="receiverAddress" label="Address" required />
                    <FormInput control={control} name="receiverCity" label="City" />
                  </div>
                </>
              )}

              {isLast && (
                <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                  <ReviewItem label="Type" value={humanize(review.type)} />
                  <ReviewItem label="Weight" value={`${review.weightKg} kg`} />
                  <ReviewItem label="Origin hub" value={hubName(review.originHubId)} />
                  <ReviewItem label="Destination hub" value={hubName(review.destinationHubId)} />
                  <ReviewItem label="Dimensions" value={review.dimensions || "—"} />
                  <ReviewItem label="Notes" value={review.notes || "—"} />
                  <ReviewItem
                    label="Sender"
                    value={`${review.senderName} · ${review.senderPhone}`}
                    detail={[review.senderAddress, review.senderCity].filter(Boolean).join(", ")}
                  />
                  <ReviewItem
                    label="Recipient"
                    value={`${review.receiverName} · ${review.receiverPhone}`}
                    detail={[review.receiverAddress, review.receiverCity]
                      .filter(Boolean)
                      .join(", ")}
                  />
                  <p className="text-muted-foreground sm:col-span-2">
                    The delivery fee is calculated when you book. You can pay from My Parcels.
                  </p>
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
                Back
              </AppButton>
            )}
            <AppButton type="submit" loading={create.isPending}>
              {isLast ? "Book parcel" : "Continue"}
            </AppButton>
            <AppButton
              type="button"
              variant="ghost"
              disabled={create.isPending}
              onClick={() => router.back()}
            >
              Cancel
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
        <CardTitle>Shipment summary</CardTitle>
        <CardDescription>Updates as you fill in the form.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 text-sm">
        <dl className="space-y-3">
          <SummaryRow label="Type" value={humanize(type)} />
          <SummaryRow label="Weight" value={weight ? `${weight} kg` : "—"} />
          <SummaryRow label="From" value={origin ? `${origin.name} · ${origin.zoneName}` : "—"} />
          <SummaryRow
            label="To"
            value={destination ? `${destination.name} · ${destination.zoneName}` : "—"}
          />
          <SummaryRow label="Recipient" value={receiverName || "—"} />
        </dl>

        <div className="space-y-2 border-t pt-4">
          {fee ? (
            <>
              <SummaryRow label="Base fee" value={formatCurrency(fee.baseFee)} muted />
              <SummaryRow label="Weight charge" value={formatCurrency(fee.weightFee)} muted />
              <SummaryRow label="Zone surcharges" value={formatCurrency(fee.zoneSurcharge)} muted />
              <div className="flex items-baseline justify-between border-t pt-3">
                <span className="font-medium">Estimated fee</span>
                <span className="text-xl font-semibold tabular-nums">
                  {formatCurrency(fee.total)}
                </span>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">
              Add the weight and both hubs to see an estimated fee.
            </p>
          )}
        </div>

        <p className="text-muted-foreground border-t pt-4">
          The final fee is confirmed when you book. Pay from My Parcels or Payments to start the
          pickup.
        </p>
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
