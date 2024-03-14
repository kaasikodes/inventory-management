import { Router } from "express";
import userPaths from "../../paths/user";
import { verifyJwTToken } from "../../middleware/auth";
import {
  addUserSchema,
  changeUserStatusInBulkSchema,
  editUserSchema,
  importUsersSchema,
} from "../../validation/user";
import {
  validateRequestBody,
  validateRequestSingleFile,
} from "../../middleware/validation";
import {
  addUser,
  editUser,
  exportUserImportTemplate,
  getUser,
  getUsers,
  importUsers,
  removeUser,
  updateStatusOfUsersInBulk,
} from "../../controllers/user.controller";
import { fileUpload } from "../../lib/file";
import { parseCsvFileToRequestBody } from "../../middleware/file";
import { checkUniquenessOfEmailsDuringImport } from "../../middleware/user";

const userRoutes = (app: Router) => {
  app.post(
    userPaths.importUsers.path as string,
    verifyJwTToken,
    fileUpload.single("file"),
    validateRequestSingleFile({
      allowedFileTypes: ["text/csv"],
      fileInputName: "file",
    }),
    parseCsvFileToRequestBody,
    validateRequestBody(importUsersSchema),
    checkUniquenessOfEmailsDuringImport,
    importUsers
  );
  app.patch(
    userPaths.changeUserStatusInBulk.path as string,
    verifyJwTToken,
    validateRequestBody(changeUserStatusInBulkSchema),
    updateStatusOfUsersInBulk
  );
  app.post(
    userPaths.addUser.path as string,
    verifyJwTToken,
    validateRequestBody(addUserSchema),

    addUser
  );
  app.patch(
    userPaths.updateUser.path as string,
    verifyJwTToken,
    validateRequestBody(editUserSchema),
    editUser
  );

  app.get(userPaths.getUser.path as string, verifyJwTToken, getUser);
  app.get(userPaths.getUsers.path as string, verifyJwTToken, getUsers);
  app.get(
    userPaths.getUserImportTemplate.path as string,
    verifyJwTToken,
    exportUserImportTemplate
  );
  app.delete(userPaths.deleteUser.path as string, verifyJwTToken, removeUser);
};

export default userRoutes;
