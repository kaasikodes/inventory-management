import { Router } from "express";
import { verifyJwTToken } from "../../middleware/auth";

import notificationPaths from "../../paths/notification";
import {
  getNotification,
  getUserNotifications,
  removeAllUserNotifications,
  removeNotification,
} from "../../controllers/notification.controller";
import { saveNotificationSettings } from "../../services/notification";

const notificationRoutes = (app: Router) => {
  app.get(notificationPaths.getNotification, verifyJwTToken, getNotification);
  app.get(
    notificationPaths.getNotifications,
    verifyJwTToken,
    getUserNotifications
  );
  app.delete(
    notificationPaths.deleteNotification,
    verifyJwTToken,
    removeNotification
  );
  app.delete(
    notificationPaths.deleteAllNotifications,
    verifyJwTToken,
    removeAllUserNotifications
  );
  app.post(
    notificationPaths.saveNotificationSettings,
    verifyJwTToken,
    saveNotificationSettings
  );
};

export default notificationRoutes;
