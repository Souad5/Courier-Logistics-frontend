"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AppButton } from "@/components/shared/AppButton";
import { AppDialog } from "@/components/shared/AppDialog";
import { FormInput, FormTextarea } from "@/components/shared/form";
import { useCreateHub, useUpdateHub } from "@/hooks/useHubs";
import { useI18n } from "@/i18n/client";
import type { Dictionary } from "@/i18n/dictionaries";
import type { interpolate } from "@/i18n/format";
import type { Hub } from "@/types";

// Mirrors courier-backend hub.validation.ts; city accepts "" in the form.
function createHubSchema(t: Dictionary, format: typeof interpolate) {
  const min = (n: number) => format(t.validation.minChars, { n });
  return z.object({
    name: z.string().trim().min(2, min(2)).max(100),
    code: z
      .string()
      .trim()
      .min(2, min(2))
      .max(20)
      .regex(/^[A-Z0-9_-]+$/i, t.hubs.form.codeFormat),
    zoneCode: z.string().trim().min(2, min(2)).max(30),
    zoneName: z.string().trim().min(2, min(2)).max(60),
    address: z.string().trim().min(3, min(3)).max(200),
    city: z.union([z.literal(""), z.string().trim().min(2, min(2)).max(60)]),
    lat: z.number(t.validation.number).min(-90).max(90).optional(),
    lng: z.number(t.validation.number).min(-180).max(180).optional(),
  });
}

type HubFormData = z.infer<ReturnType<typeof createHubSchema>>;

export function HubFormDialog({ hub, onClose }: { hub?: Hub; onClose: () => void }) {
  const { t, format } = useI18n();
  const labels = t.hubs.form;
  const isEdit = Boolean(hub?.id);
  const create = useCreateHub();
  const update = useUpdateHub();
  const mutation = isEdit ? update : create;

  const { control, handleSubmit } = useForm<HubFormData>({
    resolver: zodResolver(createHubSchema(t, format)),
    defaultValues: hub
      ? {
          name: hub.name,
          code: hub.code,
          zoneCode: hub.zoneCode,
          zoneName: hub.zoneName,
          address: hub.address,
          city: hub.city ?? "",
          lat: hub.lat ?? undefined,
          lng: hub.lng ?? undefined,
        }
      : undefined,
  });

  const onSubmit = ({ city, ...rest }: HubFormData) => {
    const data = { ...rest, ...(city && { city }) };
    if (isEdit && hub?.id) {
      update.mutate({ id: hub.id, ...data }, { onSuccess: () => onClose() });
    } else {
      create.mutate(data, { onSuccess: () => onClose() });
    }
  };

  return (
    <AppDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={isEdit ? labels.editTitle : labels.createTitle}
      footer={
        <AppButton onClick={handleSubmit(onSubmit)} loading={mutation.isPending}>
          {isEdit ? labels.update : labels.create}
        </AppButton>
      }
    >
      <div className="space-y-4 py-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput control={control} name="name" label={labels.name} required />
          <FormInput control={control} name="code" label={labels.code} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput control={control} name="zoneCode" label={labels.zoneCode} required />
          <FormInput control={control} name="zoneName" label={labels.zoneName} required />
        </div>
        <FormTextarea control={control} name="address" label={labels.address} required />
        <div className="grid gap-4 sm:grid-cols-3">
          <FormInput control={control} name="city" label={labels.city} />
          <FormInput
            control={control}
            name="lat"
            label={labels.latitude}
            type="number"
            step="0.0001"
          />
          <FormInput
            control={control}
            name="lng"
            label={labels.longitude}
            type="number"
            step="0.0001"
          />
        </div>
      </div>
    </AppDialog>
  );
}
