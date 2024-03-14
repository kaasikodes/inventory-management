import { TPath } from "../types/path";

const userGroupPaths: TPath = {
  addUserGroup: {
    path: "/add-user-group",
    action: "User added user group!",
  },
  getUserGroup: {
    path: "/user-group/:id",
    action: "User accessed user group!",
  },
  getUserGroups: {
    path: "/user-groups",
    action: "User accessed user groups!",
  },
  updateUserGroup: {
    path: "/user-group/edit/:id",
    action: "User updated user group!",
  },
  deleteUserGroup: {
    path: "/user-group/delete/:id",
    action: "User deleted user group!",
  },
  addMultipleUsersToGroup: {
    path: "/user-group/add-multiple",
    action: "User added multiple users to user group!",
  },
};

export default userGroupPaths;
