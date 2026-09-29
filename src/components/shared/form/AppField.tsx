import type { ReactNode } from "react";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

export interface AppFieldProps {
  /** id of the control inside, so the label focuses it. */
  htmlFor?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Label + control + description/error layout shared by AppInput, AppTextarea
 * and AppSelect. Use it directly to give any custom control the same frame.
 */
export function AppField({
  htmlFor,
  label,
  description,
  error,
  required,
  className,
  children,
}: AppFieldProps) {
  return (
    <Field data-invalid={!!error || undefined} className={className}>
      {label && (
        <FieldLabel htmlFor={htmlFor}>
          {label}
          {required && (
            <span className="text-destructive" aria-hidden>
              *
            </span>
          )}
        </FieldLabel>
      )}
      {children}
      {description && !error && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError id={htmlFor ? `${htmlFor}-error` : undefined}>{error}</FieldError>}
    </Field>
  );
}

/** aria props that link a control to its AppField error message. */
export function fieldA11yProps(id: string, error?: string) {
  return {
    "aria-invalid": !!error || undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  };
}
