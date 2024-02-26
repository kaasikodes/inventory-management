import { NextFunction, Request, Response } from "express";

import {
  AppJSONResponse,
  AppJSONResponseWithPagination,
} from "../types/reponse";
import { TPaginationQuery, TSearchQuery } from "../types/generic";
import {
  retrieveAuditRecord,
  retrieveAuditRecords,
} from "../services/audit.service";

export const getAuditRecords = async (
  req: Request<
    {},
    {},
    {},
    TPaginationQuery & TSearchQuery & { userId?: string }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize, search, userId } = req.query;

    const { metaData, data } = await retrieveAuditRecords({
      pagination: {
        lastItemIndex,
        pageSize,
      },
      search,
      invokerId: userId,
    });

    const jsonReponse = new AppJSONResponseWithPagination(
      "Audit records retrieved successfully!",
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
export const getAuditRecord = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await retrieveAuditRecord({
      id,
    });

    const jsonReponse = new AppJSONResponse("Audit retrieved successfully!", {
      data,
    });
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
