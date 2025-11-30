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
          render={({ field, fieldState }) => {
            return (
              <div className="flex flex-col gap-2">
                {/* Checkbox Grid */}
                <div className="grid md:grid-cols-2 gap-2">
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
                              : field.value.filter((v) => v !== item.id);
                            field.onChange(newValue);
                          }}
                          aria-invalid={fieldState.invalid && isRequired}
                          className="cursor-pointer"
                        />

                        <FieldLabel
                          htmlFor={`rhf-password-form-${item.id}`}
                          className="font-normal"
                          aria-invalid={fieldState.invalid && isRequired}
                        >
                          {item.title}
                        </FieldLabel>
                      </Field>
                    );
                  })}
                </div>

                {/* Error message full width below the grid */}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </div>
            );
          }}
        />
      </FieldSet>
    </FieldGroup>
  );
}
