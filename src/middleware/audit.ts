import { NextFunction, Request, Response } from "express";
import { createAuditRecord } from "../services/audit.service";
import { generateRouteAuditAction } from "../lib/utils/audit";

export const recordAuditReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authUser = req.user;
    if (!authUser) {
      throw new Error("User not found");
    }

    res.on("finish", async () => {
      await createAuditRecord({
        invokerId: authUser.id,
        action: generateRouteAuditAction(req.path),
        routePath: req.path,
        status: res.statusMessage === "OK" ? "SUCCESS" : "FAILURE",
        details: JSON.stringify({
          status: res.status,
          content: res.statusMessage,
          data: req.body,
          success: res.statusMessage === "OK" ? true : false,
          path: req.path,
        }),
      });
    });
    next();
  } catch (err) {
    next(err);
  }
};
