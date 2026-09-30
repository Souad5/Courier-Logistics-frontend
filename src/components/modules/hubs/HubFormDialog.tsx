"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { AppButton } from "@/components/shared/AppButton";
import { AppDialog } from "@/components/shared/AppDialog";
import { FormInput, FormTextarea } from "@/components/shared/form";
import { useCreateHub, useUpdateHub } from "@/hooks/useHubs";
import type { Hub } from "@/types";
import type { HubInput } from "@/types";

type HubFormData = {
  name: string;
  code: string;
  zoneCode: string;
  zoneName: string;
  address: string;
  city?: string;
  lat?: number;
  lng?: number;
};

export function HubFormDialog({ hub, onClose }: { hub?: Hub; onClose: () => void }) {
  const isEdit = Boolean(hub?.id);
  const create = useCreateHub();
  const update = useUpdateHub();
  const mutation = isEdit ? update : create;

  const { control, handleSubmit, reset } = useForm<HubFormData>({
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

  const onSubmit = (data: HubFormData) => {
    if (isEdit && hub?.id) {
      update.mutate({ id: hub.id, ...data }, { onSuccess: () => onClose() });
    } else {
      create.mutate(data, { onSuccess: () => onClose() });
    }
  };

  useEffect(() => {
    if (mutation.isSuccess) reset();
  }, [mutation.isSuccess, reset]);

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
