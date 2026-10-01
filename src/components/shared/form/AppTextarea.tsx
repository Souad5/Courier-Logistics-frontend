"use client";

import { type ChangeEvent, type ComponentProps, type ReactNode, useId, useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { AppField, fieldA11yProps } from "./AppField";

export interface AppTextareaProps extends ComponentProps<typeof Textarea> {
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  /** Show a "used / maxLength" counter (requires `maxLength`). */
  showCount?: boolean;
  containerClassName?: string;
}

/** shadcn <Textarea> with label, description, error and an optional character counter. */
export function AppTextarea({
  id,
  label,
  description,
  error,
  showCount = false,
  maxLength,
  containerClassName,
  className,
  required,
  onChange,
  value,
  defaultValue,
  ...props
}: AppTextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  // Tracked locally so the counter also works for uncontrolled inputs (RHF register()).
  const [length, setLength] = useState(() => String(value ?? defaultValue ?? "").length);
  const count = value !== undefined ? String(value).length : length;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setLength(event.target.value.length);
    onChange?.(event);
  };

  return (
    <AppField
      htmlFor={textareaId}
      label={label}
      description={description}
      error={error}
      required={required}
      className={containerClassName}
    >
      <Textarea
        id={textareaId}
        maxLength={maxLength}
        required={required}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        className={className}
        {...fieldA11yProps(textareaId, error)}
        {...props}
      />
      {showCount && maxLength && (
        <p
          className={cn(
            "text-muted-foreground -mt-1 text-right text-sm tabular-nums",
            count >= maxLength && "text-destructive",
          )}
          aria-live="polite"
        >
          {count}/{maxLength}
        </p>
      )}
    </AppField>
  );
}
