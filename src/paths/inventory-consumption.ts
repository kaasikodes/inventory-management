import { TPath } from "../types/path";

const inventoryConsumptionPaths: TPath = {
  addInventoryConsumption: {
    path: "/add-inventory-consumption",
    action: "User added inventory consumption!",
  },
  getInventoryConsumption: {
    path: "/inventory-consumption/:id",
    action: "User accessed inventory consumption!",
  },
  getInventoryConsumptions: {
    path: "/inventory-consumptions",
    action: "User accessed inventory consumptions!",
  },
  updateInventoryConsumptionProduceInfo: {
    path: "/inventory-consumption/produce-info/edit/:id",
    action: "User updated inventory consumption produce info!",
  },

  deleteInventoryConsumption: {
    path: "/inventory-consumption/delete/:id",
    action: "User deleted inventory consumption!",
  },
};

export default inventoryConsumptionPaths;
