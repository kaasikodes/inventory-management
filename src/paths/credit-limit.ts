import { TPath } from "../types/path";

const creditLimitPaths: TPath = {
  addCreditLimit: {
    path: "/add-credit-limit",
    action: "User added credit limit",
  },
  // getCreditLimit: "/credit-limit/:id",
  getCreditLimits: {
    path: "/credit-limits",
    action: "User accessed credit limits!",
  },
  updateCreditLimit: {
    path: "/credit-limit/edit/:id",
    action: "User updated credit limit!",
  },
  deleteCreditLimit: {
    path: "/credit-limit/delete/:id",
    action: "User deleted credit limit!",
  },
};

export default creditLimitPaths;
