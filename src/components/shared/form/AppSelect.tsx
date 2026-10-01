"use client";

import { type ReactNode, useId } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { AppField, fieldA11yProps } from "./AppField";

export interface SelectOption<V extends string = string> {
  value: V;
  label: ReactNode;
  disabled?: boolean;
}

export interface AppSelectProps<V extends string = string> {
  id?: string;
  options: SelectOption<V>[];
  value?: V;
  onValueChange?: (value: V) => void;
  placeholder?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  onBlur?: () => void;
  className?: string;
  containerClassName?: string;
  /** Accessible name when there is no visible label. */
  ariaLabel?: string;
}

/**
 * shadcn <Select> driven by an `options` array, with label/description/error.
 * It's a controlled component — with react-hook-form use <FormSelect> (or a <Controller>).
 */
export function AppSelect<V extends string = string>({
  id,
  options,
  value,
  onValueChange,
  placeholder = "Select…",
  label,
  description,
  error,
  required,
  disabled,
  name,
  onBlur,
  className,
  containerClassName,
  ariaLabel,
}: AppSelectProps<V>) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <AppField
      htmlFor={selectId}
      label={label}
      description={description}
      error={error}
      required={required}
      className={containerClassName}
    >
      <Select
        // "" means "nothing selected" so the placeholder shows.
        value={value ?? ""}
        onValueChange={(v) => onValueChange?.(v as V)}
        disabled={disabled}
        name={name}
        required={required}
        onOpenChange={(open) => !open && onBlur?.()}
      >
        <SelectTrigger
          id={selectId}
          className={cn(
            "w-full transition-all duration-150",
            "hover:border-input/80 hover:bg-accent/30",
            "focus-visible:ring-2 focus-visible:ring-offset-1",
            disabled && "cursor-not-allowed opacity-60",
            error && "border-destructive/80 bg-destructive/5",
            className,
          )}
          aria-label={ariaLabel}
          {...fieldA11yProps(selectId, error)}
        >
          <SelectValue
            placeholder={<span className="text-muted-foreground font-normal">{placeholder}</span>}
          />
        </SelectTrigger>
        <SelectContent className="min-w-[var(--radix-select-trigger-width)]">
          {options.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No options available
            </div>
          ) : (
            options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={cn("cursor-pointer", option.disabled && "cursor-not-allowed opacity-50")}
              >
                <span className="flex items-center gap-2">{option.label}</span>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </AppField>
  );
}
