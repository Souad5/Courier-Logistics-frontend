"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { AppButton } from "@/components/shared/AppButton";
import { AppDialog } from "@/components/shared/AppDialog";
import { FormSelect, FormTextarea } from "@/components/shared/form";
import { useUpdateParcelStatus } from "@/hooks/useParcels";
import type { UpdateParcelStatusInput, Parcel } from "@/types";
import { ALLOWED_TRANSITIONS } from "@/types/enums";

export function StatusUpdateDialog({
  parcel,
  onClose,
}: {
  parcel: Parcel;
  onClose: () => void;
}) {
  const { control, handleSubmit, reset, watch } = useForm<UpdateParcelStatusInput>({
    defaultValues: {
      status: parcel.status,
      location: "",
      note: "",
    },
  });

  const update = useUpdateParcelStatus();
  const currentStatus = watch("status");
  const allowedNextStatuses = ALLOWED_TRANSITIONS[parcel.status] || [];

  const onSubmit = (data: UpdateParcelStatusInput) => {
    update.mutate({ id: parcel.id, ...data }, { onSuccess: () => onClose() });
  };

  useEffect(() => {
    if (!update.isPending && !update.isSuccess) return;
    if (update.isSuccess) reset();
  }, [update.isSuccess, update.isPending, reset]);

  return (
    <AppDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title="Update Status"
      description={`Parcel #${parcel.trackingNumber}`}
      footer={
        <AppButton
          onClick={handleSubmit(onSubmit)}
          loading={update.isPending}
          disabled={currentStatus === parcel.status}
        >
          Update
        </AppButton>
      }
    >
      <div className="space-y-4 py-4">
        <FormSelect
          control={control}
          name="status"
          label="New Status"
          options={allowedNextStatuses.map((s) => ({
            label: s.replace(/_/g, " "),
            value: s,
          }))}
          required
        />
        <FormTextarea
          control={control}
          name="note"
          label="Note"
          placeholder="Add a note about this status change (optional)"
        />
      </div>
    </AppDialog>
  );
}
