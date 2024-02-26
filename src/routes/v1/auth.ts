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
    authPaths.register,
    validateRequestBody(registerUserSchema),
    registerUser
  );
  app.post(
    authPaths.userVerification,
    validateRequestBody(verifyUserSchema),
    verifyUser
  );
  app.post(authPaths.login, validateRequestBody(loginUserSchema), loginUser);
  app.post(
    authPaths.forgotPassword,
    validateRequestBody(forgotPasswordSchema),
    forgotPassword
  );
  app.post(
    authPaths.resetPassword,
    validateRequestBody(resetPasswordSchema),
    resetPassword
  );
  app.get(authPaths.newAccessToken, newUserAccessToken);

  app.get(authPaths.logout, verifyJwTToken, logoutUser);
  app.get(authPaths.authProfile, verifyJwTToken, userAuthProfile);
  app.patch(
    authPaths.changePassword,
    verifyJwTToken,
    validateRequestBody(changeAuthUserPasswordSchema),
    changeAuthUserPassword
  );
};

export default authRoutes;
