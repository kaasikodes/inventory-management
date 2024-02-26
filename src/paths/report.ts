const reportPaths = {
  getReports: `/reports`,
  getReport: `/reports/:id`,
  deleteReport: `/reports/delete/:id`,
  downloadReport: `/reports/download/:id`,
  editReport: `/reports/edit/:id`,
  generateReport: `/reports/generate`,
  analytics: {
    supplyGraph: `/reports/supply-graph`,
    productionGraph: `/reports/production-graph`,
    consumptionGraph: `/reports/consumption-graph`,
    productionMaturityVariationGraph: `/reports/production-maturity-variation-graph`,
    productionAmountVariationGraph: `/reports/production-amount-variation-graph`,
  },
};

export default reportPaths;
