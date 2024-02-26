import { z } from "zod";

export const addCreditLimitSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});
export const updateCreditLimitSchema = addCreditLimitSchema;
