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
    inventoryConditionPaths.addInventoryCondition,
    verifyJwTToken,
    validateRequestBody(addInventoryConditionSchema),
    addInventoryItemCondition
  );
  app.delete(
    inventoryConditionPaths.deleteInventoryCondition,
    verifyJwTToken,
    removeInventoryItemCondition
  );

  app.put(
    inventoryConditionPaths.updateInventoryCondition,
    verifyJwTToken,
    validateRequestBody(editInventoryConditionSchema),
    editInventoryItemCondition
  );
  app.get(
    inventoryConditionPaths.getInventoryConditions,
    verifyJwTToken,
    getInventoryItemConditions
  );
  app.get(
    inventoryConditionPaths.getInventoryCondition,
    verifyJwTToken,
    getInventoryItemCondition
  );
};

export default inventoryConditionRoutes;
