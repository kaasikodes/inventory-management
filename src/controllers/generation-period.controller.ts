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
import {
  addGenerationPeriodSchema,
  updateGenerationPeriodSchema,
} from "../validation/generation-period";
import {
  createGenerationPeriod,
  deleteGenerationPeriod,
  retrieveGenerationPeriods,
  updateGenerationPeriod,
} from "../services/generation-period";

export const getGenerationPeriods = async (
  req: Request<{}, {}, {}, TPaginationQuery & TSearchQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize, search } = req.query;

    const { metaData, data } = await retrieveGenerationPeriods({
      pagination: {
        lastItemIndex,
        pageSize,
      },
      search,
    });

    const jsonReponse = new AppJSONResponseWithPagination(
      "Generation periods retrieved successfully!",
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
export const removeGenerationPeriod = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await deleteGenerationPeriod({
      id,
    });

    const jsonReponse = new AppJSONResponse(
      "Generation period deleted successfully!",
      {
        data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const editGenerationPeriod = async (
  req: Request<
    { id: string },
    {},
    z.infer<typeof updateGenerationPeriodSchema>
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate } = req.body;

    const user = await updateGenerationPeriod({
      id,
      data: { name, description, startDate, endDate },
    });

    const jsonReponse = new AppJSONResponse(
      "Generation period updated successfully!",
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
export const addGenerationPeriod = async (
  req: Request<{}, {}, z.infer<typeof addGenerationPeriodSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, endDate, startDate } = req.body;

    const user = await createGenerationPeriod({
      name,
      description,
      endDate,
      startDate,
    });

    const jsonReponse = new AppJSONResponse(
      "Generation period created successfully!",
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
