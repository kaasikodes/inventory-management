import { Router } from "express";
import { verifyJwTToken } from "../../middleware/auth";
import { validateRequestBody } from "../../middleware/validation";
import inventorySupplyPaths from "../../paths/inventory-supply";
import {
  addSupplyRecord,
  editInventorySupplyRecordCondition,
  editInventorySupplyRecordEndDate,
  editInventorySupplyRecordPhysicalParams,
  editInventorySupplyRecordSupplier,
  editInventorySupplyRecordTotalAmount,
  getInventorySupplyRecord,
  getInventorySupplyRecords,
  removeInventorySupplyRecord,
} from "../../controllers/inventory-supply.controller";
import {
  addSupplyRecordSchema,
  updateSupplyRecordConditionSchema,
  updateSupplyRecordEntryDateSchema,
  updateSupplyRecordPhysicalParamsSchema,
  updateSupplyRecordSupplierSchema,
  updateSupplyRecordTotalAmountSchema,
} from "../../validation/inventory-supply";
import { recordAuditReport } from "../../middleware/audit";

const inventorySupplyRoutes = (app: Router) => {
  app.use(verifyJwTToken, recordAuditReport);
  app.patch(
    inventorySupplyPaths.updateInventorySupplyCondition.path as string,
    verifyJwTToken,
    validateRequestBody(updateSupplyRecordConditionSchema),
    editInventorySupplyRecordCondition
  );
  app.patch(
    inventorySupplyPaths.updateInventorySupplySupplier.path as string,
    verifyJwTToken,
    validateRequestBody(updateSupplyRecordSupplierSchema),
    editInventorySupplyRecordSupplier
  );
  app.patch(
    inventorySupplyPaths.updateInventorySupplyEntryDate.path as string,
    verifyJwTToken,
    validateRequestBody(updateSupplyRecordEntryDateSchema),
    editInventorySupplyRecordEndDate
  );
  app.patch(
    inventorySupplyPaths.updateInventorySupplyPhysicalParams.path as string,
    verifyJwTToken,
    validateRequestBody(updateSupplyRecordPhysicalParamsSchema),
    editInventorySupplyRecordPhysicalParams
  );
  app.patch(
    inventorySupplyPaths.updateInventorySupplyTotalAmount.path as string,
    verifyJwTToken,
    validateRequestBody(updateSupplyRecordTotalAmountSchema),
    editInventorySupplyRecordTotalAmount
  );

  app.delete(
    inventorySupplyPaths.deleteInventorySupply.path as string,
    verifyJwTToken,
    removeInventorySupplyRecord
  );
  app.post(
    inventorySupplyPaths.addInventorySupply.path as string,
    verifyJwTToken,
    validateRequestBody(addSupplyRecordSchema),
    addSupplyRecord
  );
  app.get(
    inventorySupplyPaths.getInventorySupply.path as string,
    verifyJwTToken,
    getInventorySupplyRecord
  );
  app.get(
    inventorySupplyPaths.getInventorySupplies.path as string,
    verifyJwTToken,
    getInventorySupplyRecords
  );
};

export default inventorySupplyRoutes;
