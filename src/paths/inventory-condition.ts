import { TPath } from "../types/path";

const inventoryConditionPaths: TPath = {
  addInventoryCondition: {
    path: "/add-inventory-condition",
    action: "User added inventory condition",
  },
  getInventoryCondition: {
    path: "/inventory-condition/:id",
    action: "User accessed inventory condition!",
  },
  getInventoryConditions: {
    path: "/inventory-conditions",
    action: "User accessed inventory conditions!",
  },
  updateInventoryCondition: {
    path: "/inventory-condition/edit/:id",
    action: "User updated inventory condition!",
  },
  deleteInventoryCondition: {
    path: "/inventory-condition/delete/:id",
    action: "User deleted inventory condition!",
  },
};

export default inventoryConditionPaths;
