import { TPath } from "../types/path";

const paymentTermPaths: TPath = {
  addPaymentTerm: {
    path: "/add-payment-term",
    action: "User added payment term!",
  },
  getPaymentTerm: {
    path: "/payment-term/:id",
    action: "User accessed payment term!",
  },
  getPaymentTerms: {
    path: "/payment-terms",
    action: "User accessed payment terms!",
  },
  updatePaymentTerm: {
    path: "/payment-term/edit/:id",
    action: "User updated payment term!",
  },
  deletePaymentTerm: {
    path: "/payment-term/delete/:id",
    action: "User deleted payment term!",
  },
};

export default paymentTermPaths;
