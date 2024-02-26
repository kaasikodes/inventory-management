import { Router } from "express";
import { verifyJwTToken } from "../../middleware/auth";
import { validateRequestBody } from "../../middleware/validation";
import { updateInventoryConsumptionProduceInfoSchema } from "../../validation/inventory-consumption";
import {
  addConsumptionRecord,
  editConsumptionRecordProduceInfo,
  getInventoryConsumptionRecord,
  getInventoryConsumptionRecords,
  removeInventoryConsumptionRecord,
} from "../../controllers/inventory-consumption.controller";
import inventoryConsumptionPaths from "../../paths/inventory-consumption";
import { addInventoryConditionSchema } from "../../validation/inventory-condition";

const inventoryConsumptionRoutes = (app: Router) => {
  app.patch(
    inventoryConsumptionPaths.updateInventoryConditionProduceInfo,
    verifyJwTToken,
    validateRequestBody(updateInventoryConsumptionProduceInfoSchema),
    editConsumptionRecordProduceInfo
  );

  app.delete(
    inventoryConsumptionPaths.deleteInventoryConsumption,
    verifyJwTToken,
    removeInventoryConsumptionRecord
  );
  app.post(
    inventoryConsumptionPaths.addInventoryConsumption,
    verifyJwTToken,
    validateRequestBody(addInventoryConditionSchema),
    addConsumptionRecord
  );
  app.get(
    inventoryConsumptionPaths.getInventoryConsumption,
    verifyJwTToken,
    getInventoryConsumptionRecord
  );
  app.get(
    inventoryConsumptionPaths.getInventoryConsumptions,
    verifyJwTToken,
    getInventoryConsumptionRecords
  );
};

export default inventoryConsumptionRoutes;
