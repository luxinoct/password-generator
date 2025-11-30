"use client";

import { Controller } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function FieldInput({ name, control, title }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel
            htmlFor={`rhf-password-form-${name}`}
            aria-invalid={fieldState.invalid}
          >
            {title}
          </FieldLabel>
          <Input
            {...field}
            id={`rhf-password-form-${name}`}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
