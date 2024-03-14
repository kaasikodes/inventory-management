import { TPath } from "../types/path";
import auditPaths from "./audit";
import authPaths from "./auth";
import creditLimitPaths from "./credit-limit";
import generationPeriodPaths from "./generation-period";
import inventoryConditionPaths from "./inventory-condition";
import inventoryConsumptionPaths from "./inventory-consumption";
import inventoryItemPaths from "./inventory-item";
import inventorySupplyPaths from "./inventory-supply";
import measurementUnitPaths from "./measurement-unit";
import notificationPaths from "./notification";
import paymentTermPaths from "./payment-term";
import permissionPaths from "./permission";
import reportPaths from "./report";
import supplierProfilePaths from "./supplier";
import userPaths from "./user";
import userGroupPaths from "./user-group";

type TPathCategory =
  | "auth"
  | "user"
  | "userGroup"
  | "supplier"
  | "creditLimit"
  | "paymentTerm"
  | "permission"
  | "inventoryCondition"
  | "measurementUnit"
  | "inventoryItem"
  | "inventorySupply"
  | "inventoryConsumption"
  | "generationPeriod"
  | "report"
  | "notification"
  | "audit";

const appRoutePaths: Record<TPathCategory, TPath> = {
  auth: authPaths,
  user: userPaths,
  userGroup: userGroupPaths,
  creditLimit: creditLimitPaths,
  paymentTerm: paymentTermPaths,
  permission: permissionPaths,
  supplier: supplierProfilePaths,
  inventoryCondition: inventoryConditionPaths,
  measurementUnit: measurementUnitPaths,
  inventoryItem: inventoryItemPaths,
  inventorySupply: inventorySupplyPaths,
  inventoryConsumption: inventoryConsumptionPaths,
  generationPeriod: generationPeriodPaths,
  report: reportPaths,
  notification: notificationPaths,
  audit: auditPaths,
};

export default appRoutePaths;
