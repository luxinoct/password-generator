"use client";

import { useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { FieldCheckbox } from "./field-checkbox";
import { FieldInput } from "./field-input";

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

  const { generate, copySingle, copyAll, passwords, copiedIndex } =
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
  const onSubmit = () => {
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

      <CardContent className="grid gap-6 shrink-0">
        <form id="rhf-password-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup className="grid md:grid-cols-2">
              <FieldInput
                name="length"
                control={form.control}
                title="Password Length"
              />

              <FieldInput
                name="quantity"
                control={form.control}
                title="Quantity"
              />
            </FieldGroup>

            <FieldCheckbox
              title="Options"
              name="options"
              control={form.control}
            />
          </FieldSet>
        </form>

        <Field className="grid grid-cols-3 gap-2 *:cursor-pointer">
          <Button type="submit" form="rhf-password-form">
            Generate
          </Button>
          <Button variant="outline" onClick={copySingle}>
            Copy
          </Button>
          <Button variant="outline" onClick={copyAll}>
            Copy All
          </Button>
        </Field>
      </CardContent>

      <CardFooter>
        <ScrollArea className="h-full max-h-[50vh] w-full overflow-auto rounded-md border">
          <div className="p-4 space-y-1">
            {passwords.map((item, index) => {
              const highlighted =
                copiedIndex === "all" || copiedIndex === index;

              return (
                <div key={index} className={highlighted ? "bg-accent" : ""}>
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
