"use client";

import { Eye, EyeOff } from "lucide-react";
import { type ComponentProps, type ReactNode, useId, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { AppField, fieldA11yProps } from "./AppField";

export interface AppInputProps extends ComponentProps<typeof Input> {
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  /** Icon inside the input, on the left (decorative). */
  leftIcon?: ReactNode;
  /** Icon or small element inside the input, on the right. */
  rightElement?: ReactNode;
  /** Classes for the surrounding field (the input itself takes `className`). */
  containerClassName?: string;
}

/**
 * shadcn <Input> with label, description, error and icon slots.
 * `type="password"` gets a show/hide toggle automatically.
 * Works with react-hook-form's `register()` (React 19 passes `ref` as a prop).
 */
export function AppInput({
  id,
  label,
  description,
  error,
  leftIcon,
  rightElement,
  containerClassName,
  className,
  type,
  required,
  ...props
}: AppInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const trailing = isPassword ? (
    <button
      type="button"
      onClick={() => setShowPassword((v) => !v)}
      className="text-muted-foreground hover:text-foreground pointer-events-auto rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      aria-label={showPassword ? "Hide password" : "Show password"}
      tabIndex={-1}
    >
      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  ) : (
    rightElement
  );

  return (
    <AppField
      htmlFor={inputId}
      label={label}
      description={description}
      error={error}
      required={required}
      className={containerClassName}
    >
      <div className="relative">
        {leftIcon && (
          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 left-2.5 flex items-center [&_svg]:size-4">
            {leftIcon}
          </span>
        )}
        <Input
          id={inputId}
          type={isPassword && showPassword ? "text" : type}
          required={required}
          className={cn(leftIcon && "pl-8", trailing && "pr-9", className)}
          {...fieldA11yProps(inputId, error)}
          {...props}
        />
        {trailing && (
          <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center [&_svg]:size-4">
            {trailing}
          </span>
        )}
      </div>
    </AppField>
  );
}
