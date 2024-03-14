import { TPath } from "../types/path";

const inventoryItemPaths: TPath = {
  addInventoryItem: {
    path: "/add-inventory-item",
    action: "User added inventory item!",
  },
  getInventoryItem: {
    path: "/inventory-item/:id",
    action: "User accessed inventory item!",
  },
  getInventoryItems: {
    path: "/inventory-items",
    action: "User accessed inventory items!",
  },
  updateInventoryItem: {
    path: "/inventory-item/edit/:id",
    action: "User updated inventory item!",
  },
  deleteInventoryItem: {
    path: "/inventory-item/delete/:id",
    action: "User deleted inventory item!",
  },
  getInventoryItemImportTemplate: {
    path: "/inventory-item/bulk/template",
    action: "User accessed inventory item import template!",
  },
  importInventoryItems: {
    path: "/inventory-item/bulk/import",
    action: "User imported inventory items!",
  },
};

export default inventoryItemPaths;
