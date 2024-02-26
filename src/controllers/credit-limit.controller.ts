import { z } from "zod";
import { NextFunction, Request, Response } from "express";

import {
  AppJSONResponse,
  AppJSONResponseWithPagination,
} from "../types/reponse";
import { TPaginationQuery, TSearchQuery } from "../types/generic";
import {
  createCreditLimit,
  deleteCreditLimit,
  retrieveCreditLimits,
  updateCreditLimit,
} from "../services/credit-limit";
import {
  addCreditLimitSchema,
  updateCreditLimitSchema,
} from "../validation/credit-limit";

export const getCreditLimits = async (
  req: Request<{}, {}, {}, TPaginationQuery & TSearchQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize, search } = req.query;

    const { metaData, data } = await retrieveCreditLimits({
      pagination: {
        lastItemIndex,
        pageSize,
      },
      search,
    });

    const jsonReponse = new AppJSONResponseWithPagination(
      "Credit limit retrieved successfully!",
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
export const removeCreditLimit = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await deleteCreditLimit({
      id,
    });

    const jsonReponse = new AppJSONResponse(
      "Credit limit deleted successfully!",
      {
        data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const editCreditLimit = async (
  req: Request<{ id: string }, {}, z.infer<typeof updateCreditLimitSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const user = await updateCreditLimit({
      id,
      data: { name, description },
    });

    const jsonReponse = new AppJSONResponse(
      "Credit limit updated successfully!",
      {
        name,
        description,
        id: user.id,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const addCreditLimit = async (
  req: Request<{}, {}, z.infer<typeof addCreditLimitSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;

    const user = await createCreditLimit({
      name,
      description,
    });

    const jsonReponse = new AppJSONResponse(
      "Credit limit created successfully!",
      {
        name,
        description,
        id: user.id,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
