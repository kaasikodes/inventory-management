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

const supplierProfileRoutes = (app: Router) => {
  app.post(
    supplierProfilePaths.addSupplierProfile,
    verifyJwTToken,
    validateRequestBody(createSupplierProfileSchema),
    addSupplierProfile
  );
  app.delete(
    supplierProfilePaths.deleteSupplierProfile,
    verifyJwTToken,
    removeSupplierProfile
  );
  app.patch(
    supplierProfilePaths.updateSupplierProfile,
    verifyJwTToken,
    validateRequestBody(updateSupplierProfileSchema),
    editSupplierProfile
  );

  app.get(
    supplierProfilePaths.getSupplierProfiles,
    verifyJwTToken,
    getSupplierProfiles
  );
  // TODO: Add other crud routes
};

export default supplierProfileRoutes;
