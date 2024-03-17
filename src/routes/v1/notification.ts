import { Router } from "express";
import { verifyJwTToken } from "../../middleware/auth";

import notificationPaths from "../../paths/notification";
import {
  createOrUpdateNotificationSettings,
  getNotification,
  getNotificationSettings,
  getUserNotifications,
  removeAllUserNotifications,
  removeNotification,
} from "../../controllers/notification.controller";
import { saveNotificationSettings } from "../../services/notification";
import { recordAuditReport } from "../../middleware/audit";
import { validateRequestBody } from "../../middleware/validation";
import { saveNotificationSettingSchema } from "../../validation/notification";

const notificationRoutes = (app: Router) => {
  //app.use(verifyJwTToken, recordAuditReport);
  app.get(
    notificationPaths.getNotification.path as string,
    verifyJwTToken,
    getNotification
  );
  app.get(
    notificationPaths.getNotifications.path as string,
    verifyJwTToken,
    getUserNotifications
  );
  app.delete(
    notificationPaths.deleteNotification.path as string,
    verifyJwTToken,
    removeNotification
  );
  app.delete(
    notificationPaths.deleteAllNotifications.path as string,
    verifyJwTToken,
    removeAllUserNotifications
  );
  app.post(
    notificationPaths.saveNotificationSettings.path as string,
    verifyJwTToken,
    validateRequestBody(saveNotificationSettingSchema),
    createOrUpdateNotificationSettings
  );
  app.get(
    notificationPaths.getNotificationSettings.path as string,
    verifyJwTToken,
    getNotificationSettings
  );
};

export default notificationRoutes;
