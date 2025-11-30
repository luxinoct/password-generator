import { z } from "zod";

export const passwordSchema = z.object({
  length: z.coerce
    .number()
    .min(4, "Password length must be at least 4 characters.")
    .max(32, "Password length cannot exceed 32 characters."),

  quantity: z.coerce
    .number()
    .min(1, "You must generate at least 1 password.")
    .max(5000, "You can generate up to 5000 passwords at a time."),

  options: z.array(z.string()).refine(
    (value) => {
      const required = ["uppercase", "lowercase", "number", "symbol"];
      return value.some((id) => required.includes(id));
    },
    {
      message:
        "Please select at least one character type: Uppercase, Lowercase, Numbers, or Symbols.",
    }
  ),
});
