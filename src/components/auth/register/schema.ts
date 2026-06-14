import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().optional(),
  surname: z.string().optional(),
  email: z
    .string()
    .min(1, "auth.errors.emailRequired")
    .email("auth.errors.emailInvalid"),
  password: z
    .string()
    .min(1, "auth.errors.passwordRequired")
    .min(6, "auth.errors.passwordTooShort"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;