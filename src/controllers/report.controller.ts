import { NextFunction, Request, Response } from "express";
import { TPaginationQuery, TSearchQuery } from "../types/generic";
import {
  AppJSONResponse,
  AppJSONResponseWithPagination,
} from "../types/reponse";
import { z } from "zod";
import { editReportSchema, generateReportSchema } from "../validation/report";
import {
  generateInventoryConsumptionVariationData,
  getInventoryItemConsumptionAggregate,
  getInventoryItemProductionAggregate,
} from "../services/inventory-consumption";
import {
  createReport,
  deleteReport,
  retrieveReport,
  retrieveReports,
  updateReport,
} from "../services/report";
import { exportCsvFile } from "../lib/file";
import { getInventoryItemSupplyAggregate } from "../services/inventory-supply";
import { MONTHS_IN_YEAR } from "../constants";
import { retrieveInventoryItems } from "../services/inventory-item";
import lodash from "lodash";

// generate report
export const generateReport = async (
  req: Request<{}, {}, z.infer<typeof generateReportSchema>, TPaginationQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize } = req.query;
    const {
      name,
      description,
      consumptionDateDuration,
      produceDateDuration,
      type,
      inventoryItemIds,
      addedByIds,
      produceConditionIds,
    } = req.body;
    let data;
    let message: string = "";
    const authUser = req.user;
    if (!authUser) {
      throw new Error("Authenticated User not found");
    }
    switch (type) {
      case "INVENTORY_CONSUMPTION":
        data = generateInventoryConsumptionVariationData({
          pagination: {
            lastItemIndex,
            pageSize,
          },
          addedByIds,
          consumptionDateDuration: {
            endDate: new Date(consumptionDateDuration.to),
            startDate: new Date(consumptionDateDuration.from),
          },
          produceDateDuration: {
            endDate: new Date(produceDateDuration.to),
            startDate: new Date(produceDateDuration.from),
          },
          inventoryItemIds,
          produceConditionIds,
        });
        message = "Inventory consumption report created successfully!";

        break;

      default:
        break;
    }

    const report = await createReport({
      name,
      description,
      data: JSON.stringify(data),
      generatedBy: authUser.id,
    });

    const jsonReponse = new AppJSONResponse(message, {
      name: report.name,
      description: report.description,
      id: report.id,
    });
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};

// get all reports
export const getReports = async (
  req: Request<{}, {}, {}, TPaginationQuery & TSearchQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize, search } = req.query;

    const { metaData, data } = await retrieveReports({
      pagination: {
        lastItemIndex,
        pageSize,
      },
      search,
    });

    const jsonReponse = new AppJSONResponseWithPagination(
      "Reports retrieved successfully!",
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
// get report by id
export const getReport = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await retrieveReport({
      id,
    });

    const jsonReponse = new AppJSONResponse("Report retrieved successfully!", {
      data,
    });
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
// delete report by id
export const removeReport = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await deleteReport({
      id,
    });

    const jsonReponse = new AppJSONResponse("Report deleted successfully!", {
      data,
    });
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
// edit report (name, description)
export const editReport = async (
  req: Request<{ id: string }, {}, z.infer<typeof editReportSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const user = await updateReport({
      id,
      data: { name, description },
    });

    const jsonReponse = new AppJSONResponse("Report updated successfully!", {
      name,
      description,
      id: user.id,
    });
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
// download report
export const exportReport = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const report = await retrieveReport({ id });
    const csvData = JSON.parse((report?.data as string) ?? "{}");
    return exportCsvFile({ csvData, fileName: `${report?.name} report` })(
      req,
      res
    );
  } catch (error) {
    throw error;
  }
};

