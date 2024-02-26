import { z } from "zod";
import { addUserSchema, editUserSchema } from "./user";

export const createSupplierProfileSchema = z.object({
  userInfo: addUserSchema,
  creditLimitId: z.string(),
  paymentTermId: z.string(),
});
export const updateSupplierProfileSchema = z.object({
  userInfo: editUserSchema.optional(),
  creditLimitId: z.string().optional(),
  paymentTermId: z.string().optional(),
});
