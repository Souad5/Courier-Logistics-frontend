"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AppButton } from "@/components/shared/AppButton";
import { AppDialog } from "@/components/shared/AppDialog";
import { FormSelect } from "@/components/shared/form";
import { useAssignParcel } from "@/hooks/useParcels";
import { useUsers } from "@/hooks/useUsers";
import type { Parcel } from "@/types";

const assignSchema = z.object({
  courierId: z.string().min(1, "Select a courier"),
  destinationHubId: z.string(),
});

type AssignValues = z.infer<typeof assignSchema>;

export function AssignParcelDialog({ parcel, onClose }: { parcel: Parcel; onClose: () => void }) {
  const { control, handleSubmit } = useForm<AssignValues>({
    resolver: zodResolver(assignSchema),
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
      title="Assign Courier"
      description={`Parcel #${parcel.trackingNumber}`}
      footer={
        <AppButton onClick={handleSubmit(onSubmit)} loading={assign.isPending}>
          Assign
        </AppButton>
      }
    >
      <div className="space-y-4 py-4">
        <FormSelect
          control={control}
          name="courierId"
          label="Courier"
          placeholder={couriersLoading ? "Loading couriers…" : "Select a courier"}
          options={couriers.map((c) => ({ label: c.name, value: c.id }))}
          required
        />
      </div>
    </AppDialog>
  );
}
