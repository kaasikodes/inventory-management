import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import {
  AppJSONResponse,
  AppJSONResponseWithPagination,
} from "../types/reponse";
import { TPaginationQuery } from "../types/generic";
import { AppError } from "../types/error";
import {
  createInventorySupplyRecord,
  deleteInventorySupplyRecord,
  retrieveInventorySupplyRecord,
  retrieveInventorySupplyRecords,
  updateInventorySupplyCondition,
  updateInventorySupplyEntryDate,
  updateInventorySupplyPhysicalParams,
  updateInventorySupplySupplier,
  updateInventorySupplyTotalAmount,
} from "../services/inventory-supply";
import {
  addSupplyRecordSchema,
  updateSupplyRecordConditionSchema,
  updateSupplyRecordEntryDateSchema,
  updateSupplyRecordPhysicalParamsSchema,
  updateSupplyRecordSupplierSchema,
  updateSupplyRecordTotalAmountSchema,
} from "../validation/inventory-supply";

export const getInventorySupplyRecords = async (
  req: Request<{}, {}, {}, TPaginationQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize } = req.query;

    const { metaData, data } = await retrieveInventorySupplyRecords({
      pagination: {
        lastItemIndex,
        pageSize,
      },
    });

    const jsonReponse = new AppJSONResponseWithPagination(
      "Inventory supply records retrieved successfully!",
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
export const getInventorySupplyRecord = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await retrieveInventorySupplyRecord({
      id,
    });

    const jsonReponse = new AppJSONResponse(
      "Inventory supply record retrieved successfully!",
      {
        data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const removeInventorySupplyRecord = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await deleteInventorySupplyRecord({
      id,
    });

    const jsonReponse = new AppJSONResponse(
      "Inventory supply record deleted successfully!",
      {
        data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const editInventorySupplyRecordCondition = async (
  req: Request<
    { id: string },
    {},
    z.infer<typeof updateSupplyRecordConditionSchema>
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { conditionId } = req.body;

    const data = await updateInventorySupplyCondition({
      id,
      data: {
        conditionId,
      },
    });

    const jsonReponse = new AppJSONResponse(
      "Inventory supply record updated successfully!",
      {
        ...data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const editInventorySupplyRecordEndDate = async (
  req: Request<
    { id: string },
    {},
    z.infer<typeof updateSupplyRecordEntryDateSchema>
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { entryDate } = req.body;

    const data = await updateInventorySupplyEntryDate({
      id,
      data: {
        entryDate,
      },
    });

    const jsonReponse = new AppJSONResponse(
      "Inventory supply record updated successfully!",
      {
        ...data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const editInventorySupplyRecordTotalAmount = async (
  req: Request<
    { id: string },
    {},
    z.infer<typeof updateSupplyRecordTotalAmountSchema>
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { totalAmount } = req.body;

    const data = await updateInventorySupplyTotalAmount({
      id,
      data: {
        totalAmount,
      },
    });

    const jsonReponse = new AppJSONResponse(
      "Inventory supply record updated successfully!",
      {
        ...data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const editInventorySupplyRecordSupplier = async (
  req: Request<
    { id: string },
    {},
    z.infer<typeof updateSupplyRecordSupplierSchema>
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { supplierProfileId } = req.body;

    const data = await updateInventorySupplySupplier({
      id,
      data: {
        supplierProfileId,
      },
    });

    const jsonReponse = new AppJSONResponse(
      "Inventory supply record updated successfully!",
      {
        ...data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const editInventorySupplyRecordPhysicalParams = async (
  req: Request<
    { id: string },
    {},
    z.infer<typeof updateSupplyRecordPhysicalParamsSchema>
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { physicalParameters } = req.body;

    const data = await updateInventorySupplyPhysicalParams({
      id,
      data: {
        physicalParameters: JSON.stringify(physicalParameters ?? []),
      },
    });

    const jsonReponse = new AppJSONResponse(
      "Inventory supply record updated successfully!",
      {
        ...data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const addSupplyRecord = async (
  req: Request<{}, {}, z.infer<typeof addSupplyRecordSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      conditionId,
      entryDate,
      inventoryItemId,
      supplierProfileId,
      totalAmount,
      physicalParameters,
    } = req.body;
    const authUser = req.user;
    if (!authUser) {
      throw new AppError("User not found", 404);
    }

    const record = await createInventorySupplyRecord({
      conditionId,
      entryDate,
      inventoryItemId,
      supplierProfileId,
      totalAmount,
      physicalParameters: JSON.stringify(physicalParameters ?? []),
      addedBy: authUser.id,
      lastModifiedBy: authUser.id,
    });

    const jsonReponse = new AppJSONResponse(
      "Inventory supply record created successfully!",
      {
        ...record,
        physicalParameters: record?.physicalParameters
          ? JSON.parse(record?.physicalParameters.toString())
          : {},
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
