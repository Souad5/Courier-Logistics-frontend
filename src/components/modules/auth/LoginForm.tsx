"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AppButton } from "@/components/shared/AppButton";
import { FormInput } from "@/components/shared/form";
import { FieldGroup } from "@/components/ui/field";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n/client";
import type { Dictionary } from "@/i18n/dictionaries";

// Mirrors loginZodSchema in courier-backend/src/app/modules/auth/auth.validation.ts.
// Built per render so the messages follow the active language.
const createLoginSchema = (t: Dictionary) =>
  z.object({
    email: z.email(t.auth.errors.invalidEmail),
    password: z.string().min(1, t.auth.errors.passwordRequired),
  });

type LoginValues = z.infer<ReturnType<typeof createLoginSchema>>;

export function LoginForm() {
  const { login } = useAuth();
  const { t } = useI18n();
  const { control, handleSubmit } = useForm<LoginValues>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: { email: "", password: "" },
  });

  return (
    <form onSubmit={handleSubmit((values) => login.mutate(values))} noValidate>
      <FieldGroup>
        <FormInput
          control={control}
          name="email"
          label={t.auth.fields.email}
          type="email"
          autoComplete="email"
          placeholder={t.auth.fields.emailPlaceholder}
          leftIcon={<Mail />}
        />
        <FormInput
          control={control}
          name="password"
          label={t.auth.fields.password}
          type="password"
          autoComplete="current-password"
          leftIcon={<Lock />}
        />
        <AppButton type="submit" className="w-full" loading={login.isPending}>
          {t.auth.login.submit}
        </AppButton>
      </FieldGroup>
    </form>
  );
}
