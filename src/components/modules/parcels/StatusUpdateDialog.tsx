"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { AppButton } from "@/components/shared/AppButton";
import { AppDialog } from "@/components/shared/AppDialog";
import { FormSelect, FormTextarea } from "@/components/shared/form";
import { useUpdateParcelStatus } from "@/hooks/useParcels";
import type { Parcel } from "@/types";
import { ALLOWED_TRANSITIONS, PARCEL_STATUSES } from "@/types/enums";

const statusSchema = z.object({
  status: z.enum(PARCEL_STATUSES),
  note: z.union([z.literal(""), z.string().trim().min(2, "At least 2 characters").max(300)]),
});

type StatusValues = z.infer<typeof statusSchema>;

export function StatusUpdateDialog({ parcel, onClose }: { parcel: Parcel; onClose: () => void }) {
  const { control, handleSubmit } = useForm<StatusValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: { status: parcel.status, note: "" },
  });

  const update = useUpdateParcelStatus();
  const currentStatus = useWatch({ control, name: "status" });
  const allowedNextStatuses = ALLOWED_TRANSITIONS[parcel.status] || [];

  const onSubmit = ({ status, note }: StatusValues) => {
    update.mutate({ id: parcel.id, status, ...(note && { note }) }, { onSuccess: () => onClose() });
  };

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
