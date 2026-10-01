"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AppButton } from "@/components/shared/AppButton";
import { AppDialog } from "@/components/shared/AppDialog";
import { FormSelect } from "@/components/shared/form";
import { useAssignParcel } from "@/hooks/useParcels";
import { useUsers } from "@/hooks/useUsers";
import { useI18n } from "@/i18n/client";
import type { Parcel } from "@/types";

const createAssignSchema = (required: string) =>
  z.object({
    courierId: z.string().min(1, required),
    destinationHubId: z.string(),
  });

type AssignValues = z.infer<ReturnType<typeof createAssignSchema>>;

export function AssignParcelDialog({ parcel, onClose }: { parcel: Parcel; onClose: () => void }) {
  const { t, format } = useI18n();
  const labels = t.parcels.assign;
  const { control, handleSubmit } = useForm<AssignValues>({
    resolver: zodResolver(createAssignSchema(labels.required)),
    defaultValues: {
      courierId: "",
      destinationHubId: parcel.destinationHubId ?? "",
    },
  });

  const { data: usersData, isLoading: couriersLoading } = useUsers({ role: "COURIER", limit: 100 });
  const assign = useAssignParcel();

  const couriers = usersData?.data.users ?? [];

  const onSubmit = ({ courierId, destinationHubId }: AssignValues) => {
    assign.mutate(
      { id: parcel.id, courierId, ...(destinationHubId && { destinationHubId }) },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <AppDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={labels.title}
      description={format(t.parcels.parcelRef, { tracking: parcel.trackingNumber })}
      footer={
        <AppButton onClick={handleSubmit(onSubmit)} loading={assign.isPending}>
          {labels.submit}
        </AppButton>
      }
    >
      <div className="space-y-4 py-4">
        <FormSelect
          control={control}
          name="courierId"
          label={labels.courier}
          placeholder={couriersLoading ? labels.loading : labels.placeholder}
          options={couriers.map((c) => ({ label: c.name, value: c.id }))}
          required
        />
      </div>
    </AppDialog>
  );
}
