import { z } from "zod";

export const deleteMessageSchema = z.object({
  id: z.string(),
});
