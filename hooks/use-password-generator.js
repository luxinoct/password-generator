import { useState, useRef, useCallback } from "react";

import { generatePassword } from "@/lib/generate-password";

export function usePasswordGenerator() {
  const [passwords, setPasswords] = useState([]);
  const [copiedItemIndex, setCopiedItemIndex] = useState(null);
  const containerRef = useRef(null);

  // Generate multiple passwords based on user configuration
  const generatePasswords = useCallback(
    ({ length, quantity, options }) => {
      // Convert options array into a lookup map
      const optionMap = Object.fromEntries(
        options.map((option) => [option, true]),
      );

      // Generate password list
      const generatedPasswords = Array.from({ length: quantity }, () =>
        generatePassword(optionMap, length),
      );

      setPasswords(generatedPasswords);
      setCopiedItemIndex(null);
    },
    [generatePassword],
  );

  // Copy a single password (cycles through list)
  const copyNextPassword = useCallback(async () => {
    if (!passwords.length) return;

    const nextIndex =
      copiedItemIndex !== null && copiedItemIndex !== "all"
        ? (copiedItemIndex + 1) % passwords.length
        : 0;

    try {
      await navigator.clipboard.writeText(passwords[nextIndex]);
      setCopiedItemIndex(nextIndex);
    } catch (error) {
      console.error(error);
    }
  }, [passwords, copiedItemIndex]);

  // Copy all passwords (newline separated)
  const copyAllPasswords = useCallback(async () => {
    if (!passwords.length) return;

    try {
      await navigator.clipboard.writeText(passwords.join("\n"));
      setCopiedItemIndex("all");
    } catch (error) {
      console.error(error);
    }
  }, [passwords]);

  return {
    passwords,
    copiedItemIndex,
    containerRef,
    generatePasswords,
    copyNextPassword,
    copyAllPasswords,
  };
}
