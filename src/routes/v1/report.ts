import { Router } from "express";
import { verifyJwTToken } from "../../middleware/auth";
import reportPaths from "../../paths/report";
import {
  editReport,
  exportReport,
  generateReport,
  getConsumptionGraph,
  getConsumptionPerInventoryItemGraph,
  getProducePerInventoryItemGraph,
  getProductionAmountVariationGraph,
  getProductionGraph,
  getProductionMaturityVariationGraph,
  getReport,
  getReports,
  getSupplyGraph,
  getSupplyPerInventoryItemGraph,
  removeReport,
} from "../../controllers/report.controller";
import { recordAuditReport } from "../../middleware/audit";
import { validateRequestBody } from "../../middleware/validation";
import {
  editReportSchema,
  generateReportSchema,
} from "../../validation/report";

const reportRoutes = (app: Router) => {
  //app.use(verifyJwTToken, recordAuditReport);
  app.delete(
    reportPaths.deleteReport.path as string,
    verifyJwTToken,
    removeReport
  );
  app.get(reportPaths.getReport.path as string, verifyJwTToken, getReport);
  app.get(reportPaths.getReports.path as string, verifyJwTToken, getReports);
  app.get(
    reportPaths.downloadReport.path as string,
    verifyJwTToken,
    exportReport
  );
  app.post(
    reportPaths.generateReport.path as string,
    verifyJwTToken,
    validateRequestBody(generateReportSchema),
    generateReport
  );
  app.patch(
    reportPaths.editReport.path as string,
    verifyJwTToken,
    validateRequestBody(editReportSchema),
    editReport
  );
  //   analytics
  app.get(
    reportPaths.analyticsSupplyGraph.path,
    verifyJwTToken,
    getSupplyGraph
  );
  app.get(
    reportPaths.analyticsConsumptionGraph.path,
    verifyJwTToken,
    getConsumptionGraph
  );
  app.get(
    reportPaths.analyticsProductionGraph.path,
    verifyJwTToken,
    getProductionGraph
  );
  app.get(
    reportPaths.analyticsProductionAmountVariationGraph.path,
    verifyJwTToken,
    getProductionAmountVariationGraph
  );
  app.get(
    reportPaths.analyticsProductionMaturityVariationGraph.path,
    verifyJwTToken,
    getProductionMaturityVariationGraph
  );
  app.get(
    reportPaths.analyticsProducePerInventoryItem.path,
    verifyJwTToken,
    getProducePerInventoryItemGraph
  );
  app.get(
    reportPaths.analyticsSupplyPerInventoryItem.path,
    verifyJwTToken,
    getSupplyPerInventoryItemGraph
  );
  app.get(
    reportPaths.analyticsConsumptionPerInventoryItem.path,
    verifyJwTToken,
    getConsumptionPerInventoryItemGraph
  );
};

export default reportRoutes;
