import { Router } from "express";
import { verifyJwTToken } from "../../middleware/auth";
import { validateRequestBody } from "../../middleware/validation";
import {
  addSupplierProfile,
  removeSupplierProfile,
  editSupplierProfile,
  getSupplierProfiles,
} from "../../controllers/supplier.controller";
import supplierProfilePaths from "../../paths/supplier";
import {
  createSupplierProfileSchema,
  updateSupplierProfileSchema,
} from "../../validation/supplier";
import { recordAuditReport } from "../../middleware/audit";

const supplierProfileRoutes = (app: Router) => {
  app.use(verifyJwTToken, recordAuditReport);
  app.post(
    supplierProfilePaths.addSupplierProfile.path as string,
    verifyJwTToken,
    validateRequestBody(createSupplierProfileSchema),
    addSupplierProfile
  );
  app.delete(
    supplierProfilePaths.deleteSupplierProfile.path as string,
    verifyJwTToken,
    removeSupplierProfile
  );
  app.patch(
    supplierProfilePaths.updateSupplierProfile.path as string,
    verifyJwTToken,
    validateRequestBody(updateSupplierProfileSchema),
    editSupplierProfile
  );

  app.get(
    supplierProfilePaths.getSupplierProfiles.path as string,
    verifyJwTToken,
    getSupplierProfiles
  );
  // TODO: Add other crud routes
};

export default supplierProfileRoutes;
