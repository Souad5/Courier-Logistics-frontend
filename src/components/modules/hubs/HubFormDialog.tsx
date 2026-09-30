"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AppButton } from "@/components/shared/AppButton";
import { AppDialog } from "@/components/shared/AppDialog";
import { FormInput, FormTextarea } from "@/components/shared/form";
import { useCreateHub, useUpdateHub } from "@/hooks/useHubs";
import type { Hub } from "@/types";

// Mirrors courier-backend hub.validation.ts; city accepts "" in the form.
const hubSchema = z.object({
  name: z.string().trim().min(2, "At least 2 characters").max(100),
  code: z
    .string()
    .trim()
    .min(2, "At least 2 characters")
    .max(20)
    .regex(/^[A-Z0-9_-]+$/i, "Letters, numbers, dashes and underscores only"),
  zoneCode: z.string().trim().min(2, "At least 2 characters").max(30),
  zoneName: z.string().trim().min(2, "At least 2 characters").max(60),
  address: z.string().trim().min(3, "At least 3 characters").max(200),
  city: z.union([z.literal(""), z.string().trim().min(2, "At least 2 characters").max(60)]),
  lat: z.number("Enter a number").min(-90).max(90).optional(),
  lng: z.number("Enter a number").min(-180).max(180).optional(),
});

type HubFormData = z.infer<typeof hubSchema>;

export function HubFormDialog({ hub, onClose }: { hub?: Hub; onClose: () => void }) {
  const isEdit = Boolean(hub?.id);
  const create = useCreateHub();
  const update = useUpdateHub();
  const mutation = isEdit ? update : create;

  const { control, handleSubmit } = useForm<HubFormData>({
    resolver: zodResolver(hubSchema),
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
      title={isEdit ? "Edit Hub" : "Create Hub"}
      footer={
        <AppButton onClick={handleSubmit(onSubmit)} loading={mutation.isPending}>
          {isEdit ? "Update" : "Create"}
        </AppButton>
      }
    >
      <div className="space-y-4 py-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput control={control} name="name" label="Hub Name" required />
          <FormInput control={control} name="code" label="Hub Code" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput control={control} name="zoneCode" label="Zone Code" required />
          <FormInput control={control} name="zoneName" label="Zone Name" required />
        </div>
        <FormTextarea control={control} name="address" label="Address" required />
        <div className="grid gap-4 sm:grid-cols-3">
          <FormInput control={control} name="city" label="City" />
          <FormInput control={control} name="lat" label="Latitude" type="number" step="0.0001" />
          <FormInput control={control} name="lng" label="Longitude" type="number" step="0.0001" />
        </div>
      </div>
    </AppDialog>
  );
}
