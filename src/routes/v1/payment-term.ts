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
    paymentTermPaths.addPaymentTerm,
    verifyJwTToken,
    validateRequestBody(addPaymentTermSchema),
    addPaymentTerm
  );
  app.delete(
    paymentTermPaths.deletePaymentTerm,
    verifyJwTToken,
    removePaymentTerm
  );
  app.put(
    paymentTermPaths.updatePaymentTerm,
    verifyJwTToken,
    validateRequestBody(updatePaymentTermSchema),
    editPaymentTerm
  );
  app.get(paymentTermPaths.getPaymentTerms, verifyJwTToken, getPaymentTerms);
};

export default paymentTermRoutes;
