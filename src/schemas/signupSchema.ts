import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least of length 2 characters")
  .max(20, "Username must be of no more length than 20 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username must not contain special characters");

export const signupSchema = z.object({
  username: usernameValidation,
  fullname: z
    .string()
    .regex(/^[a-zA-Z0-9_-]+$/, "Name must not contain special characters"),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, "Password must be at least of length 8 characters"),
});

export type SignupInput = z.infer<typeof signupSchema>;
