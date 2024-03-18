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
  // TODO: Update on postman the routes
  assignUsersToGroup: {
    path: "/user/assign-to-group",
    action: "User assigned users to group!",
  },
  removeUsersFromGroup: {
    path: "/user/remove-from-group",
    action: "User removed from users from group!",
  },
};

export default userPaths;
