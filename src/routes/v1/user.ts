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
    userPaths.importUsers,
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
    userPaths.changeUserStatusInBulk,
    verifyJwTToken,
    validateRequestBody(changeUserStatusInBulkSchema),
    updateStatusOfUsersInBulk
  );
  app.post(
    userPaths.addUser,
    verifyJwTToken,
    validateRequestBody(addUserSchema),
    addUser
  );
  app.patch(
    userPaths.updateUser,
    verifyJwTToken,
    validateRequestBody(editUserSchema),
    editUser
  );

  app.get(userPaths.getUser, verifyJwTToken, getUser);
  app.get(userPaths.getUsers, verifyJwTToken, getUsers);
  app.get(
    userPaths.getUserImportTemplate,
    verifyJwTToken,
    exportUserImportTemplate
  );
  app.delete(userPaths.deleteUser, verifyJwTToken, removeUser);
};

export default userRoutes;
