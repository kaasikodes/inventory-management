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

const inventorySupplyRoutes = (app: Router) => {
  app.patch(
    inventorySupplyPaths.updateInventorySupplyCondition,
    verifyJwTToken,
    validateRequestBody(updateSupplyRecordConditionSchema),
    editInventorySupplyRecordCondition
  );
  app.patch(
    inventorySupplyPaths.updateInventorySupplySupplier,
    verifyJwTToken,
    validateRequestBody(updateSupplyRecordSupplierSchema),
    editInventorySupplyRecordSupplier
  );
  app.patch(
    inventorySupplyPaths.updateInventorySupplyEntryDate,
    verifyJwTToken,
    validateRequestBody(updateSupplyRecordEntryDateSchema),
    editInventorySupplyRecordEndDate
  );
  app.patch(
    inventorySupplyPaths.updateInventorySupplyPhysicalParams,
    verifyJwTToken,
    validateRequestBody(updateSupplyRecordPhysicalParamsSchema),
    editInventorySupplyRecordPhysicalParams
  );
  app.patch(
    inventorySupplyPaths.updateInventorySupplyTotalAmount,
    verifyJwTToken,
    validateRequestBody(updateSupplyRecordTotalAmountSchema),
    editInventorySupplyRecordTotalAmount
  );

  app.delete(
    inventorySupplyPaths.deleteInventorySupply,
    verifyJwTToken,
    removeInventorySupplyRecord
  );
  app.post(
    inventorySupplyPaths.addInventorySupply,
    verifyJwTToken,
    validateRequestBody(addSupplyRecordSchema),
    addSupplyRecord
  );
  app.get(
    inventorySupplyPaths.getInventorySupply,
    verifyJwTToken,
    getInventorySupplyRecord
  );
  app.get(
    inventorySupplyPaths.getInventorySupplies,
    verifyJwTToken,
    getInventorySupplyRecords
  );
};

export default inventorySupplyRoutes;
