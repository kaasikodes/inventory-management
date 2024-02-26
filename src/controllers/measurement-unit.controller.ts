import { z } from "zod";
import { NextFunction, Request, Response } from "express";

import {
  AppJSONResponse,
  AppJSONResponseWithPagination,
} from "../types/reponse";
import { TPaginationQuery, TSearchQuery } from "../types/generic";
import {
  createMeasurementUnit,
  deleteMeasurementUnit,
  retrieveMeasurementUnits,
  updateMeasurementUnit,
} from "../services/measurement-unit";
import {
  addMeasurementUnitSchema,
  editMeasurementUnitSchema,
} from "../validation/measurement-unit";

export const getMeasurementUnits = async (
  req: Request<{}, {}, {}, TPaginationQuery & TSearchQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize, search } = req.query;

    const { metaData, data } = await retrieveMeasurementUnits({
      pagination: {
        lastItemIndex,
        pageSize,
      },
      search,
    });

    const jsonReponse = new AppJSONResponseWithPagination(
      "Measurement Units retrieved successfully!",
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
export const removeMeasurementUnit = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await deleteMeasurementUnit({
      id,
    });

    const jsonReponse = new AppJSONResponse(
      "Measurement Unit deleted successfully!",
      {
        data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const editMeasurementUnit = async (
  req: Request<{ id: string }, {}, z.infer<typeof editMeasurementUnitSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const user = await updateMeasurementUnit({
      id,
      data: { name },
    });

    const jsonReponse = new AppJSONResponse(
      "Measurement Unit updated successfully!",
      {
        name,
        id: user.id,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const addMeasurementUnit = async (
  req: Request<{}, {}, z.infer<typeof addMeasurementUnitSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    const user = await createMeasurementUnit({
      name,
    });

    const jsonReponse = new AppJSONResponse(
      "Measurement Unit created successfully!",
      {
        name,
        id: user.id,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
