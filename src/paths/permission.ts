import { TPath } from "../types/path";

const permissionPaths: TPath = {
  getPermissions: {
    path: "/permissions",
    action: "User accessed permissions!",
  },
  initializePermissions: {
    path: "/permissions/initialize",
    action: "User initialized permissions!",
  },
};

export default permissionPaths;
