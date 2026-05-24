import { useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

const storageKey = "settings";

export function useFormPersistence(
  form: UseFormReturn<{
    length: number;
    options: string[];
  }>,
  schema: z.ZodObject<{
    length: z.ZodNumber;
    options: z.ZodArray<z.ZodString>;
  }>,
  onReady?: () => void,
) {
  const hasInitialized = useRef(false);

  // Load saved data on mount (only once)
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        onReady?.();
        return;
      }

      const parsed = JSON.parse(raw);
      const result = schema.safeParse(parsed);
      if (result.success) {
        form.reset(result.data);
      }
    } catch (err) {
      console.warn("Failed to parse saved form data:", err);
    } finally {
      onReady?.();
    }
  }, [form, schema, onReady]); //  Run only once on mount

  // Watch and persist form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      try {
        const isSaveEnabled = value?.options?.includes("save");

        if (isSaveEnabled) {
          localStorage.setItem(storageKey, JSON.stringify(value));
        } else {
          localStorage.removeItem(storageKey);
        }
      } catch (err) {
        throw err;
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);
}
