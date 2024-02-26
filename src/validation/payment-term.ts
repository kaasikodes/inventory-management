import { z } from "zod";

export const addPaymentTermSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});
export const updatePaymentTermSchema = addPaymentTermSchema;
