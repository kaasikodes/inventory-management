import { Router } from "express";
import { verifyJwTToken } from "../../middleware/auth";
import { validateRequestBody } from "../../middleware/validation";
import {
  addInventoryConsumptionSchema,
  updateInventoryConsumptionProduceInfoSchema,
} from "../../validation/inventory-consumption";
import {
  addConsumptionRecord,
  editConsumptionRecordProduceInfo,
  getInventoryConsumptionRecord,
  getInventoryConsumptionRecords,
  removeInventoryConsumptionRecord,
} from "../../controllers/inventory-consumption.controller";
import inventoryConsumptionPaths from "../../paths/inventory-consumption";
import { recordAuditReport } from "../../middleware/audit";

const inventoryConsumptionRoutes = (app: Router) => {
  app.use(verifyJwTToken, recordAuditReport);
  app.patch(
    inventoryConsumptionPaths.updateInventoryConsumptionProduceInfo
      .path as string,
    verifyJwTToken,
    validateRequestBody(updateInventoryConsumptionProduceInfoSchema),
    editConsumptionRecordProduceInfo
  );

  app.delete(
    inventoryConsumptionPaths.deleteInventoryConsumption.path as string,
    verifyJwTToken,
    removeInventoryConsumptionRecord
  );
  app.post(
    inventoryConsumptionPaths.addInventoryConsumption.path as string,
    verifyJwTToken,
    validateRequestBody(addInventoryConsumptionSchema),
    addConsumptionRecord
  );
  app.get(
    inventoryConsumptionPaths.getInventoryConsumption.path as string,
    verifyJwTToken,
    getInventoryConsumptionRecord
  );
  app.get(
    inventoryConsumptionPaths.getInventoryConsumptions.path as string,
    verifyJwTToken,
    getInventoryConsumptionRecords
  );
};

export default inventoryConsumptionRoutes;
