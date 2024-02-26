import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import {
  AppJSONResponse,
  AppJSONResponseWithPagination,
} from "../types/reponse";
import { TPaginationQuery, TSearchQuery } from "../types/generic";
import { AppError } from "../types/error";
import {
  addMultipleInventoryItems,
  createInventoryItem,
  deleteInventoryItem,
  retrieveInventoryItem,
  retrieveInventoryItems,
  updateInventoryItem,
} from "../services/inventory-item";
import {
  addInventoryItemSchema,
  editInventoryItemSchema,
  importInventoryItemsSchema,
} from "../validation/inventory-item";
import {
  createInputOutputRatio,
  updateInputOutputRatio,
} from "../services/input-output-ratio";
import { exportCsvFile } from "../lib/file";
import { retrieveMeasurementUnits } from "../services/measurement-unit";
import { TImportInventoryItem } from "../types/import";

export const getInventoryItems = async (
  req: Request<{}, {}, {}, TPaginationQuery & TSearchQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize, search } = req.query;

    const { metaData, data } = await retrieveInventoryItems({
      pagination: {
        lastItemIndex,
        pageSize,
      },
      search,
    });

    const jsonReponse = new AppJSONResponseWithPagination(
      "Inventory items retrieved successfully!",
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
export const getInventoryItem = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await retrieveInventoryItem({
      id,
    });

    const jsonReponse = new AppJSONResponse(
      "Inventory item retrieved successfully!",
      {
        data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const removeInventoryItem = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await deleteInventoryItem({
      id,
    });

    const jsonReponse = new AppJSONResponse(
      "Inventory item deleted successfully!",
      {
        data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const editInventoryItem = async (
  req: Request<{ id: string }, {}, z.infer<typeof editInventoryItemSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const {
      growthPeriodInSecs,
      inputOutputRatio,
      minStockThreshold,
      name,
      description,
      measurementUnitId,
    } = req.body;
    const { input, output } = inputOutputRatio;
    const item = await retrieveInventoryItem({ id });
    if (item === null) {
      throw new AppError("Inventory Item not found", 404);
    }
    const ratio = await updateInputOutputRatio({
      id: item?.inputOutputRatioId,
      data: {
        input,
        output,
      },
    });

    const user = await updateInventoryItem({
      id,
      data: {
        growthPeriodInSecs,
        inputOutputRatioId: ratio.id,
        minStockThreshold,
        name,
        description,
        measurementUnitId,
      },
    });

    const jsonReponse = new AppJSONResponse(
      "Inventory item updated successfully!",
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
export const addInventoryItem = async (
  req: Request<{}, {}, z.infer<typeof addInventoryItemSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      growthPeriodInSecs,
      inputOutputRatio,
      minStockThreshold,
      name,
      description,
      measurementUnitId,
    } = req.body;
    const { input, output } = inputOutputRatio;
    const ratio = await createInputOutputRatio({
      input,
      output,
    });
    const user = await createInventoryItem({
      growthPeriodInSecs,
      inputOutputRatioId: ratio.id,
      minStockThreshold,
      name,
      description,
      measurementUnitId,
    });

    const jsonReponse = new AppJSONResponse(
      "Inventory item created successfully!",
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
export const importInventoryItems = async (
  req: Request<{}, {}, z.infer<typeof importInventoryItemsSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data } = req.body;

    const items = await addMultipleInventoryItems({
      data: data.map(
        ({
          growthPeriodInSecs,
          measurementUnitId,
          inputOutputRatioId,
          name,
          minStockThreshold,
          description,
        }) => ({
          growthPeriodInSecs,
          measurementUnitId,
          inputOutputRatioId,
          name,
          minStockThreshold,
          description,
        })
      ),
    });

    const jsonReponse = new AppJSONResponse(
      `${data.length} inventory items added successfully!`,
      {
        items,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};

export const exportInventoryImportTemplate = async (
  req: Request,
  res: Response
) => {
  const measurementUnits = await retrieveMeasurementUnits({});
  const csvData: TImportInventoryItem[] = [
    {
      name: "John Doe",
      description: "john doe",
      input: 2,
      output: 2,
      measurementUnit: measurementUnits.data.map(({ name }) => name).join(","),
      minStockThreshold: 300,
      growthPeriodInSecs: 56900,
    },
  ];
  return exportCsvFile({ csvData, fileName: "inventory-import-template" })(
    req,
    res
  );
};
