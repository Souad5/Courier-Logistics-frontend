"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AppButton } from "@/components/shared/AppButton";
import { FormInput, FormSelect, type SelectOption } from "@/components/shared/form";
import { FieldGroup } from "@/components/ui/field";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n/client";
import type { Dictionary } from "@/i18n/dictionaries";

// Mirrors registerZodSchema in courier-backend/src/app/modules/auth/auth.validation.ts.
// Built per render so the messages follow the active language.
const createRegisterSchema = (t: Dictionary) =>
  z.object({
    name: z.string().trim().min(2, t.auth.errors.nameMin).max(60),
    email: z.email(t.auth.errors.invalidEmail),
    password: z.string().min(8, t.auth.errors.passwordMin).max(72),
    phone: z
      .string()
      .trim()
      .max(20)
      .refine((v) => v === "" || v.length >= 6, t.auth.errors.phoneMin),
    role: z.enum(["CUSTOMER", "COURIER"]),
  });

type RegisterValues = z.infer<ReturnType<typeof createRegisterSchema>>;

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const { t } = useI18n();
  const roleOptions: SelectOption<RegisterValues["role"]>[] = [
    { value: "CUSTOMER", label: t.auth.register.roleCustomer },
    { value: "COURIER", label: t.auth.register.roleCourier },
  ];
  const { control, handleSubmit } = useForm<RegisterValues>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: { name: "", email: "", password: "", phone: "", role: "CUSTOMER" },
  });

  const onSubmit = ({ phone, ...values }: RegisterValues) =>
    registerUser.mutate({ ...values, phone: phone || undefined });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <FormInput
          control={control}
          name="name"
          label={t.auth.fields.fullName}
          autoComplete="name"
          required
        />
        <FormInput
          control={control}
          name="email"
          label={t.auth.fields.email}
          type="email"
          autoComplete="email"
          required
        />
        <FormInput
          control={control}
          name="phone"
          label={t.auth.fields.phone}
          type="tel"
          autoComplete="tel"
          description={t.auth.register.phoneHint}
        />
        <FormInput
          control={control}
          name="password"
          label={t.auth.fields.password}
          type="password"
          autoComplete="new-password"
          description={t.auth.register.passwordHint}
          required
        />
        <FormSelect
          control={control}
          name="role"
          label={t.auth.register.roleLabel}
          options={roleOptions}
        />
        <AppButton type="submit" className="w-full" loading={registerUser.isPending}>
          {t.auth.register.submit}
        </AppButton>
      </FieldGroup>
    </form>
  );
}
