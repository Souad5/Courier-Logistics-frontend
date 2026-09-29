"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AppButton } from "@/components/shared/AppButton";
import { FormInput } from "@/components/shared/form";
import { FieldGroup } from "@/components/ui/field";
import { useAuth } from "@/hooks/useAuth";

// Mirrors loginZodSchema in courier-backend/src/app/modules/auth/auth.validation.ts
const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const { control, handleSubmit } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <form onSubmit={handleSubmit((values) => login.mutate(values))} noValidate>
      <FieldGroup>
        <FormInput
          control={control}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          leftIcon={<Mail />}
        />
        <FormInput
          control={control}
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          leftIcon={<Lock />}
        />
        <AppButton type="submit" className="w-full" loading={login.isPending}>
          Log in
        </AppButton>
      </FieldGroup>
    </form>
  );
}
