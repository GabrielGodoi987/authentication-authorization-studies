import * as z from "zod";

export const loginSchema = z.object({
  email: z.email({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    error: "Email is not valid",
  }),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "A senha deve conter pelo menos 8 caracteres, uma letra maúscula e um número",
    ),
});

export type LoginSchema = z.infer<typeof loginSchema>;
