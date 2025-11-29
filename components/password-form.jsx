"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { passwordSchema } from "@/lib/schemas/password";
import { optionItems } from "@/lib/constants/option";

import {
  Field,
  FieldGroup,
  FieldSet,
  FieldLabel,
  FieldLegend,
  FieldError,
} from "@/components/ui/field";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function PasswordForm() {
  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      length: 8,
      quantity: 1,
      options: [],
    },
  });

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Password Generator</CardTitle>
      </CardHeader>

      <CardContent>
        <form id="rhf-password-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup className="grid grid-cols-2">
              <Controller
                name="length"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="rhf-password-form-length"
                      aria-invalid={fieldState.invalid}
                    >
                      Password Length
                    </FieldLabel>
                    <Input
                      {...field}
                      id="rhf-password-form-length"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="quantity"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="rhf-password-form-quantity"
                      aria-invalid={fieldState.invalid}
                    >
                      Quantity
                    </FieldLabel>
                    <Input
                      {...field}
                      id="rhf-password-form-quantity"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <FieldSet>
                <FieldLegend variant="label" className="text-sm">
                  <Label>Options</Label>
                </FieldLegend>
                <Controller
                  name="options"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FieldGroup data-slot="checkbox-group">
                      {optionItems.map((item) => {
                        const REQUIRED_OPTION_IDS = [
                          "uppercase",
                          "lowercase",
                          "number",
                          "symbol",
                        ];
                        const isRequired = REQUIRED_OPTION_IDS.includes(
                          item.id
                        );

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
                                  : field.value.filter(
                                      (value) => value !== item.id
                                    );
                                field.onChange(newValue);
                              }}
                              aria-invalid={fieldState.invalid && isRequired}
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

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldGroup>
                  )}
                />
              </FieldSet>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>

      <CardFooter>
        <Field className="grid grid-cols-3 *:cursor-pointer">
          <Button type="submit" form="rhf-password-form">
            Submit
          </Button>
          <Button variant="outline" type="button">
            Copy
          </Button>
          <Button variant="outline" type="button">
            Copy All
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
