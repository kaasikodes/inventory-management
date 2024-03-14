import { Router } from "express";
import { verifyJwTToken } from "../../middleware/auth";
import { validateRequestBody } from "../../middleware/validation";
import measurementUnitPaths from "../../paths/measurement-unit";
import {
  addMeasurementUnit,
  editMeasurementUnit,
  getMeasurementUnits,
  removeMeasurementUnit,
} from "../../controllers/measurement-unit.controller";
import {
  addMeasurementUnitSchema,
  editMeasurementUnitSchema,
} from "../../validation/measurement-unit";

const measurementUnitRoutes = (app: Router) => {
  app.post(
    measurementUnitPaths.addMeasurementUnit.path as string,
    verifyJwTToken,
    validateRequestBody(addMeasurementUnitSchema),
    addMeasurementUnit
  );
  app.delete(
    measurementUnitPaths.deleteMeasurementUnit.path as string,
    verifyJwTToken,
    removeMeasurementUnit
  );
  app.put(
    measurementUnitPaths.updateMeasurementUnit.path as string,
    verifyJwTToken,
    validateRequestBody(editMeasurementUnitSchema),
    editMeasurementUnit
  );
  app.get(
    measurementUnitPaths.getMeasurementUnits.path as string,
    verifyJwTToken,
    getMeasurementUnits
  );
};

export default measurementUnitRoutes;
