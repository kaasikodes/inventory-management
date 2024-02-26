import { Router } from "express";
import { verifyJwTToken } from "../../middleware/auth";

import { getPermissions } from "../../controllers/permission.controller";
import permissionPaths from "../../paths/permission";

const permissionRoutes = (app: Router) => {
  app.get(permissionPaths.getPermissions, verifyJwTToken, getPermissions);
};

export default permissionRoutes;
