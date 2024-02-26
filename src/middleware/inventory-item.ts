import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { AppError } from "../types/error";
import csvParser from "csv-parser";
import { TImportInventoryItem } from "../types/import";
import { z } from "zod";
import { importInventoryItemsSchema } from "../validation/inventory-item";
import { retrieveMeasurementUnitByName } from "../services/measurement-unit";
import { createInputOutputRatio } from "../services/input-output-ratio";

export const convertImportRequestBodyToAcceptableInventoryItemFormat = async (
  req: Request<
    {},
    {},
    | {
        data: TImportInventoryItem[];
      }
    | z.infer<typeof importInventoryItemsSchema>
  >,
  res: Response,
  next: NextFunction
) => {
  const { data } = req.body;
  const incomingData = data as TImportInventoryItem[];
  //   find the measurement unit specified in the import
  // create the input output ratios
  const transformedData: z.infer<typeof importInventoryItemsSchema>["data"] =
    await Promise.all(
      incomingData.map(
        async ({
          description,
          growthPeriodInSecs,
          input,
          measurementUnit,
          minStockThreshold,
          name,
          output,
        }): Promise<z.infer<typeof importInventoryItemsSchema>["data"][0]> => {
          const unit = await retrieveMeasurementUnitByName({
            name: measurementUnit,
          });
          const ratio = await createInputOutputRatio({ input, output });
          if (!unit) throw new AppError("Measurement unit not found", 404);
          return {
            description,
            growthPeriodInSecs,
            minStockThreshold,
            name,
            measurementUnitId: unit?.id,
            inputOutputRatioId: ratio?.id,
          };
        }
      )
    );

  // convert import data to acceptable format
  req.body = {
    data: transformedData,
  };
  next();
};
