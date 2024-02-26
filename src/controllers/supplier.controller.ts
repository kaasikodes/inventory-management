import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import {
  AppJSONResponse,
  AppJSONResponseWithPagination,
} from "../types/reponse";
import { TPaginationQuery, TSearchQuery } from "../types/generic";
import {
  createSupplierProfile,
  deleteSupplierProfile,
  retrieveSupplierProfile,
  retrieveSupplierProfiles,
  updateSupplierProfile,
} from "../services/supplier";
import {
  createSupplierProfileSchema,
  updateSupplierProfileSchema,
} from "../validation/supplier";
import { createCreditLimit } from "../services/credit-limit";
import { createPaymentTerm } from "../services/payment-term";
import { updateUser } from "../services/user.service";
import { executeAddUserSteps } from "../lib/utils/user";

export const getSupplierProfiles = async (
  req: Request<{}, {}, {}, TPaginationQuery & TSearchQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize, search } = req.query;

    const { metaData, data } = await retrieveSupplierProfiles({
      pagination: {
        lastItemIndex,
        pageSize,
      },
      search,
    });

    const jsonReponse = new AppJSONResponseWithPagination(
      "Supplier profiles retrieved successfully!",
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
export const removeSupplierProfile = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await deleteSupplierProfile({
      id,
    });

    const jsonReponse = new AppJSONResponse(
      "Supplier profile deleted successfully!",
      {
        data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const editSupplierProfile = async (
  req: Request<{ id: string }, {}, z.infer<typeof updateSupplierProfileSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { creditLimitId, paymentTermId, userInfo } = req.body;
    const supplier = await retrieveSupplierProfile({
      id,
    });
    supplier?.user &&
      userInfo &&
      (await updateUser({ data: userInfo, id: supplier?.user.id }));

    const updatedSupplier = await updateSupplierProfile({
      id,
      data: { creditLimitId, paymentTermId },
    });

    const jsonReponse = new AppJSONResponse(
      "Supplier profile updated successfully!",
      updatedSupplier
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const addSupplierProfile = async (
  req: Request<{}, {}, z.infer<typeof createSupplierProfileSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { creditLimitId, paymentTermId, userInfo } = req.body;

    const user = await executeAddUserSteps(userInfo);
    const supplier = await createSupplierProfile({
      creditLimitId,
      paymentTermId,
      userId: user.id,
    });
    const jsonReponse = new AppJSONResponse(
      "Supplier profile created successfully!",
      supplier
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
