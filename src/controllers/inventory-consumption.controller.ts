import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import {
  AppJSONResponse,
  AppJSONResponseWithPagination,
} from "../types/reponse";
import { TPaginationQuery } from "../types/generic";
import { AppError } from "../types/error";
import {
  getInventoryItemAvailableSupplies,
  getInventoryItemAvailableSupplyAmount,
  updateInventorySupplyAvailableAmount,
  updateInventorySupplyTotalAmount,
} from "../services/inventory-supply";
import {
  addInventoryConsumptionSchema,
  updateInventoryConsumptionProduceInfoSchema,
} from "../validation/inventory-consumption";
import {
  createInventoryConsumptionRecord,
  deleteInventoryConsumptionRecord,
  retrieveInventoryConsumptionRecord,
  retrieveInventoryConsumptionRecords,
  updateInventoryConsumptionProduceInfo,
} from "../services/inventory-consumption";

export const getInventoryConsumptionRecords = async (
  req: Request<{}, {}, {}, TPaginationQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize } = req.query;

    const { metaData, data } = await retrieveInventoryConsumptionRecords({
      pagination: {
        lastItemIndex,
        pageSize,
      },
    });

    const jsonReponse = new AppJSONResponseWithPagination(
      "Inventory consumption records retrieved successfully!",
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
export const getInventoryConsumptionRecord = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await retrieveInventoryConsumptionRecord({
      id,
    });

    const jsonReponse = new AppJSONResponse(
      "Inventory consumption record retrieved successfully!",
      {
        data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const removeInventoryConsumptionRecord = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const consumptionRecord = await deleteInventoryConsumptionRecord({
      id,
    });
    // update available supply amount
    await Promise.all(
      consumptionRecord.amountConsumed.map(async (item) => {
        await updateInventorySupplyAvailableAmount({
          id: item.supplyRecordId,
          data: {
            availableAmount:
              item.amountTaken + item.supplyRecord.availableAmount,
          },
        });
      })
    );

    const jsonReponse = new AppJSONResponse(
      "Inventory consumption record deleted successfully!",
      {
        consumptionRecord,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};

export const editConsumptionRecordProduceInfo = async (
  req: Request<
    { id: string },
    {},
    z.infer<typeof updateInventoryConsumptionProduceInfoSchema>
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { amountProduced, dateProduceWasRealized, produceConditionId } =
      req.body;
    const authUser = req.user;
    if (!authUser) {
      throw new AppError("User not found", 404);
    }

    const data = await updateInventoryConsumptionProduceInfo({
      id,
      data: {
        amountProduced,
        dateProduceWasRealized,
        produceConditionId,
        lastModifiedBy: authUser.id,
      },
    });

    const jsonReponse = new AppJSONResponse(
      "Inventory consumption produce info updated successfully!",
      {
        ...data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};

export const addConsumptionRecord = async (
  req: Request<{}, {}, z.infer<typeof addInventoryConsumptionSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { inventoryItemId, quantityToBeConsumed, dateConsumed } = req.body;
    const authUser = req.user;
    if (!authUser) {
      throw new AppError("User not found", 404);
    }
    // first check wether there is a sufficient supply to fund the consumption
    const availableSupplyAmount = await getInventoryItemAvailableSupplyAmount({
      inventoryItemId,
    });
    if (availableSupplyAmount < quantityToBeConsumed) {
      throw new AppError("Insufficient Inventory supply", 400);
    }
    const availableSupplies = await getInventoryItemAvailableSupplies({
      inventoryItemId,
    });
    let totalAmountTakenFromSelectedSupplies = 0;
    const supplyRecordsToBeConsumed: {
      amountTaken: number;
      supplyRecordId: string;
    }[] = [];
    let i = 0;
    while (i < availableSupplies.length) {
      // edge cases
      // a single item is equal to the quantity to be consumed
      // a single item is less than the quantity to be consumed
      // a single item is greater than the quantity to be consumed
      let amountToBeTaken = 0;
      const quantityRemainingToBeConsumed =
        quantityToBeConsumed - totalAmountTakenFromSelectedSupplies;

      if (
        availableSupplies[i].availableAmount === quantityRemainingToBeConsumed
      ) {
        amountToBeTaken = availableSupplies[i].availableAmount;
      }
      if (
        availableSupplies[i].availableAmount < quantityRemainingToBeConsumed
      ) {
        amountToBeTaken = availableSupplies[i].availableAmount;
      }
      if (
        availableSupplies[i].availableAmount > quantityRemainingToBeConsumed
      ) {
        amountToBeTaken = quantityRemainingToBeConsumed;
      }

      supplyRecordsToBeConsumed.push({
        amountTaken: amountToBeTaken,
        supplyRecordId: availableSupplies[i].id,
      });
      if (totalAmountTakenFromSelectedSupplies === amountToBeTaken) {
        break;
      }

      totalAmountTakenFromSelectedSupplies += amountToBeTaken;
      await updateInventorySupplyAvailableAmount({
        id: availableSupplies[i].id,
        data: {
          availableAmount:
            availableSupplies[i].availableAmount - amountToBeTaken,
        },
      });

      i++;
    }

    const record = await createInventoryConsumptionRecord({
      inventoryItemId,
      amountConsumed: supplyRecordsToBeConsumed,

      addedBy: authUser.id,
      lastModifiedBy: authUser.id,
      dateConsumed,
    });

    const jsonReponse = new AppJSONResponse(
      "Inventory consumption record created successfully!",
      {
        ...record,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
