import { NextFunction, Request, Response } from "express";
import {
  retrievePermissions,
  createDefaultPermissions,
} from "../services/permission";
import { TPaginationQuery, TSearchQuery } from "../types/generic";
import {
  AppJSONResponse,
  AppJSONResponseWithPagination,
} from "../types/reponse";

export const getPermissions = async (
  req: Request<{}, {}, {}, TPaginationQuery & TSearchQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize, search } = req.query;

    const { metaData, data } = await retrievePermissions({
      pagination: {
        lastItemIndex,
        pageSize,
      },
      search,
    });

    const jsonReponse = new AppJSONResponseWithPagination(
      "Permissions retrieved successfully!",
      {
        lastItemIndex: metaData.lastIndex,
        result: data,
        total: metaData.total,
        hasNextPage: metaData.hasNextPage,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};

export const initializePermissions = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const permissions = await createDefaultPermissions();

    const jsonReponse = new AppJSONResponse(
      "Permissions initialized successfully!",
      {
        permissions,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
