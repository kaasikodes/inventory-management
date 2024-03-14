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
import inventoryItemPaths from "../../paths/inventory-item";
import {
  addInventoryItemSchema,
  editInventoryItemSchema,
  importInventoryItemsSchema,
} from "../../validation/inventory-item";
import {
  addInventoryItem,
  editInventoryItem,
  exportInventoryImportTemplate,
  getInventoryItem,
  getInventoryItems,
  importInventoryItems,
  removeInventoryItem,
} from "../../controllers/inventory-item.controller";
import { convertImportRequestBodyToAcceptableInventoryItemFormat } from "../../middleware/inventory-item";

const inventoryItemRoutes = (app: Router) => {
  app.post(
    inventoryItemPaths.importInventoryItems.path as string,
    verifyJwTToken,
    fileUpload.single("file"),
    validateRequestSingleFile({
      allowedFileTypes: ["text/csv"],
      fileInputName: "file",
    }),
    parseCsvFileToRequestBody,
    convertImportRequestBodyToAcceptableInventoryItemFormat, //TODO: Do same for user import
    validateRequestBody(importInventoryItemsSchema),
    importInventoryItems
  );

  app.post(
    inventoryItemPaths.addInventoryItem.path as string,
    verifyJwTToken,
    validateRequestBody(addInventoryItemSchema),
    addInventoryItem
  );
  app.patch(
    inventoryItemPaths.updateInventoryItem.path as string,
    verifyJwTToken,
    validateRequestBody(editInventoryItemSchema),
    editInventoryItem
  );

  app.get(
    inventoryItemPaths.getInventoryItem.path as string,
    verifyJwTToken,
    getInventoryItem
  );
  app.get(
    inventoryItemPaths.getInventoryItems.path as string,
    verifyJwTToken,
    getInventoryItems
  );
  app.get(
    inventoryItemPaths.importInventoryItems.path as string,
    verifyJwTToken,
    exportInventoryImportTemplate
  );
  app.delete(
    inventoryItemPaths.deleteInventoryItem.path as string,
    verifyJwTToken,
    removeInventoryItem
  );
};

export default inventoryItemRoutes;
