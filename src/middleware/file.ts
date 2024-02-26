import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { AppError } from "../types/error";
import csvParser from "csv-parser";

export const parseCsvFileToRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const csvFile = req?.file;
  if (!csvFile) {
    return next(
      new AppError("Validation Error", 400, [
        {
          message: `No import file found!`,
        },
      ])
    );
  }
  let csvFileContent: Record<string, string | number>[] = [];
  fs.createReadStream(csvFile.path)
    .pipe(csvParser())
    .on("data", (data) => {
      csvFileContent = [...csvFileContent, data];
    })
    .on("error", (error) => {
      return next(
        new AppError("Error parsing csv file", 500, [
          {
            message: error?.message,
          },
        ])
      );
    })
    .on("end", () => {
      req.body = {
        data: csvFileContent,
      };
      fs.unlink(csvFile?.path, () => {
        console.log("File deleted successfully");
      });

      next();
    });
};
