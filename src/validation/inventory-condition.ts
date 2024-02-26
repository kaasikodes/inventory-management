import { z } from "zod";

export const addInventoryConditionSchema = z.object({
  name: z.string().min(3),
  rating: z.number().min(1).optional(),
});
export const editInventoryConditionSchema = addInventoryConditionSchema;
