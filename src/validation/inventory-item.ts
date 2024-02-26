import { z } from "zod";

export const addInventoryItemSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  growthPeriodInSecs: z.number().min(0),
  minStockThreshold: z.number().min(0),
  measurementUnitId: z.string(),
  inputOutputRatio: z.object({
    input: z.number().min(0),
    output: z.number().min(0),
  }),
});

export const importInventoryItemsSchema = z.object({
  data: z.array(
    z.object({
      name: z.string().min(3),
      description: z.string().optional(),
      growthPeriodInSecs: z.number().min(0),
      minStockThreshold: z.number().min(0),
      measurementUnitId: z.string(),
      inputOutputRatioId: z.string(),
    })
  ),
});
export const editInventoryItemSchema = addInventoryItemSchema;
