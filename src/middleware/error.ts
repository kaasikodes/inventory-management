import { NextFunction, Request, Response } from "express";
import { AppError } from "../types/error";
import { MulterError } from "multer";

export const errorHandler = (
  err: AppError | Error,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  console.error(err.stack);
  if (err instanceof AppError) {
    return res.status(err?.status).json({
      message: err.message,
      errors: err.errors,
    });
  }
  // handle multer middleware file error, when user passes files instead of single file
  if (
    err instanceof MulterError &&
    err.name === "MulterError" &&
    err?.code === "LIMIT_UNEXPECTED_FILE"
  ) {
    return res.status(400).json({
      message: "Expected a single file, received multiple files!",
      error: err,
    });
  }
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
    error: err,
  });
};
