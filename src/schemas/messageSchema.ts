import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Message content must be at least of 10 characters")
    .max(500, "Message content must be of at most 500 characters"),
});
