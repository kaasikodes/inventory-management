import { z } from "zod";

export const addInventoryConsumptionSchema = z.object({
  inventoryItemId: z.string(),
  quantityToBeConsumed: z.number().min(0),
  dateConsumed: z.string().datetime().optional(),
});
export const updateInventoryConsumptionProduceInfoSchema = z.object({
  amountProduced: z.number().min(0),
  dateProduceWasRealized: z.string().datetime(),
  produceConditionId: z.string(),
});
