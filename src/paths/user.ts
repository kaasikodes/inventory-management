const userPaths = {
  addUser: {
    path: "/add-user",
    action: "User added user!",
  },
  getUser: {
    path: "/user/:id",
    action: "User accessed user!",
  },
  getUsers: {
    path: "/users",
    action: "User accessed users!",
  },
  updateUser: {
    path: "/user/edit/:id",
    action: "User updated user!",
  },
  deleteUser: {
    path: "/user/delete/:id",
    action: "User deleted user!",
  },
  changeUserStatusInBulk: {
    path: "/user/change-status",
    action: "User changed user status in bulk!",
  },
  getUserImportTemplate: {
    path: "/user/bulk/template",
    action: "User accessed user import template!",
  },
  importUsers: {
    path: "/user/bulk/import",
    action: "User imported users!",
  },
  assignUsersToGroup: {
    path: "/user/assign",
    action: "User assigned users to group!",
  },
};

export default userPaths;
