"use client";

import { useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { passwordSchema } from "@/lib/schemas/password";
import { usePasswordGenerator } from "@/hooks/use-password-generator";
import { useFormPersistence } from "@/hooks/use-form-persistence";

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
import { PasswordForm } from "@/components/password-form";

export default function HomePage() {
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
  const onSubmit = () => {
    runGenerateFromForm();
  };

  if (!formReady) return null;

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-accent">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Password Generator
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 shrink-0">
          <PasswordForm form={form} onSubmit={onSubmit} />

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
    </div>
  );
}
