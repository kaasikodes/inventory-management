import { CookieOptions, NextFunction, Request, Response } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import {
  changeAuthUserPasswordSchema,
  forgotPasswordSchema,
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from "../validation/auth";
import config from "../_config";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserPassword,
} from "../services/user.service";
import {
  doesUserPasswordMatch,
  hashPassword,
  verifyUserAccount,
} from "../services/auth.service";
import { AppError } from "../types/error";
import {
  getUserVerificationToken,
  deleteVerificationToken,
  createAccessToken,
  createRefreshToken,
  createVerificationToken,
  createPasswordResetToken,
  getUserPasswordResetToken,
  deletePasswordResetToken,
  createAccountForTokenMonitoring,
  deleteAccountForTokenMonitoring,
  updateAccountForTokenMonitoringAccessToken,
  getAccountForTokenMonitoring,
} from "../services/token.service";
import {
  sendAccountVerificationEmail,
  sendResetPasswordEmail,
} from "../services/mail.service";
import { AppJSONResponse } from "../types/reponse";
import { TJwtUserPayload } from "../middleware/auth";
export const REFRESH_TOKEN_COOKIE_NAME = "jwt";
const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge: config.maxAgeOfRefreshTokenInCookie,
};
export const resetPassword = async (
  req: Request<{}, {}, z.infer<typeof resetPasswordSchema>>,
  res: Response,
  next: NextFunction
) => {
  const { email, newPassword, token } = req.body;
  const user = await getUserByEmail({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const pwdResetToken = await getUserPasswordResetToken({ email, token });
  if (!pwdResetToken) {
    return next(new AppError("Password reset token not found", 404));
  }
  const tokenHasExpired =
    pwdResetToken && new Date(pwdResetToken?.expires) < new Date();
  if (tokenHasExpired) {
    next(new AppError("Password reset token has expired", 400));
  }

  await deletePasswordResetToken({ id: pwdResetToken.id });
  // hash password & update
  const hashedPassword = await hashPassword({ password: newPassword });
  await updateUserPassword({ userId: user.id, hashedPassword });

  // create access and refresh token
  const accessToken = createAccessToken({
    email: user.email,
    id: user.id,
    name: user.name,
  });
  const refreshToken = createRefreshToken({
    email: user.email,
    id: user.id,
    name: user.name,
  });
  await createAccountForTokenMonitoring({
    accessToken,
    refreshToken,
    userId: user.id,
  });

  try {
    // set refresh token in cookie

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS
    );
    const jsonReponse = new AppJSONResponse(
      "Password has been reset successfully!",
      {
        email: user.email,
        id: user.id,
        name: user.name,
        accessToken,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const forgotPassword = async (
  req: Request<{}, {}, z.infer<typeof forgotPasswordSchema>>,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const user = await getUserByEmail({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const resetPasswordToken = await createPasswordResetToken({ email });
  sendResetPasswordEmail({ email, token: resetPasswordToken.token });
  try {
    return res
      .status(200)
      .json(
        new AppJSONResponse(
          "Please check your email a reset password link has been sent."
        )
      );
  } catch (error) {
    next(error);
  }
};
export const changeAuthUserPassword = async (
  req: Request<{}, {}, z.infer<typeof changeAuthUserPasswordSchema>>,
  res: Response,
  next: NextFunction
) => {
  const { oldPassword, password, confirmPassword } = req.body;
  const user =
    req.user?.email && (await getUserByEmail({ email: req.user?.email }));
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const isPasswordCorrect =
    user.password &&
    (await doesUserPasswordMatch({
      password: oldPassword,
      userPassword: user.password,
    }));
  if (!isPasswordCorrect) {
    return next(new AppError("Old Password is incorrect!", 404));
  }
  if (password !== confirmPassword) {
    return next(new AppError("Passwords do not match!", 404));
  }
  const hashedPassword = await hashPassword({ password });
  const updatedUser = await updateUserPassword({
    userId: user.id,
    hashedPassword,
  });
  return res
    .status(200)
    .json(new AppJSONResponse("Password updated successfully", updatedUser));
};
export const userAuthProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //
    const authUser = req.user;
    if (!authUser) {
      throw new AppError("Authenticated user absent", 400);
    }
    const user = await getUserById({ id: authUser?.id });
    return res.status(200).json(
      new AppJSONResponse("Authenticated User Profile retrieved!", {
        ...authUser,
        user,
      })
    );
  } catch (error) {
    next(error);
  }
};
export const loginUser = async (
  req: Request<{}, {}, z.infer<typeof loginUserSchema>>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const user = await getUserByEmail({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const isPasswordCorrect =
    user.password &&
    (await doesUserPasswordMatch({ password, userPassword: user.password }));
  if (!isPasswordCorrect) {
    return next(new AppError("Password is incorrect", 400));
  }
  const isUserAccountVerified = user.emailVerified !== null;
  if (!isUserAccountVerified) {
    const verificationToken = await createVerificationToken({ email });
    sendAccountVerificationEmail({ email, token: verificationToken.token });
    return next(
      new AppError(
        "User account not verified. Please check your email a verification link has been sent.",
        400
      )
    );
  }
  if (user.status === "BLACKLISTED") {
    return next(
      new AppError(
        "User account has been blacklisted. Please contact support.",
        400
      )
    );
  }

  // create access and refresh token
  const accessToken = createAccessToken({
    email: user.email,
    id: user.id,
    name: user.name,
  });
  const refreshToken = createRefreshToken({
    email: user.email,
    id: user.id,
    name: user.name,
  });

  await createAccountForTokenMonitoring({
    accessToken,
    refreshToken,
    userId: user.id,
  });

  try {
    // set refresh token in cookie

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS
    );
    const jsonReponse = new AppJSONResponse(
      "User Authenticated successfully!",
      {
        email: user.email,
        id: user.id,
        name: user.name,
        accessToken,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    return next(error);
  }
};
export const newUserAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user: TJwtUserPayload | undefined = req.user;
  let refreshToken = req?.headers?.["cookie"]?.split("=")?.[1];
  if (!refreshToken) {
    return next(new AppError("No Refresh token", 401));
  }

  if (user === undefined) {
    return next(new AppError("User__ is absent from Refresh token", 401));
  }
  const { email, id, name } = user as TJwtUserPayload;
  // create access and refresh token
  const accessToken = createAccessToken({
    ...{
      email,
      id,
      name,
    },
  });
  await updateAccountForTokenMonitoringAccessToken({
    refreshToken,
    accessToken,
    userId: id,
  });

  try {
    const jsonReponse = new AppJSONResponse(
      "New Access Token issued successfully!",
      {
        ...(user as TJwtUserPayload),
        accessToken,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    return next(error);
  }
};
export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let refreshToken = req?.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
    let userId = req.user?.id;
    if (!refreshToken) {
      return next(new AppError("No Refresh token", 401));
    }
    if (!userId) {
      return next(new AppError("User Id absent in request!", 401));
    }
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_OPTIONS);
    const account = await getAccountForTokenMonitoring({
      refreshToken,
      userId,
    });
    account && (await deleteAccountForTokenMonitoring({ id: account?.id }));

    const jsonReponse = new AppJSONResponse("User logged out successfully!");
    return res.status(204).json(jsonReponse);
  } catch (error) {
    return next(
      new AppError((error as Error)?.message ?? "Unknown error", 401)
    );
  }
};
export const verifyUser = async (
  req: Request<{}, {}, z.infer<typeof verifyUserSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, token } = req.body;
    console.log("EMAIL", email);
    // check for wether user exists
    const userExists = await getUserByEmail({ email });
    if (!userExists) {
      return next(new AppError("User not found", 404));
    }
    const user = await verifyUserAccount({ email });
    const verificationToken = await getUserVerificationToken({ email, token });
    if (!verificationToken) {
      return next(new AppError("Verification token not found", 404));
    }
    const tokenHasExpired =
      verificationToken && new Date(verificationToken?.expires) < new Date();
    if (tokenHasExpired) {
      return next(new AppError("Verification token has expired", 400));
    }

    await deleteVerificationToken({ id: verificationToken.id });

    // TODO: Refactor the logic below to be a single callable fn
    // create access and refresh token
    const accessToken = createAccessToken({
      email: user.email,
      id: user.id,
      name: user.name,
    });
    const refreshToken = createRefreshToken({
      email: user.email,
      id: user.id,
      name: user.name,
    });
    await createAccountForTokenMonitoring({
      accessToken,
      refreshToken,
      userId: user.id,
    });

    // set refresh token in cookie

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS
    );
    const jsonReponse = new AppJSONResponse(
      "User Account Verified successfully!",
      {
        email: user.email,
        id: user.id,
        name: user.name,
        accessToken,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    return next(error);
  }
};

export const registerUser = async (
  req: Request<{}, {}, z.infer<typeof registerUserSchema>>,
  res: Response,
  next: NextFunction
) => {
  const { email, name, password } = req.body;
  const hashedPassword = await hashPassword({ password });
  const isEmailTakenByAnotherUser = await getUserByEmail({ email });
  if (isEmailTakenByAnotherUser) {
    return next(new AppError("Email already taken", 400));
  }
  await createUser({
    email,
    name,
    hashedPassword,
  });

  const verificationToken = await createVerificationToken({ email });
  sendAccountVerificationEmail({ email, token: verificationToken.token });
  try {
    return res
      .status(200)
      .json(
        new AppJSONResponse(
          "User account created! Please check your email a verification link has been sent."
        )
      );
  } catch (error) {
    next(error);
  }
};
