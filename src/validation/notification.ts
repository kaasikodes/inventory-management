import { z } from "zod";

export const saveNotificationSettingSchema = z.object({
  userGroupIdsToBeNotified: z.array(z.string()).optional(),
  userIdsToBeNotified: z.array(z.string()).min(1),
});
