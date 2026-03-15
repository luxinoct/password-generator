"use client";

import { useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { passwordSchema } from "../_schemas/password";
import { usePasswordGenerator } from "../_hooks/use-password-generator";
import { useFormPersistence } from "../_hooks/use-form-persistence";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { FieldCheckbox } from "./field-checkbox";
import { cn } from "@/lib/utils";

export function PasswordForm() {
  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      length: 8,
      quantity: 1,
      options: ["uppercase", "lowercase", "number", "symbol"],
    },
  });

  const [formReady, setFormReady] = useState(false);

  // Load saved settings if available
  useFormPersistence(form, passwordSchema, () => setFormReady(true));

  const { generate, copySingle, copyAll, passwords, copiedIndex, displayRef } =
    usePasswordGenerator();

  // Helper for generate
  const runGenerateFromForm = useCallback(() => {
    const { length, quantity, options } = form.getValues();
    generate({
      length,
      quantity,
      options: options.filter((opt) => opt !== "saveSetting"),
    });
  }, [form, generate]);

  // Generate password automatically once the form is ready
  useEffect(() => {
    if (!formReady) return;
    runGenerateFromForm();
  }, [formReady, runGenerateFromForm]);

  // Standard submit handler
  const handleGenerate = () => {
    runGenerateFromForm();
  };

  if (!formReady) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Password Generator
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          id="rhf-password-form"
          onSubmit={form.handleSubmit(handleGenerate)}
        >
          <FieldSet>
            <FieldGroup className="grid md:grid-cols-2">
              <Controller
                name="length"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={`rhf-password-form-length`}
                      aria-invalid={fieldState.invalid}
                    >
                      Password Length
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`rhf-password-form-length`}
                      aria-invalid={fieldState.invalid}
                      type="number"
                      autoComplete="off"
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
                      htmlFor={`rhf-password-form-quantity`}
                      aria-invalid={fieldState.invalid}
                    >
                      Quantity
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`rhf-password-form-quantity`}
                      aria-invalid={fieldState.invalid}
                      type="number"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldCheckbox
              title="Options"
              name="options"
              control={form.control}
            />

            <Field className="grid grid-cols-3 gap-2 *:cursor-pointer">
              <Button type="submit" form="rhf-password-form">
                Generate
              </Button>
              <Button type="button" variant="outline" onClick={copySingle}>
                Copy
              </Button>
              <Button type="button" variant="outline" onClick={copyAll}>
                Copy All
              </Button>
            </Field>
          </FieldSet>
        </form>
      </CardContent>

      <CardFooter>
        <ScrollArea
          className="h-full max-h-[50vh] w-full overflow-auto rounded-md border"
          viewportRef={displayRef}
        >
          <div className="p-4 space-y-0.5">
            {passwords.map((item, index) => {
              const highlighted =
                copiedIndex === "all" || copiedIndex === index;

              return (
                <div
                  key={index}
                  className={cn(highlighted ? "bg-accent/50" : "")}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardFooter>
    </Card>
  );
}
