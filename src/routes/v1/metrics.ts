import { Router } from "express";
import { getAppMetrics } from "../../controllers/metrics.contoller";
import client from "prom-client";

const metricsRoutes = (app: Router, register: client.Registry) => {
  app.get("/metrics", getAppMetrics(register));
};

export default metricsRoutes;
