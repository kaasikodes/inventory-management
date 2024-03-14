import appRoutePaths from "../../../paths";

export const generateRouteAuditAction = (_path: string): string => {
  const UNREGISTERED_ACTION = "UNREGISTERED SYSTEM ACTION PERFORMED!";
  let action = UNREGISTERED_ACTION;

  for (let i = 0; i < Object.values(appRoutePaths).length; i++) {
    const route = Object.values(appRoutePaths)[i];
    for (const path in route) {
      if (route[path].path === _path) {
        action = route[path].action ?? UNREGISTERED_ACTION;
        break;
      }
    }
  }

  return action;
};
