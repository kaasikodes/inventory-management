import { z } from "zod";

export const addGenerationPeriodSchema = z
  .object({
    name: z.string().min(3),
    description: z.string().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  })
  .refine(
    ({ endDate, startDate }) => {
      // Check if endDate is before startDate
      return new Date(endDate) < new Date(startDate);
    },
    {
      message: "End date must be before the start date",
      path: ["endDate"],
    }
  );
export const updateGenerationPeriodSchema = addGenerationPeriodSchema;
