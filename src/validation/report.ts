import { z } from "zod";
export const editReportSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});

const baseReportSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  produceDateDuration: z
    .object({
      from: z.string().datetime(),
      to: z.string().datetime(),
    })
    .optional(),
  supplyEntryDateDuration: z
    .object({
      from: z.string().datetime(),
      to: z.string().datetime(),
    })
    .optional(),
  consumptionDateDuration: z
    .object({
      from: z.string().datetime(),
      to: z.string().datetime(),
    })
    .optional(),
  type: z
    .enum(["INVENTORY_CONSUMPTION", "INVENTORY_SUPPLY"])
    .optional()
    .default("INVENTORY_CONSUMPTION"),
  inventoryItemIds: z.array(z.string()).optional(),
  addedByIds: z.array(z.string()).optional(),
  conditionIds: z.array(z.string()).optional(),
});
export const generateReportSchema = baseReportSchema
  .refine(
    ({ consumptionDateDuration }) => {
      if (!consumptionDateDuration) return true;
      const { from, to } = consumptionDateDuration;
      // Check if endDate is after startDate
      return new Date(from) < new Date(to);
    },
    {
      message: "Consumption End date must be before the start date",
      path: ["to"],
    }
  )
  .refine(
    ({ produceDateDuration }) => {
      if (!produceDateDuration) return true;
      const { from, to } = produceDateDuration;
      // Check if endDate is after startDate
      return new Date(from) < new Date(to);
    },
    {
      message: "Produce End date must be before the start date",
      path: ["to"],
    }
  );
