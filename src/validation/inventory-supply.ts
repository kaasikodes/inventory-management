import { z } from "zod";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const addSupplyRecordSchema = z.object({
  totalAmount: z.number().min(0),
  conditionId: z.string(),
  entryDate: z.string().datetime().optional(),
  inventoryItemId: z.string(),
  supplierProfileId: z.string().optional(),
  physicalParameters: z
    .array(
      z.object({
        property: z.string(),
        value: z.string().or(z.number()),
      })
    )
    .optional(),
});
export const updateSupplyRecordTotalAmountSchema = addSupplyRecordSchema.pick({
  totalAmount: true,
});
export const updateSupplyRecordSupplierSchema = addSupplyRecordSchema
  .pick({
    supplierProfileId: true,
  })
  .required();
export const updateSupplyRecordConditionSchema = addSupplyRecordSchema.pick({
  conditionId: true,
});
export const updateSupplyRecordEntryDateSchema = addSupplyRecordSchema
  .pick({
    entryDate: true,
  })
  .required();
export const updateSupplyRecordPhysicalParamsSchema = addSupplyRecordSchema
  .pick({ physicalParameters: true })
  .required();
