import { NextFunction, Request, Response } from "express";
import client from "prom-client";
import { prometheus } from "../lib/utils/metrics";

export const getAppMetrics =
  (register: client.Registry) =>
  async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
    try {
      const metrics = await register.metrics();

      res.setHeader("Content-Type", register.contentType);
      res.end(metrics);
    } catch (error) {
      next(error);
    }
  };
