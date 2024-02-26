import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import {
  AppJSONResponse,
  AppJSONResponseWithPagination,
} from "../types/reponse";
import { TPaginationQuery, TSearchQuery } from "../types/generic";
import {
  createPaymentTerm,
  deletePaymentTerm,
  retrievePaymentTerms,
  updatePaymentTerm,
} from "../services/payment-term";
import {
  addPaymentTermSchema,
  updatePaymentTermSchema,
} from "../validation/payment-term";

export const getPaymentTerms = async (
  req: Request<{}, {}, {}, TPaginationQuery & TSearchQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize, search } = req.query;

    const { metaData, data } = await retrievePaymentTerms({
      pagination: {
        lastItemIndex,
        pageSize,
      },
      search,
    });

    const jsonReponse = new AppJSONResponseWithPagination(
      "Payment term retrieved successfully!",
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
export const removePaymentTerm = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await deletePaymentTerm({
      id,
    });

    const jsonReponse = new AppJSONResponse(
      "Payment term deleted successfully!",
      {
        data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const editPaymentTerm = async (
  req: Request<{ id: string }, {}, z.infer<typeof updatePaymentTermSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const user = await updatePaymentTerm({
      id,
      data: { name, description },
    });

    const jsonReponse = new AppJSONResponse(
      "Payment term updated successfully!",
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
export const addPaymentTerm = async (
  req: Request<{}, {}, z.infer<typeof addPaymentTermSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;

    const user = await createPaymentTerm({
      name,
      description,
    });

    const jsonReponse = new AppJSONResponse(
      "Payment term created successfully!",
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
