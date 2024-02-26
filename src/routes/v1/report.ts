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

const reportRoutes = (app: Router) => {
  app.delete(reportPaths.deleteReport, verifyJwTToken, removeReport);
  app.get(reportPaths.getReport, verifyJwTToken, getReport);
  app.get(reportPaths.getReports, verifyJwTToken, getReports);
  app.get(reportPaths.downloadReport, verifyJwTToken, exportReport);
  app.post(reportPaths.generateReport, verifyJwTToken, generateReport);
  app.patch(reportPaths.editReport, verifyJwTToken, editReport);
  //   analytics
  app.get(
    reportPaths.analytics.consumptionGraph,
    verifyJwTToken,
    getConsumptionGraph
  );
  app.get(
    reportPaths.analytics.productionGraph,
    verifyJwTToken,
    getProductionGraph
  );
  app.get(
    reportPaths.analytics.productionAmountVariationGraph,
    verifyJwTToken,
    getProductionAmountVariationGraph
  );
  app.get(
    reportPaths.analytics.productionMaturityVariationGraph,
    verifyJwTToken,
    getProductionMaturityVariationGraph
  );
};

export default reportRoutes;
