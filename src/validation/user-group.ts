import { z } from "zod";
// TODO: Implement testing if time permits, also consider making this a micro service to be integrated into a larger sytem
export const addUserGroupSchema = z.object({
  description: z.string().min(10).optional(),
  name: z.string().min(3),
  permissionIds: z.array(z.string()).optional(),
});
export const updateUserGroupSchema = addUserGroupSchema;
export const addUsersToGroupSchema = z.object({
  groupId: z.string(),
  userIds: z.array(z.string()),
});
