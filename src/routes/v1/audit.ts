import { Router } from "express";
import { verifyJwTToken } from "../../middleware/auth";
import auditPaths from "../../paths/audit";
import {
  getAuditRecord,
  getAuditRecords,
} from "../../controllers/audit.controller";

const auditRoutes = (app: Router) => {
  app.get(auditPaths.getAudit.path as string, verifyJwTToken, getAuditRecord);
  app.get(auditPaths.getAudits.path as string, verifyJwTToken, getAuditRecords);
};

export default auditRoutes;
