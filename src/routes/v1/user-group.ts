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
    userGroupPaths.addUserGroup,
    verifyJwTToken,
    validateRequestBody(addUserGroupSchema),
    addUserGroup
  );
  app.delete(userGroupPaths.deleteUserGroup, verifyJwTToken, removeUserGroup);
  app.patch(
    userGroupPaths.addMultipleUsersToGroup,
    verifyJwTToken,
    validateRequestBody(addUsersToGroupSchema),
    addUsersToGroup
  );
  app.put(
    userGroupPaths.updateUserGroup,
    verifyJwTToken,
    validateRequestBody(updateUserGroupSchema),
    editUserGroup
  );
  app.get(userGroupPaths.getUserGroups, verifyJwTToken, getUserGroups);
  app.get(userGroupPaths.getUserGroup, verifyJwTToken, getUserGroup);
};

export default userGroupRoutes;
