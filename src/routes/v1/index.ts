import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import userGroupRoutes from "./user-group";
import permissionRoutes from "./permission";
import creditLimitRoutes from "./credit-limit";
import paymentTermRoutes from "./payment-term";
import supplierProfileRoutes from "./supplier";
import inventoryConditionRoutes from "./inventory-condition";
import measurementUnitRoutes from "./measurement-unit";
import inventoryItemRoutes from "./inventory-item";
import inventorySupplyRoutes from "./inventory-supply";
import inventoryConsumptionRoutes from "./inventory-consumption";
import reportRoutes from "./report";
import notificationRoutes from "./notification";
import auditRoutes from "./audit";

const routes = (app: Router) => {
  authRoutes(app);
  userRoutes(app);
  userGroupRoutes(app);
  permissionRoutes(app);
  creditLimitRoutes(app);
  paymentTermRoutes(app);
  supplierProfileRoutes(app);
  inventoryConditionRoutes(app);
  measurementUnitRoutes(app);
  inventoryItemRoutes(app);
  inventorySupplyRoutes(app);
  inventoryConsumptionRoutes(app);
  reportRoutes(app);
  notificationRoutes(app);
  auditRoutes(app);
};

export default routes;
