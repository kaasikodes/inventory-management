import { TPath } from "../types/path";

const authPaths: TPath = {
  register: {
    path: "/register",
    action: "New user registered on system!",
  },
  userVerification: {
    path: "/user-verification",
    action: "User account verified successfully",
  },
  login: {
    path: "/login",
    action: "User logged in successfully!",
  },
  forgotPassword: {
    path: "/forgot-password",
    action: "User indicated that he/she forgot password!",
  },
  resetPassword: {
    path: "/reset-password",
    action: "User reset their password!",
  },
  newAccessToken: {
    path: "/new-access-token",
    action: "New Access token issued to user!",
  },
  logout: {
    path: "/logout",
    action: "User loggged out successfully!",
  },
  authProfile: {
    path: "/auth/me/profile",
    action: "User accessed their user profile!",
  },
  changePassword: {
    path: "/auth/me/change-password",
    action: "User changed password!",
  },
};

export default authPaths;
