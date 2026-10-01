"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AppButton } from "@/components/shared/AppButton";
import { FormInput, FormTextarea } from "@/components/shared/form";
import { FieldGroup } from "@/components/ui/field";
import { useI18n } from "@/i18n/client";
import type { Dictionary } from "@/i18n/dictionaries";
import type { interpolate } from "@/i18n/format";

const MESSAGE_MAX = 1000;

const MESSAGE_MIN = 10;

const makeContactSchema = (t: Dictionary, format: typeof interpolate) =>
  z.object({
    name: z.string().trim().min(2, t.publicPages.contact.form.nameRequired),
    email: z.email(t.validation.email),
    message: z
      .string()
      .trim()
      .min(MESSAGE_MIN, format(t.publicPages.contact.form.messageMin, { n: MESSAGE_MIN }))
      .max(MESSAGE_MAX, format(t.validation.maxChars, { n: MESSAGE_MAX })),
  });

type ContactValues = z.infer<ReturnType<typeof makeContactSchema>>;

/**
 * The backend has no contact endpoint, so submissions are validated and
 * acknowledged client-side only.
 */
export function ContactForm() {
  const { t, format } = useI18n();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(makeContactSchema(t, format)),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async () => {
    toast.success(t.publicPages.contact.form.success);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <FormInput control={control} name="name" label={t.publicPages.contact.form.name} required />
        <FormInput
          control={control}
          name="email"
          label={t.publicPages.contact.form.email}
          type="email"
          required
        />
        <FormTextarea
          control={control}
          name="message"
          label={t.publicPages.contact.form.message}
          rows={5}
          maxLength={MESSAGE_MAX}
          showCount
          required
        />
        <AppButton type="submit" loading={isSubmitting} rightIcon={<Send />}>
          {t.publicPages.contact.form.submit}
        </AppButton>
      </FieldGroup>
    </form>
  );
}
