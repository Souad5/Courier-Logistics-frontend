"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AppButton } from "@/components/shared/AppButton";
import { FormInput, FormSelect, type SelectOption } from "@/components/shared/form";
import { FieldGroup } from "@/components/ui/field";
import { useAuth } from "@/hooks/useAuth";

// Mirrors registerZodSchema in courier-backend/src/app/modules/auth/auth.validation.ts
const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  phone: z
    .string()
    .trim()
    .max(20)
    .refine((v) => v === "" || v.length >= 6, "Phone must be at least 6 characters"),
  role: z.enum(["CUSTOMER", "COURIER"]),
});

type RegisterValues = z.infer<typeof registerSchema>;

const ROLE_OPTIONS: SelectOption<RegisterValues["role"]>[] = [
  { value: "CUSTOMER", label: "Send parcels (Customer)" },
  { value: "COURIER", label: "Deliver parcels (Courier)" },
];

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const { control, handleSubmit } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", phone: "", role: "CUSTOMER" },
  });

  const onSubmit = ({ phone, ...values }: RegisterValues) =>
    registerUser.mutate({ ...values, phone: phone || undefined });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <FormInput control={control} name="name" label="Full name" autoComplete="name" required />
        <FormInput
          control={control}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
        />
        <FormInput
          control={control}
          name="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          description="Optional — helps couriers reach you."
        />
        <FormInput
          control={control}
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          description="At least 8 characters."
          required
        />
        <FormSelect control={control} name="role" label="I want to" options={ROLE_OPTIONS} />
        <AppButton type="submit" className="w-full" loading={registerUser.isPending}>
          Create account
        </AppButton>
      </FieldGroup>
    </form>
  );
}
