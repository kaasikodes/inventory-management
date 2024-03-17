import { NextFunction, Request, Response } from "express";
import { AppError } from "../types/error";
import config from "../_config";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { getAccountForTokenMonitoring } from "../services/token.service";
import { REFRESH_TOKEN_COOKIE_NAME } from "../controllers/auth.controller";

export type TJwtUserPayload = Pick<User, "id" | "name" | "email">;

declare global {
  namespace Express {
    interface Request {
      user?: TJwtUserPayload;
    }
  }
}

// TODO: Create Different middleware for access token and refresh token
export const verifyJwTToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hasAuthorization = req.headers["authorization"];
  console.log(req.cookies, "COOKIES_");
  let refreshToken = req?.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
  let userId = "";

  if (!refreshToken) {
    return next(
      new AppError(
        "Unauthenticated request. Please ensure you are logged in.",
        401
      )
    );
  }
  if (!hasAuthorization) {
    return next(new AppError("No Authorization header provided.", 401));
  }
  const accessToken = hasAuthorization.split(" ")[1];
  if (!accessToken) {
    return next(new AppError("No access token provided", 401));
  }
  jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET, (err, user: unknown) => {
    if (err) {
      return next(
        new AppError("Invalid token", 401, [
          { token: "Token present but invalid" },
        ])
      );
    }
    req.user = user as TJwtUserPayload | undefined;
    userId = req?.user?.id as string;
    if (!userId) {
      return next(new AppError("User is absent from token", 401));
    }
  });
  const account = await getAccountForTokenMonitoring({
    refreshToken,
    userId,
    accessToken,
  });
  if (account === null) {
    return next(
      new AppError("User has been logged out! Please try logging in.", 401)
    );
  }
  next();
};
