import { Router } from "express";
import { verifyJwTToken } from "../../middleware/auth";
import reportPaths from "../../paths/report";
import {
  editReport,
  exportReport,
  generateReport,
  getConsumptionGraph,
  getProductionAmountVariationGraph,
  getProductionGraph,
  getProductionMaturityVariationGraph,
  getReport,
  getReports,
  removeReport,
} from "../../controllers/report.controller";
import { recordAuditReport } from "../../middleware/audit";

const reportRoutes = (app: Router) => {
  app.use(verifyJwTToken, recordAuditReport);
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
    generateReport
  );
  app.patch(reportPaths.editReport.path as string, verifyJwTToken, editReport);
  //   analytics
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
};

export default reportRoutes;
