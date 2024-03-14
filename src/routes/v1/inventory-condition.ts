import { Router } from "express";
import { verifyJwTToken } from "../../middleware/auth";
import { validateRequestBody } from "../../middleware/validation";
import inventoryConditionPaths from "../../paths/inventory-condition";
import {
  addInventoryConditionSchema,
  editInventoryConditionSchema,
} from "../../validation/inventory-condition";
import {
  addInventoryItemCondition,
  editInventoryItemCondition,
  getInventoryItemCondition,
  getInventoryItemConditions,
  removeInventoryItemCondition,
} from "../../controllers/inventory-condition.controller";

const inventoryConditionRoutes = (app: Router) => {
  app.post(
    inventoryConditionPaths.addInventoryCondition.path as string,
    verifyJwTToken,
    validateRequestBody(addInventoryConditionSchema),
    addInventoryItemCondition
  );
  app.delete(
    inventoryConditionPaths.deleteInventoryCondition.path as string,
    verifyJwTToken,
    removeInventoryItemCondition
  );

  app.put(
    inventoryConditionPaths.updateInventoryCondition.path as string,
    verifyJwTToken,
    validateRequestBody(editInventoryConditionSchema),
    editInventoryItemCondition
  );
  app.get(
    inventoryConditionPaths.getInventoryConditions.path as string,
    verifyJwTToken,
    getInventoryItemConditions
  );
  app.get(
    inventoryConditionPaths.getInventoryCondition.path as string,
    verifyJwTToken,
    getInventoryItemCondition
  );
};

export default inventoryConditionRoutes;
