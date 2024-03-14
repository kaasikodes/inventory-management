import { TPath } from "../types/path";

const auditPaths: TPath = {
  getAudit: {
    path: "/audit/:id",
    action: "User accessed audit!",
  },
  getAudits: {
    path: "/audits",
    action: "User accessed audits!",
  },
};

export default auditPaths;
