"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { AppButton } from "@/components/shared/AppButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput, FormSelect, FormTextarea } from "@/components/shared/form";
import { useCreateParcel } from "@/hooks/useParcels";
import { useHubs } from "@/hooks/useHubs";
import { PARCEL_TYPES } from "@/types/enums";
import type { CreateParcelInput } from "@/types";

export function CreateParcelForm() {
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm<CreateParcelInput>();

  const { data: hubsData } = useHubs({ limit: 1000 });
  const create = useCreateParcel();

  const hubOptions = (hubsData?.data.hubs ?? []).map((h) => ({
    label: `${h.name} (${h.zoneName})`,
    value: h.id,
  }));

  const onSubmit = (data: CreateParcelInput) => {
    create.mutate(data, {
      onSuccess: () => {
        reset();
        router.push("/customer/parcels");
      },
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sender Information</CardTitle>
          <CardDescription>Your details as the parcel sender.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            control={control}
            name="senderName"
            label="Full Name"
            placeholder="Your full name"
            required
          />
          <FormInput
            control={control}
            name="senderPhone"
            label="Phone Number"
            placeholder="Your phone number"
            type="tel"
            required
          />
          <FormInput
            control={control}
            name="senderAddress"
            label="Address"
            placeholder="Your full address"
            required
          />
          <FormInput
            control={control}
            name="senderCity"
            label="City"
            placeholder="Your city"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parcel Information</CardTitle>
          <CardDescription>Details about what you're shipping.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormSelect
              control={control}
              name="type"
              label="Parcel Type"
              placeholder="Select type"
              options={PARCEL_TYPES.map((t) => ({ label: t, value: t }))}
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
            label="Additional Notes"
            placeholder="Any special instructions or package contents"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recipient Information</CardTitle>
          <CardDescription>Who will receive this parcel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            control={control}
            name="receiverName"
            label="Full Name"
            placeholder="Recipient's full name"
            required
          />
          <FormInput
            control={control}
            name="receiverPhone"
            label="Phone Number"
            placeholder="Recipient's phone number"
            type="tel"
            required
          />
          <FormInput
            control={control}
            name="receiverAddress"
            label="Address"
            placeholder="Recipient's full address"
            required
          />
          <FormInput
            control={control}
            name="receiverCity"
            label="City"
            placeholder="Recipient's city"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Route</CardTitle>
          <CardDescription>Select origin and destination hubs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            control={control}
            name="originHubId"
            label="Origin Hub"
            placeholder="Where the parcel starts"
            options={hubOptions}
            required
          />
          <FormSelect
            control={control}
            name="destinationHubId"
            label="Destination Hub"
            placeholder="Where the parcel goes"
            options={hubOptions}
            required
          />
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <AppButton
          onClick={handleSubmit(onSubmit)}
          loading={create.isPending}
        >
          Create Parcel
        </AppButton>
        <AppButton
          variant="outline"
          onClick={() => router.back()}
          disabled={create.isPending}
        >
          Cancel
        </AppButton>
      </div>
    </div>
  );
}