export const getSupplyGraph = async (
  req: Request<{}, {}, {}, { year?: number; inventoryItemIds?: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { year, inventoryItemIds } = req.query;

    // organize data into months

    // Define an array to store promises for fetching data for each month
    const fetchPromises: Promise<[string, number]>[] = Object.entries(
      MONTHS_IN_YEAR
    ).map(async ([key, value]): Promise<[string, number]> => {
      const total = await getInventoryItemSupplyAggregate({
        monthValue: value,
        year: year ?? new Date().getFullYear(),
        inventoryItemIds: inventoryItemIds?.split(","),
      });
      return [key, total];
    });

    // Wait for all promises to resolve
    const results = await Promise.all(fetchPromises);

    // Convert results to an object
    const organizedData: Record<string, number> = Object.fromEntries(results);
    const jsonReponse = new AppJSONResponse(
      "Supply graph created successfully!",
      organizedData
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};

export const getConsumptionGraph = async (
  req: Request<{}, {}, {}, { year?: number; inventoryItemIds?: string }>,
  //   req: Request<{}, {}, {}, TPaginationQuery & TSearchQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { year, inventoryItemIds } = req.query;

    // organize data into months

    // Define an array to store promises for fetching data for each month
    const fetchPromises: Promise<[string, number]>[] = Object.entries(
      MONTHS_IN_YEAR
    ).map(async ([key, value]): Promise<[string, number]> => {
      const total = await getInventoryItemConsumptionAggregate({
        monthValue: value,
        year: year ?? new Date().getFullYear(),
        inventoryItemIds: inventoryItemIds?.split(","),
      });
      return [key, total];
    });

    // Wait for all promises to resolve
    const results = await Promise.all(fetchPromises);

    // Convert results to an object
    const organizedData: Record<string, number> = Object.fromEntries(results);
    const jsonReponse = new AppJSONResponse(
      "Consumption graph created successfully!",
      organizedData
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};

export const getProductionGraph = async (
  req: Request<{}, {}, {}, { year?: number; inventoryItemIds?: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { year, inventoryItemIds } = req.query;

    // organize data into months

    // Define an array to store promises for fetching data for each month
    const fetchPromises: Promise<[string, number]>[] = Object.entries(
      MONTHS_IN_YEAR
    ).map(async ([key, value]): Promise<[string, number]> => {
      const total = await getInventoryItemProductionAggregate({
        monthValue: value,
        year: year ?? new Date().getFullYear(),
        inventoryItemIds: inventoryItemIds?.split(","),
      });
      return [key, total];
    });

    // Wait for all promises to resolve
    const results = await Promise.all(fetchPromises);

    // Convert results to an object
    const organizedData: Record<string, number> = Object.fromEntries(results);
    const jsonReponse = new AppJSONResponse(
      "Production graph created successfully!",
      organizedData
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const getProductionAmountVariationGraph = async (
  req: Request<
    {},
    {},
    {},
    TPaginationQuery & {
      year?: number;
      inventoryItemIds?: string;
      addedByIds?: string;
      produceConditionIds?: string;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      lastItemIndex,
      pageSize,
      year,
      inventoryItemIds,
      addedByIds,
      produceConditionIds,
    } = req.query;

    // Define an array to store promises for fetching data for each month
    const fetchPromises: Promise<
      [string, { expected: number; actual: number }]
    >[] = Object.entries(MONTHS_IN_YEAR).map(
      async ([key, value]): Promise<
        [string, { expected: number; actual: number }]
      > => {
        const data = await generateInventoryConsumptionVariationData({
          pagination: {
            lastItemIndex,
            pageSize,
          },
          addedByIds: addedByIds?.split(","),

          produceDateDuration: {
            endDate: new Date(`${year}-${value + 1}-01`),
            startDate: new Date(`${year}-${value}-01`),
          },
          inventoryItemIds: inventoryItemIds?.split(","),
          produceConditionIds: produceConditionIds?.split(","),
        });
        const actualAmountProducedInThatMonth = data.reduce(
          (prev, current) => prev + (current["Actual Amount Produced"] ?? 0),
          0
        );
        const expectedAmountProducedInThatMonth = data.reduce(
          (prev, current) =>
            prev + (current["Expected Amount To Be Produced"] ?? 0),
          0
        );
        return [
          key,
          {
            actual: actualAmountProducedInThatMonth,
            expected: expectedAmountProducedInThatMonth,
          },
        ];
      }
    );
    // Wait for all promises to resolve
    const results = await Promise.all(fetchPromises);

    // Convert results to an object
    const organizedData: Record<string, { expected: number; actual: number }> =
      Object.fromEntries(results);
    const jsonReponse = new AppJSONResponse(
      "Production Amount Variation Graph retrieved Successfully",
      organizedData
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};

export const getProductionMaturityVariationGraph = async (
  req: Request<
    {},
    {},
    {},
    TPaginationQuery & {
      year?: number;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize, year } = req.query;
    const inventoryItems = await retrieveInventoryItems({
      pagination: {
        pageSize: 100, //done to get all items, the assumption is that there will be no more than 100 items
      },
    });
    // Define an array to store promises for fetching data for each month
    const fetchPromises: Promise<
      [string, { expected: number; actual: number }]
    >[] = inventoryItems.data.map(
      async (item): Promise<[string, { expected: number; actual: number }]> => {
        const data = await generateInventoryConsumptionVariationData({
          pagination: {
            lastItemIndex,
            pageSize,
          },

          produceDateDuration: {
            endDate: new Date(`${year ?? new Date().getFullYear()}-12-31`),
            startDate: new Date(`${year ?? new Date().getFullYear()}-01-01`),
          },
          inventoryItemIds: [item.id],
        });
        const actualMaturityPeriodOfItem = lodash.mean(
          data.map((item) =>
            item["Actual Produce Date"]
              ? new Date(item["Actual Produce Date"]).getSeconds()
              : 0
          )
        );
        const expectedMaturityPeriodOfItem = lodash.mean(
          data.map((item) =>
            item["Expected Produce Date"]
              ? new Date(item["Expected Produce Date"]).getSeconds()
              : 0
          )
        );
        return [
          item.name,
          {
            actual: actualMaturityPeriodOfItem,
            expected: expectedMaturityPeriodOfItem,
          },
        ];
      }
    );
    // Wait for all promises to resolve
    const results = await Promise.all(fetchPromises);

    // Convert results to an object
    const organizedData: Record<string, { expected: number; actual: number }> =
      Object.fromEntries(results);
    const jsonReponse = new AppJSONResponse(
      "Production Maturity Variation Graph retrieved Successfully",
      organizedData
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
