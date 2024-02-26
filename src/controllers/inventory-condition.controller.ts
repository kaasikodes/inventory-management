import { z } from "zod";

import { NextFunction, Request, Response } from "express";

import {
  AppJSONResponse,
  AppJSONResponseWithPagination,
} from "../types/reponse";
import { TPaginationQuery, TSearchQuery } from "../types/generic";
import {
  createInventoryItemCondition,
  deleteInventoryItemCondition,
  retrieveInventoryItemCondition,
  retrieveInventoryItemConditions,
  updateInventoryItemCondition,
} from "../services/inventory-condition";
import {
  addInventoryConditionSchema,
  editInventoryConditionSchema,
} from "../validation/inventory-condition";

export const getInventoryItemConditions = async (
  req: Request<{}, {}, {}, TPaginationQuery & TSearchQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize, search } = req.query;

    const { metaData, data } = await retrieveInventoryItemConditions({
      pagination: {
        lastItemIndex,
        pageSize,
      },
      search,
    });

    const jsonReponse = new AppJSONResponseWithPagination(
      "Conditions retrieved successfully!",
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
export const getInventoryItemCondition = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await retrieveInventoryItemCondition({
      id,
    });

    const jsonReponse = new AppJSONResponse(
      "Condition retrieved successfully!",
      {
        data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const removeInventoryItemCondition = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await deleteInventoryItemCondition({
      id,
    });

    const jsonReponse = new AppJSONResponse("Condition deleted successfully!", {
      data,
    });
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const editInventoryItemCondition = async (
  req: Request<
    { id: string },
    {},
    z.infer<typeof editInventoryConditionSchema>
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, rating } = req.body;

    const user = await updateInventoryItemCondition({
      id,
      data: { name, rating },
    });

    const jsonReponse = new AppJSONResponse("Condition updated successfully!", {
      name,
      rating,
      id: user.id,
    });
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};

export const addInventoryItemCondition = async (
  req: Request<{}, {}, z.infer<typeof addInventoryConditionSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, rating } = req.body;

    const user = await createInventoryItemCondition({
      name,
      rating,
    });

    const jsonReponse = new AppJSONResponse("Condition created successfully!", {
      name,
      rating,
      id: user.id,
    });
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
