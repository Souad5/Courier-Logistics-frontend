"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { AppButton } from "@/components/shared/AppButton";
import { AppDialog } from "@/components/shared/AppDialog";
import { FormSelect, FormTextarea } from "@/components/shared/form";
import { useUpdateParcelStatus } from "@/hooks/useParcels";
import { useI18n } from "@/i18n/client";
import type { Parcel } from "@/types";
import { ALLOWED_TRANSITIONS, PARCEL_STATUSES } from "@/types/enums";

const createStatusSchema = (minMessage: string) =>
  z.object({
    status: z.enum(PARCEL_STATUSES),
    note: z.union([z.literal(""), z.string().trim().min(2, minMessage).max(300)]),
  });

type StatusValues = z.infer<ReturnType<typeof createStatusSchema>>;

export function StatusUpdateDialog({ parcel, onClose }: { parcel: Parcel; onClose: () => void }) {
  const { t, format } = useI18n();
  const labels = t.parcels.statusUpdate;
  const { control, handleSubmit } = useForm<StatusValues>({
    resolver: zodResolver(createStatusSchema(format(t.validation.minChars, { n: 2 }))),
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
      title={labels.title}
      description={format(t.parcels.parcelRef, { tracking: parcel.trackingNumber })}
      footer={
        <AppButton
          onClick={handleSubmit(onSubmit)}
          loading={update.isPending}
          disabled={currentStatus === parcel.status}
        >
          {labels.submit}
        </AppButton>
      }
    >
      <div className="space-y-4 py-4">
        <FormSelect
          control={control}
          name="status"
          label={labels.newStatus}
          options={allowedNextStatuses.map((s) => ({
            label: t.enums.parcelStatus[s],
            value: s,
          }))}
          required
        />
        <FormTextarea
          control={control}
          name="note"
          label={labels.note}
          placeholder={labels.notePlaceholder}
        />
      </div>
    </AppDialog>
  );
}
