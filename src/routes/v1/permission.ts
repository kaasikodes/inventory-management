import { Router } from "express";
import { verifyJwTToken } from "../../middleware/auth";

import {
  getPermissions,
  initializePermissions,
} from "../../controllers/permission.controller";
import permissionPaths from "../../paths/permission";
import { recordAuditReport } from "../../middleware/audit";

const permissionRoutes = (app: Router) => {
  //app.use(verifyJwTToken, recordAuditReport);
  app.get(
    permissionPaths.getPermissions.path as string,
    verifyJwTToken,
    getPermissions
  );
  app.post(
    permissionPaths.initializePermissions.path as string,
    initializePermissions
  );
};

export default permissionRoutes;
