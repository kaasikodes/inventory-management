import { Router } from "express";
import { verifyJwTToken } from "../../middleware/auth";
import { validateRequestBody } from "../../middleware/validation";
import paymentTermPaths from "../../paths/payment-term";
import {
  addPaymentTerm,
  removePaymentTerm,
  editPaymentTerm,
  getPaymentTerms,
} from "../../controllers/payment-term.controller";
import {
  addPaymentTermSchema,
  updatePaymentTermSchema,
} from "../../validation/payment-term";

const paymentTermRoutes = (app: Router) => {
  app.post(
    paymentTermPaths.addPaymentTerm.path as string,
    verifyJwTToken,
    validateRequestBody(addPaymentTermSchema),
    addPaymentTerm
  );
  app.delete(
    paymentTermPaths.deletePaymentTerm.path as string,
    verifyJwTToken,
    removePaymentTerm
  );
  app.put(
    paymentTermPaths.updatePaymentTerm.path as string,
    verifyJwTToken,
    validateRequestBody(updatePaymentTermSchema),
    editPaymentTerm
  );
  app.get(
    paymentTermPaths.getPaymentTerms.path as string,
    verifyJwTToken,
    getPaymentTerms
  );
};

export default paymentTermRoutes;
