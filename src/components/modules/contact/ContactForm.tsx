"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AppButton } from "@/components/shared/AppButton";
import { FormInput, FormTextarea } from "@/components/shared/form";
import { FieldGroup } from "@/components/ui/field";

const MESSAGE_MAX = 1000;

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.email("Invalid email address"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(MESSAGE_MAX),
});

type ContactValues = z.infer<typeof contactSchema>;

/**
 * The backend has no contact endpoint, so submissions are validated and
 * acknowledged client-side only.
 */
export function ContactForm() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async () => {
    toast.success("Thanks! We'll get back to you shortly.");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <FormInput control={control} name="name" label="Name" required />
        <FormInput control={control} name="email" label="Email" type="email" required />
        <FormTextarea
          control={control}
          name="message"
          label="Message"
          rows={5}
          maxLength={MESSAGE_MAX}
          showCount
          required
        />
        <AppButton type="submit" loading={isSubmitting} rightIcon={<Send />}>
          Send message
        </AppButton>
      </FieldGroup>
    </form>
  );
}
