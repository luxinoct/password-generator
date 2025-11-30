"use client";

import { Controller } from "react-hook-form";
import {
  Field,
  FieldGroup,
  FieldSet,
  FieldLabel,
  FieldError,
  FieldLegend,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { optionItems } from "@/lib/constants/option";

export function FieldCheckbox({ title, name, control }) {
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend variant="label" className="text-sm">
          {title}
        </FieldLegend>
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <FieldGroup data-slot="checkbox-group">
              {optionItems.map((item) => {
                const REQUIRED_OPTION_IDS = [
                  "uppercase",
                  "lowercase",
                  "number",
                  "symbol",
                ];
                const isRequired = REQUIRED_OPTION_IDS.includes(item.id);

                return (
                  <Field
                    key={item.id}
                    orientation="horizontal"
                    data-invalid={fieldState.invalid && isRequired}
                  >
                    <Checkbox
                      id={`rhf-password-form-${item.id}`}
                      checked={field.value.includes(item.id)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...field.value, item.id]
                          : field.value.filter((value) => value !== item.id);
                        field.onChange(newValue);
                      }}
                      aria-invalid={fieldState.invalid && isRequired}
                      className="cursor-pointer"
                    />

                    <FieldLabel
                      htmlFor={`rhf-password-form-${item.id}`}
                      aria-invalid={fieldState.invalid && isRequired}
                      className="font-normal"
                    >
                      {item.title}
                    </FieldLabel>
                  </Field>
                );
              })}

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldGroup>
          )}
        />
      </FieldSet>
    </FieldGroup>
  );
}
