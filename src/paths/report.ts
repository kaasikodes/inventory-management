import { TPath } from "../types/path";

const reportPaths = {
  getReports: {
    path: "/reports",
    action: "User accessed reports!",
  },
  getReport: {
    path: "/report/:id",
    action: "User accessed report!",
  },
  deleteReport: {
    path: "/report/delete/:id",
    action: "User deleted report!",
  },
  downloadReport: {
    path: "/report/download/:id",
    action: "User downloaded report!",
  },
  editReport: {
    path: "/report/edit/:id",
    action: "User edited report!",
  },
  generateReport: {
    path: "/report/generate",
    action: "User generated report!",
  },
  // analytics
  analyticsConsumptionPerInventoryItem: {
    path: "/reports/consumption-per-inventory-item",
    action: "User accessed consumption per inventory graph!",
  },
  analyticsSupplyPerInventoryItem: {
    path: "/reports/supply-per-inventory-item",
    action: "User accessed supply per inventory graph!",
  },
  analyticsProducePerInventoryItem: {
    path: "/reports/produce-per-inventory-item",
    action: "User accessed produce per inventory graph!",
  },
  analyticsSupplyGraph: {
    path: "/reports/supply-graph",
    action: "User accessed supply graph!",
  },
  analyticsProductionGraph: {
    path: "/reports/production-graph",
    action: "User accessed production graph!",
  },
  analyticsConsumptionGraph: {
    path: "/reports/consumption-graph",
    action: "User accessed consumption graph!",
  },
  analyticsProductionMaturityVariationGraph: {
    path: "/reports/production-maturity-variation-graph",
    action: "User accessed production maturity variation graph!",
  },
  analyticsProductionAmountVariationGraph: {
    path: "/reports/production-amount-variation-graph",
    action: "User accessed production amount variation graph!",
  },
};

export default reportPaths;
