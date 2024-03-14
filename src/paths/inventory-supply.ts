import { TPath } from "../types/path";

const inventorySupplyPaths: TPath = {
  addInventorySupply: {
    path: "/add-inventory-supply",
    action: "User added inventory supply!",
  },
  getInventorySupply: {
    path: "/inventory-supply/:id",
    action: "User accessed inventory supply!",
  },
  getInventorySupplies: {
    path: "/inventory-supplies",
    action: "User accessed inventory supplies!",
  },
  updateInventorySupplyTotalAmount: {
    path: "/inventory-supply/total-amount/:id",
    action: "User updated inventory supply total amount!",
  },
  updateInventorySupplyPhysicalParams: {
    path: "/inventory-supply/physical-params/:id",
    action: "User updated inventory supply physical params!",
  },
  updateInventorySupplyEntryDate: {
    path: "/inventory-supply/entry-date/:id",
    action: "User updated inventory supply entry date!",
  },
  updateInventorySupplySupplier: {
    path: "/inventory-supply/supplier/:id",
    action: "User updated inventory supply supplier!",
  },
  updateInventorySupplyCondition: {
    path: "/inventory-supply/condition/:id",
    action: "User updated inventory supply condition!",
  },
  deleteInventorySupply: {
    path: "/inventory-supply/delete/:id",
    action: "User deleted inventory supply!",
  },
};

export default inventorySupplyPaths;
