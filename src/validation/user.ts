import { z } from "zod";
import { upsertAddressSchema } from "./address";

export const importUsersSchema = z.object({
  data: z.array(
    z.object({
      email: z.string().email(),
      name: z.string().min(3),
      status: z.enum(["ACTIVE", "INACTIVE", "BLACKLISTED", "PENDING"]),
    })
  ),
});

export const assignMultipleUsersToGroupSchema = z.object({
  groupId: z.string(),
  userIds: z.array(z.string()),
});
export const removeMultipleUsersFromGroupSchema =
  assignMultipleUsersToGroupSchema;
export const changeUserStatusInBulkSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "BLACKLISTED", "PENDING"]),
  userIds: z.array(z.string()),
});

export const addUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  status: z.enum(["ACTIVE", "INACTIVE", "BLACKLISTED", "PENDING"]),
  image: z.string().optional(),
  address: upsertAddressSchema.optional(),
});

export const editUserSchema = z.object({
  name: z.string().min(3).optional(),
  image: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "BLACKLISTED", "PENDING"]).optional(),
  address: upsertAddressSchema.optional(),
});

// For file validation read more here
// https://stackoverflow.com/questions/72674930/zod-validator-validate-image
