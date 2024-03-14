import { Router } from "express";
import { validateRequestBody } from "../../middleware/validation";
import {
  changeAuthUserPassword,
  forgotPassword,
  loginUser,
  logoutUser,
  newUserAccessToken,
  registerUser,
  resetPassword,
  userAuthProfile,
  verifyUser,
} from "../../controllers/auth.controller";
import {
  changeAuthUserPasswordSchema,
  forgotPasswordSchema,
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from "../../validation/auth";
import { verifyJwTToken } from "../../middleware/auth";
import authPaths from "../../paths/auth";

const authRoutes = (app: Router) => {
  app.post(
    authPaths.register.path as string,
    validateRequestBody(registerUserSchema),
    registerUser
  );
  app.post(
    authPaths.userVerification.path as string,
    validateRequestBody(verifyUserSchema),
    verifyUser
  );
  app.post(
    authPaths.login.path as string,
    validateRequestBody(loginUserSchema),
    loginUser
  );
  app.post(
    authPaths.forgotPassword.path as string,
    validateRequestBody(forgotPasswordSchema),
    forgotPassword
  );
  app.post(
    authPaths.resetPassword.path as string,
    validateRequestBody(resetPasswordSchema),
    resetPassword
  );
  app.get(authPaths.newAccessToken.path as string, newUserAccessToken);

  app.get(authPaths.logout.path as string, verifyJwTToken, logoutUser);
  app.get(
    authPaths.authProfile.path as string,
    verifyJwTToken,
    userAuthProfile
  );
  app.patch(
    authPaths.changePassword.path as string,
    verifyJwTToken,
    validateRequestBody(changeAuthUserPasswordSchema),
    changeAuthUserPassword
  );
};

export default authRoutes;
