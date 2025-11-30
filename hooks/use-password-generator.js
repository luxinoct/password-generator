import { useState, useRef, useCallback, useEffect } from "react";
import { copyToClipboard, generatePassword } from "@/lib/utils";

export function usePasswordGenerator() {
  const [passwords, setPasswords] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const displayRef = useRef(null);

  // -----------------------------
  // SCROLL HELPERS
  // -----------------------------
  const scrollToTop = useCallback(() => {
    displayRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToIndex = useCallback((index) => {
    const list = displayRef.current;
    if (!list || !list.children?.[index]) return;

    list.children[index].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, []);

  // -----------------------------
  // GENERATE PASSWORDS
  // -----------------------------
  const generate = useCallback(
    ({ length, quantity, options }) => {
      const optionMap = Object.fromEntries(options.map((opt) => [opt, true]));

      const generated = Array.from({ length: quantity }, () =>
        generatePassword(optionMap, length)
      );

      setPasswords(generated);
      setCopiedIndex(null);
      scrollToTop();
    },
    [scrollToTop]
  );

  // -----------------------------
  // COPY ONE PASSWORD
  // -----------------------------
  const copySingle = useCallback(async () => {
    if (passwords.length === 0) return;

    const nextIndex =
      copiedIndex !== null && copiedIndex !== "all"
        ? (copiedIndex + 1) % passwords.length
        : 0;

    const didCopy = await copyToClipboard(passwords[nextIndex]);
    if (didCopy) setCopiedIndex(nextIndex);
  }, [passwords, copiedIndex]);

  // -----------------------------
  // COPY ALL PASSWORDS
  // -----------------------------
  const copyAll = useCallback(async () => {
    if (!passwords.length) return;

    const didCopy = await copyToClipboard(passwords.join("\n"));
    if (didCopy) {
      setCopiedIndex("all");
      scrollToTop();
    }
  }, [passwords, scrollToTop]);

  // -----------------------------
  // AUTO-SCROLL WHEN COPY CHANGES
  // -----------------------------
  useEffect(() => {
    if (typeof copiedIndex === "number") {
      scrollToIndex(copiedIndex);
    }
  }, [copiedIndex, scrollToIndex]);

  return {
    passwords,
    copiedIndex,
    displayRef,
    generate,
    copySingle,
    copyAll,
  };
}
