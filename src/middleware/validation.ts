import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodAny, ZodError, ZodObject, ZodType } from "zod";
import { AppError } from "../types/error";
import { TFileType } from "../types/generic";
import config from "../_config";

// TODO: Rename and refactor this to be the request object validation middleware, as most validations here partain to that
export const validateRequestSingleFile =
  ({
    fileInputName,
    allowedFileTypes,
    maxFileSize = config.DEFAULT_MAX_FILE_UPLOAD_SIZE,
  }: {
    fileInputName: string;
    allowedFileTypes: TFileType[];
    maxFileSize?: number;
  }) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.files !== undefined) {
        return next(
          new AppError("Validation Error", 400, [
            { message: `Only a single file is expected` },
          ])
        );
      }
      if (req.file === undefined) {
        return next(
          new AppError("Validation Error", 400, [
            { message: `No file provided` },
          ])
        );
      }
      if (req.file.fieldname !== fileInputName) {
        return next(
          new AppError("Validation Error", 400, [
            {
              message: `The filename should be ${fileInputName} and not ${req.file.filename}`,
            },
          ])
        );
      }
      if (allowedFileTypes.includes(req.file.mimetype as TFileType) === false) {
        return next(
          new AppError("Validation Error", 400, [
            {
              message: `The allowed file types are ${allowedFileTypes.join(
                ", "
              )}`,
            },
          ])
        );
      }
      if (req.file.size > maxFileSize) {
        return next(
          new AppError("Validation Error", 400, [
            {
              message: `The maximum allowed file size is ${maxFileSize} bytes`,
            },
          ])
        );
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path.join(","),
        }));
        return next(new AppError("Validation Error", 400, errors));
      }
    }
    next();
  };
export const validateRequestBody =
  (schema: ZodAny | ZodObject<any> | ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path.join(","),
        }));
        return next(new AppError("Validation Error", 400, errors));
      }
    }
    next();
  };
