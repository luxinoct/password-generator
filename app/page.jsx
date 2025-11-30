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
import { ScrollArea } from "@radix-ui/react-scroll-area";
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
    <div className="flex min-h-screen justify-center md:h-screen p-4 bg-accent">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Password Generator
          </CardTitle>
        </CardHeader>

        <CardContent>
          <PasswordForm form={form} onSubmit={onSubmit} />
        </CardContent>

        <CardFooter className="flex flex-col gap-6 flex-1 min-h-0">
          <Field className="grid grid-cols-3 *:cursor-pointer">
            <Button type="submit" form="rhf-password-form">
              Generate
            </Button>
            <Button variant="outline" type="button" onClick={copySingle}>
              Copy
            </Button>
            <Button variant="outline" type="button" onClick={copyAll}>
              Copy All
            </Button>
          </Field>

          {/* Scrollable container */}
          <div className="w-full flex-1 min-h-0 max-h-[50vh] md:max-h-screen">
            <ScrollArea className="h-full overflow-auto rounded-md border">
              <div className="space-y-1 p-2" ref={displayRef}>
                {passwords.map((item, index) => (
                  <PasswordItem
                    key={index}
                    item={item}
                    highlighted={copiedIndex === "all" || copiedIndex === index}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function PasswordItem({ item, highlighted }) {
  return <p className={highlighted ? "bg-accent" : ""}>{item}</p>;
}
