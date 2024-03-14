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
import { recordAuditReport } from "../../middleware/audit";

const creditLimitRoutes = (app: Router) => {
  app.use(verifyJwTToken, recordAuditReport);
  app.post(
    creditLimitPaths.addCreditLimit.path as string,
    verifyJwTToken,
    validateRequestBody(addCreditLimitSchema),
    addCreditLimit
  );
  app.delete(
    creditLimitPaths.deleteCreditLimit.path as string,
    verifyJwTToken,
    removeCreditLimit
  );
  app.put(
    creditLimitPaths.updateCreditLimit.path as string,
    verifyJwTToken,
    validateRequestBody(updateCreditLimitSchema),
    editCreditLimit
  );
  app.get(
    creditLimitPaths.getCreditLimits.path as string,
    verifyJwTToken,
    getCreditLimits
  );
};

export default creditLimitRoutes;
