"use client";

import { FieldGroup, FieldSet } from "@/components/ui/field";

import { FieldCheckbox } from "@/components/field-checkbox";
import { FieldInput } from "@/components/field-input";

export function PasswordForm({ form, onSubmit }) {
  return (
    <form id="rhf-password-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup className="grid md:grid-cols-2">
          <FieldInput
            name="length"
            control={form.control}
            title="Password Length"
          />

          <FieldInput name="quantity" control={form.control} title="Quantity" />
        </FieldGroup>

        <FieldCheckbox title="Options" name="options" control={form.control} />
      </FieldSet>
    </form>
  );
}
