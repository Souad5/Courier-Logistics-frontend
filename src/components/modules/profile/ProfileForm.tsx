"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AppButton } from "@/components/shared/AppButton";
import { FormInput } from "@/components/shared/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateProfile } from "@/hooks/useUsers";
import { useI18n } from "@/i18n/client";
import type { Dictionary } from "@/i18n/dictionaries";
import { initials } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import type { User } from "@/types";

// Built per render so the messages follow the active language.
const createProfileSchema = (t: Dictionary) =>
  z.object({
    name: z.string().trim().min(2, t.profile.errors.nameMin).max(60),
    phone: z.union([
      z.literal(""),
      z.string().trim().min(6, t.profile.errors.tooShort).max(20, t.profile.errors.tooLong),
    ]),
    avatarUrl: z.union([z.literal(""), z.url(t.profile.errors.url)]),
  });

type ProfileValues = z.infer<ReturnType<typeof createProfileSchema>>;

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
  const { t, f, format } = useI18n();
  const { control, handleSubmit, formState, setValue } = useForm<ProfileValues>({
    resolver: zodResolver(createProfileSchema(t)),
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
    if (!file.type.startsWith("image/")) return toast.error(t.validation.imageType);
    if (file.size > MAX_FILE_BYTES) {
      return toast.error(format(t.validation.imageSize, { n: f.number(5) }));
    }
    try {
      setValue("avatarUrl", await imageToAvatarDataUrl(file), { shouldDirty: true });
    } catch {
      toast.error(t.validation.imageRead);
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
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:row-span-2">
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <Avatar className="size-24">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={user.name} />}
            <AvatarFallback className="text-2xl">{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-muted-foreground text-sm break-all">{user.email}</p>
          </div>
          <Badge variant="secondary">{t.enums.role[user.role]}</Badge>
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
            leftIcon={<Camera />}
            onClick={() => fileInput.current?.click()}
          >
            {t.profile.uploadPhoto}
          </AppButton>
          <p className="text-muted-foreground text-sm">{t.profile.photoHint}</p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{t.profile.personal.title}</CardTitle>
          <CardDescription>{t.profile.personal.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                control={control}
                name="name"
                label={t.profile.personal.fullName}
                required
              />
              <FormInput
                control={control}
                name="phone"
                label={t.profile.personal.phone}
                type="tel"
                placeholder="+8801XXXXXXXXX"
              />
            </div>
            <div className="flex justify-end border-t pt-4">
              <AppButton type="submit" loading={update.isPending} disabled={!formState.isDirty}>
                {t.profile.personal.save}
              </AppButton>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{t.profile.account.title}</CardTitle>
          <CardDescription>{t.profile.account.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="bg-border grid gap-px overflow-hidden rounded-lg border sm:grid-cols-2">
            <AccountItem label={t.profile.account.email} value={user.email} />
            <AccountItem label={t.profile.account.role} value={t.enums.role[user.role]} />
            <AccountItem
              label={t.profile.account.signIn}
              value={
                user.provider === "GOOGLE" ? t.profile.account.google : t.profile.account.password
              }
            />
            <AccountItem label={t.profile.account.memberSince} value={f.date(user.createdAt)} />
            <AccountItem
              label={t.profile.account.emailVerified}
              value={user.isEmailVerified ? t.profile.account.yes : t.profile.account.notYet}
            />
            <AccountItem label={t.profile.account.status} value={t.enums.userStatus[user.status]} />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

function AccountItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card space-y-1 p-4">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="text-sm font-medium break-all">{value}</dd>
    </div>
  );
}

export function ProfileForm() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  if (!hydrated || !user) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl lg:col-span-2" />
      </div>
    );
  }

  // Remount when the server returns a fresh profile so the form's defaults reset.
  return (
    <ProfileFields key={`${user.id}-${user.name}-${user.phone}-${user.avatarUrl}`} user={user} />
  );
}
