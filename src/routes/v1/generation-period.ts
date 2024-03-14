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
    generationPeriodPaths.addGenerationPeriod.path as string,
    verifyJwTToken,
    validateRequestBody(addGenerationPeriodSchema),
    addGenerationPeriod
  );
  app.delete(
    generationPeriodPaths.deleteGenerationPeriod.path as string,
    verifyJwTToken,
    removeGenerationPeriod
  );
  app.put(
    generationPeriodPaths.updateGenerationPeriod.path as string,
    verifyJwTToken,
    validateRequestBody(updateGenerationPeriodSchema),
    editGenerationPeriod
  );
  app.get(
    generationPeriodPaths.getGenerationPeriods.path as string,
    verifyJwTToken,
    getGenerationPeriods
  );
};

export default generationPeriodRoutes;
