"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { AppButton } from "@/components/shared/AppButton";
import { AppDialog } from "@/components/shared/AppDialog";
import { FormSelect } from "@/components/shared/form";
import { useAssignParcel } from "@/hooks/useParcels";
import { useUsers } from "@/hooks/useUsers";
import type { AssignParcelInput, Parcel } from "@/types";

export function AssignParcelDialog({
  parcel,
  onClose,
}: {
  parcel: Parcel;
  onClose: () => void;
}) {
  const { control, handleSubmit, reset } = useForm<AssignParcelInput>({
    defaultValues: {
      courierId: "",
      destinationHubId: parcel.destinationHubId ?? "",
    },
  });

  const { data: usersData } = useUsers({ limit: 1000 });
  const assign = useAssignParcel();

  const couriers = useMemo(
    () => usersData?.data.users.filter((u) => u.role === "COURIER") ?? [],
    [usersData],
  );

  const onSubmit = (data: AssignParcelInput) => {
    assign.mutate({ id: parcel.id, ...data }, { onSuccess: () => onClose() });
  };

  useEffect(() => {
    if (!assign.isPending && !assign.isSuccess) return;
    if (assign.isSuccess) reset();
  }, [assign.isSuccess, assign.isPending, reset]);

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
          placeholder="Select a courier"
          options={couriers.map((c) => ({ label: c.name, value: c.id }))}
          required
        />
      </div>
    </AppDialog>
  );
}
