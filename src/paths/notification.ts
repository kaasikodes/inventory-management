const notificationPaths = {
  saveNotificationSettings: {
    path: "/save-notification-settings",
    action: "User saved notification settings!",
  },
  getNotifications: {
    path: "/notifications",
    action: "User accessed notifications!",
  },
  getNotification: {
    path: "/notification/:id",
    action: "User accessed notification!",
  },
  deleteNotification: {
    path: "/notification/delete/:id",
    action: "User deleted notification!",
  },
  deleteAllNotifications: {
    path: "/notifications/delete-all",
    action: "User deleted all their notifications!",
  },
};

export default notificationPaths;
