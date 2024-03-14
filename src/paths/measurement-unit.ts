import { TPath } from "../types/path";

const measurementUnitPaths: TPath = {
  addMeasurementUnit: {
    path: "/add-measurement-unit",
    action: "User added measurement unit!",
  },
  // getmeasurementUnit: "/measurement-unit/:id",
  getMeasurementUnits: {
    path: "/measurement-units",
    action: "User accessed measurement units!",
  },
  updateMeasurementUnit: {
    path: "/measurement-unit/edit/:id",
    action: "User updated measurement unit!",
  },
  deleteMeasurementUnit: {
    path: "/measurement-unit/delete/:id",
    action: "User deleted measurement unit!",
  },
};

export default measurementUnitPaths;
