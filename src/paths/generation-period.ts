import { TPath } from "../types/path";

const generationPeriodPaths: TPath = {
  addGenerationPeriod: {
    path: "/add-generation-period",
    action: "User added generation period!",
  },
  // getgenerationPeriod: "/generation-period/:id",
  getGenerationPeriods: {
    path: "/generation-periods",
    action: "User accessed generation periods!",
  },
  updateGenerationPeriod: {
    path: "/generation-period/edit/:id",
    action: "User updated genertion period",
  },
  deleteGenerationPeriod: {
    path: "/generation-period/delete/:id",
    action: "User deleted generation period!",
  },
};

export default generationPeriodPaths;
