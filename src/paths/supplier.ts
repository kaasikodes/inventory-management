import { TPath } from "../types/path";

const supplierProfilePaths: TPath = {
  addSupplierProfile: {
    path: "/add-supplier",
    action: "User added supplier!",
  },
  getSupplierProfile: {
    path: "/supplier/:id",
    action: "User accessed supplier!",
  },
  getSupplierProfiles: {
    path: "/suppliers",
    action: "User accessed suppliers!",
  },
  updateSupplierProfile: {
    path: "/supplier/edit/:id",
    action: "User updated supplier!",
  },
  deleteSupplierProfile: {
    path: "/supplier/delete/:id",
    action: "User deleted supplier!",
  },
};

export default supplierProfilePaths;
