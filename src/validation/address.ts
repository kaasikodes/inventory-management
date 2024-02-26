import { z } from "zod";

export const upsertAddressSchema = z.object({
  id: z.string().optional(),
  stateId: z.string(),
  countryId: z.string(),
  lgaId: z.string().nullable(),
  streetAddress: z.string().min(8),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
  timeZone: z.string().nullable(),
});
