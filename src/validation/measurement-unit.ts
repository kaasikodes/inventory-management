import { z } from "zod";

export const addMeasurementUnitSchema = z.object({
  name: z.string(),
});
export const editMeasurementUnitSchema = addMeasurementUnitSchema;
