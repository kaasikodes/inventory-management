import { z } from "zod";
export const editReportSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});

const baseReportSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  produceDateDuration: z.object({
    from: z.string().datetime(),
    to: z.string().datetime(),
  }),
  consumptionDateDuration: z.object({
    from: z.string().datetime(),
    to: z.string().datetime(),
  }),
  type: z
    .enum(["INVENTORY_CONSUMPTION", "INVENTORY_SUPPLY"])
    .optional()
    .default("INVENTORY_CONSUMPTION"),
  inventoryItemIds: z.array(z.string()).optional(),
  addedByIds: z.array(z.string()).optional(),
  produceConditionIds: z.array(z.string()).optional(),
});
export const generateReportSchema = baseReportSchema
  .refine(
    ({ consumptionDateDuration: { from, to } }) => {
      // Check if endDate is before startDate
      return new Date(to) < new Date(from);
    },
    {
      message: "Consumption End date must be before the start date",
      path: ["endDate"],
    }
  )
  .refine(
    ({ produceDateDuration: { from, to } }) => {
      // Check if endDate is before startDate
      return new Date(to) < new Date(from);
    },
    {
      message: "Produce End date must be before the start date",
      path: ["endDate"],
    }
  );
