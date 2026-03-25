"use client";

import { useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

import { usePasswordGenerator } from "@/hooks/use-password-generator";
import { useFormPersistence } from "@/hooks/use-form-persistence";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { OptionChekbox } from "./option-checkbox";

const formSchema = z.object({
  length: z.coerce
    .number({ error: "Password length must be a number" })
    .min(4, "Password length must be at least 4 characters")
    .max(32, "Password length cannot exceed 32 characters"),

  quantity: z.coerce
    .number({ error: "Quantity must be a number" })
    .min(1, "You must generate at least 1 password")
    .max(5000, "You can generate up to 5000 passwords at a time"),
  options: z.array(z.string()).refine(
    (value) => {
      const required = ["uppercase", "lowercase", "number", "symbol"];
      return value.some((id) => required.includes(id));
    },
    {
      error: "Select at least one character type",
    },
  ),
});

export function GeneratePasswordForm() {
  const [formReady, setFormReady] = useState(false);
  const {
    passwords,
    copiedItemIndex,
    generatePasswords,
    copyNextPassword,
    copyAllPasswords,
  } = usePasswordGenerator();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      length: 8,
      quantity: 1,
      options: [
        "uppercase",
        "lowercase",
        "number",
        "symbol",
        "beginWithLetter",
        "excludeDuplicate",
        "excludeSimilar",
      ],
    },
  });

  // Load saved settings if available
  useFormPersistence(form, formSchema, () => setFormReady(true));

  // Helper for generate
  const runGenerateFromForm = useCallback(() => {
    const { length, quantity, options } = form.getValues();
    generatePasswords({
      length,
      quantity,
      options: options.filter((opt) => opt !== "saveSetting"),
    });
  }, [form, generatePasswords]);

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
        <form onSubmit={form.handleSubmit(handleGenerate)}>
          <FieldSet>
            <FieldGroup className="grid md:grid-cols-2">
              <Controller
                name="length"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="length"
                      aria-invalid={fieldState.invalid}
                    >
                      Password Length
                    </FieldLabel>
                    <Input
                      {...field}
                      id="length"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      <FieldDescription>
                        Password length must be between 4 and 32
                      </FieldDescription>
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
                      htmlFor="quantity"
                      aria-invalid={fieldState.invalid}
                    >
                      Quantity
                    </FieldLabel>
                    <Input
                      {...field}
                      id="quantity"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      <FieldDescription>
                        Quantity must be between 1 and 5000
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <OptionChekbox name="options" control={form.control} />

            <Field className="grid grid-cols-3 gap-2 *:cursor-pointer">
              <Button type="submit">Generate</Button>
              <Button
                type="button"
                variant="outline"
                onClick={copyNextPassword}
              >
                Copy
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={copyAllPasswords}
              >
                Copy All
              </Button>
            </Field>
          </FieldSet>
        </form>
      </CardContent>

      <CardFooter>
        <ScrollArea className="h-full max-h-[50vh] w-full overflow-auto rounded-md border">
          <div className="p-4 space-y-1">
            {passwords.map((password, index) => {
              const highlighted =
                copiedItemIndex === "all" || copiedItemIndex === index;

              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md",
                    highlighted && "bg-accent/50",
                  )}
                >
                  <span className="text-muted-foreground">{index + 1}.</span>
                  <span className="font-mono">{password}</span>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardFooter>
    </Card>
  );
}
