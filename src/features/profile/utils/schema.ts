import { z } from "zod";

const optionalText = z.union([z.literal(""), z.string()]).optional();
const optionalEmail = z.union([z.literal(""), z.string().email("auth.errors.emailInvalid")]);
const optionalPassword = z.union([
  z.literal(""),
  z.string().min(6, "auth.errors.passwordTooShort"),
]);

export const profileSchema = z.object({
  name: optionalText,
  surname: optionalText,
  email: optionalEmail,
  password: optionalPassword,
});