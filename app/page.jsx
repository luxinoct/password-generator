"use client";

import { useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { passwordSchema } from "@/lib/schemas/password";
import { usePasswordGenerator } from "@/hooks/use-password-generator";
import { useFormPersistence } from "@/hooks/use-form-persistence";

import { PasswordForm } from "@/components/password-form";
import { PasswordResult } from "@/components/password-result";

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-accent">
      <div className="grid md:grid-cols-2 gap-4 w-full">
        <PasswordForm
          form={form}
          onSubmit={onSubmit}
          onCopySingle={copySingle}
          onCopyAll={copyAll}
        />

        <PasswordResult
          displayRef={displayRef}
          passwords={passwords}
          copiedIndex={copiedIndex}
        />
      </div>
    </div>
  );
}
