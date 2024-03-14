import { Router } from "express";
import { verifyJwTToken } from "../../middleware/auth";
import { validateRequestBody } from "../../middleware/validation";
import {
  addUserGroupSchema,
  addUsersToGroupSchema,
  updateUserGroupSchema,
} from "../../validation/user-group";
import userGroupPaths from "../../paths/user-group";
import {
  addUserGroup,
  addUsersToGroup,
  editUserGroup,
  getUserGroup,
  getUserGroups,
  removeUserGroup,
} from "../../controllers/user-group.controller";

const userGroupRoutes = (app: Router) => {
  app.post(
    userGroupPaths.addUserGroup.path as string,
    verifyJwTToken,
    validateRequestBody(addUserGroupSchema),

    addUserGroup
  );
  app.delete(
    userGroupPaths.deleteUserGroup.path as string,
    verifyJwTToken,
    removeUserGroup
  );
  app.patch(
    userGroupPaths.addMultipleUsersToGroup.path as string,
    verifyJwTToken,
    validateRequestBody(addUsersToGroupSchema),
    addUsersToGroup
  );
  app.put(
    userGroupPaths.updateUserGroup.path as string,
    verifyJwTToken,
    validateRequestBody(updateUserGroupSchema),
    editUserGroup
  );
  app.get(
    userGroupPaths.getUserGroups.path as string,
    verifyJwTToken,
    getUserGroups
  );
  app.get(
    userGroupPaths.getUserGroup.path as string,
    verifyJwTToken,
    getUserGroup
  );
};

export default userGroupRoutes;
