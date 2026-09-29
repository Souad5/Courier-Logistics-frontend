"use client";

import { type Control, type FieldPath, type FieldValues, useController } from "react-hook-form";

import { AppInput, type AppInputProps } from "./AppInput";
import { AppSelect, type AppSelectProps } from "./AppSelect";
import { AppTextarea, type AppTextareaProps } from "./AppTextarea";

/**
 * react-hook-form bindings for the App* fields: pass `control` and `name`, and
 * value, onChange, onBlur, ref and the error message are wired automatically.
 *
 *   const { control, handleSubmit } = useForm<Values>({ resolver: zodResolver(schema) });
 *   <FormInput control={control} name="email" label="Email" type="email" />
 */

interface ControlProps<T extends FieldValues, N extends FieldPath<T>> {
  control: Control<T>;
  name: N;
}

type Bound = "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "error" | "ref";

export function FormInput<T extends FieldValues, N extends FieldPath<T>>({
  control,
  name,
  ...props
}: ControlProps<T, N> & Omit<AppInputProps, Bound>) {
  const {
    field: { ref, value, onChange, onBlur, name: fieldName },
    fieldState,
  } = useController({
    control,
    name,
  });
  const isNumber = props.type === "number";

  return (
    <AppInput
      {...props}
      name={fieldName}
      ref={ref}
      onBlur={onBlur}
      value={value ?? ""}
      // Number inputs hand back numbers (or undefined when empty) so zod `z.number()` validates.
      onChange={(event) =>
        onChange(
          isNumber
            ? event.target.value === ""
              ? undefined
              : event.target.valueAsNumber
            : event.target.value,
        )
      }
      error={fieldState.error?.message}
    />
  );
}

export function FormTextarea<T extends FieldValues, N extends FieldPath<T>>({
  control,
  name,
  ...props
}: ControlProps<T, N> & Omit<AppTextareaProps, Bound>) {
  const {
    field: { ref, value, onChange, onBlur, name: fieldName },
    fieldState,
  } = useController({
    control,
    name,
  });

  return (
    <AppTextarea
      {...props}
      name={fieldName}
      ref={ref}
      onBlur={onBlur}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
      error={fieldState.error?.message}
    />
  );
}

export function FormSelect<
  T extends FieldValues,
  N extends FieldPath<T>,
  V extends string = string,
>({
  control,
  name,
  ...props
}: ControlProps<T, N> &
  Omit<AppSelectProps<V>, "name" | "value" | "onValueChange" | "onBlur" | "error">) {
  const {
    field: { value, onChange, onBlur, name: fieldName },
    fieldState,
  } = useController({
    control,
    name,
  });

  return (
    <AppSelect<V>
      {...props}
      name={fieldName}
      value={value}
      onValueChange={onChange}
      onBlur={onBlur}
      error={fieldState.error?.message}
    />
  );
}
