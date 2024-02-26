import { Router } from "express";
import { verifyJwTToken } from "../../middleware/auth";
import { validateRequestBody } from "../../middleware/validation";
import generationPeriodPaths from "../../paths/generation-period";
import {
  addGenerationPeriodSchema,
  updateGenerationPeriodSchema,
} from "../../validation/generation-period";
import {
  addGenerationPeriod,
  editGenerationPeriod,
  getGenerationPeriods,
  removeGenerationPeriod,
} from "../../controllers/generation-period.controller";

const generationPeriodRoutes = (app: Router) => {
  app.post(
    generationPeriodPaths.addGenerationPeriod,
    verifyJwTToken,
    validateRequestBody(addGenerationPeriodSchema),
    addGenerationPeriod
  );
  app.delete(
    generationPeriodPaths.deleteGenerationPeriod,
    verifyJwTToken,
    removeGenerationPeriod
  );
  app.put(
    generationPeriodPaths.updateGenerationPeriod,
    verifyJwTToken,
    validateRequestBody(updateGenerationPeriodSchema),
    editGenerationPeriod
  );
  app.get(
    generationPeriodPaths.getGenerationPeriods,
    verifyJwTToken,
    getGenerationPeriods
  );
};

export default generationPeriodRoutes;