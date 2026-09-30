"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AppButton } from "@/components/shared/AppButton";
import { FormInput } from "@/components/shared/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateProfile } from "@/hooks/useUsers";
import { formatDate, humanize, initials } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import type { User } from "@/types";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  phone: z.union([z.literal(""), z.string().trim().min(6, "Too short").max(20, "Too long")]),
  avatarUrl: z.union([z.literal(""), z.url("Enter a valid URL")]),
});

type ProfileValues = z.infer<typeof profileSchema>;

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const AVATAR_SIZE = 256;

/** Center-crops to a square and downsizes so the stored avatar stays small (~20-40 KB). */
async function imageToAvatarDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    AVATAR_SIZE,
    AVATAR_SIZE,
  );
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.85);
}

function ProfileFields({ user }: { user: User }) {
  const update = useUpdateProfile();
  const { control, handleSubmit, formState, setValue } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone ?? "",
      avatarUrl: user.avatarUrl ?? "",
    },
  });

  const avatarUrl = useWatch({ control, name: "avatarUrl" });
  const fileInput = useRef<HTMLInputElement>(null);

  const onPickFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > MAX_FILE_BYTES) return toast.error("Image must be 5 MB or smaller.");
    try {
      setValue("avatarUrl", await imageToAvatarDataUrl(file), { shouldDirty: true });
    } catch {
      toast.error("Could not read that image.");
    }
  };

  // The backend rejects empty strings, so only send fields that have a value.
  const onSubmit = (values: ProfileValues) =>
    update.mutate({
      name: values.name,
      ...(values.phone && { phone: values.phone }),
      ...(values.avatarUrl && { avatarUrl: values.avatarUrl }),
    });

  return (
    <div className="grid max-w-2xl gap-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={user.name} />}
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="font-medium">{user.name}</p>
          <p className="text-muted-foreground text-sm">
            {humanize(user.role)} · Joined {formatDate(user.createdAt)}
          </p>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              onPickFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <AppButton
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInput.current?.click()}
          >
            Upload photo
          </AppButton>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormInput control={control} name="name" label="Full name" required />
        <FormInput
          control={control}
          name="phone"
          label="Phone"
          type="tel"
          placeholder="+8801XXXXXXXXX"
        />
        <AppButton type="submit" loading={update.isPending} disabled={!formState.isDirty}>
          Save changes
        </AppButton>
      </form>

      <div className="space-y-4 border-t pt-6">
        <FormInputReadOnly label="Email" value={user.email} />
      </div>
    </div>
  );
}

function FormInputReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-muted-foreground text-sm">{value}</p>
    </div>
  );
}

export function ProfileForm() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  if (!hydrated || !user) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  // Remount when the server returns a fresh profile so the form's defaults reset.
  return (
    <ProfileFields key={`${user.id}-${user.name}-${user.phone}-${user.avatarUrl}`} user={user} />
  );
}
