import { NextFunction, Request, Response } from "express";
import { importUsersSchema } from "../validation/user";
import { z } from "zod";
import { checkExistingUserEmails } from "../services/user.service";
import { AppError } from "../types/error";

export const checkUniquenessOfEmailsDuringImport = async (
  req: Request<{}, {}, z.infer<typeof importUsersSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data } = req.body;
    const validationData = await checkExistingUserEmails({
      emails: data.map(({ email }) => email),
    });
    if (validationData.allEmailsAreTaken) {
      return next(
        new AppError("Validation Error", 400, [
          {
            message:
              "All Emails that are specified in your import file are already taken",
          },
        ])
      );
    }
    // TODO: Ensure the array of errors adhere to a type like {message:string}[] for constitency
    if (validationData.emailsTaken.length > 0) {
      const emailsTaken = validationData.emailsTaken.map(({ email }) => email);
      return next(
        new AppError("Validation Error", 400, [
          {
            message: `The following emails that are specified in your import file are already taken: ${emailsTaken.join(
              ","
            )}. A total of ${emailsTaken.length} emails.`,
          },
        ])
      );
    }

    return next();
  } catch (error) {
    return next(error);
  }
  next();
};
