import { Router } from "express";
import { verifyJwTToken } from "../../middleware/auth";
import { validateRequestBody } from "../../middleware/validation";
import creditLimitPaths from "../../paths/credit-limit";
import {
  addCreditLimit,
  removeCreditLimit,
  editCreditLimit,
  getCreditLimits,
} from "../../controllers/credit-limit.controller";
import {
  addCreditLimitSchema,
  updateCreditLimitSchema,
} from "../../validation/credit-limit";

const creditLimitRoutes = (app: Router) => {
  app.post(
    creditLimitPaths.addCreditLimit,
    verifyJwTToken,
    validateRequestBody(addCreditLimitSchema),
    addCreditLimit
  );
  app.delete(
    creditLimitPaths.deleteCreditLimit,
    verifyJwTToken,
    removeCreditLimit
  );
  app.put(
    creditLimitPaths.updateCreditLimit,
    verifyJwTToken,
    validateRequestBody(updateCreditLimitSchema),
    editCreditLimit
  );
  app.get(creditLimitPaths.getCreditLimits, verifyJwTToken, getCreditLimits);
};

export default creditLimitRoutes;
