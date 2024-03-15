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
import {
  generateInventorySupplyData,
  getInventoryItemSupplyAggregate,
  getInventoryItemSupplyTotalNAvailableAggregate,
} from "../services/inventory-supply";
import { DEFAULT_PAGE_SIZE_4_REPORTS, MONTHS_IN_YEAR } from "../constants";
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
      supplyEntryDateDuration,
      type,
      inventoryItemIds,
      addedByIds,
      conditionIds,
    } = req.body;
    let data;
    let message: string = "";
    const authUser = req.user;
    if (!authUser) {
      throw new Error("Authenticated User not found");
    }
    switch (type) {
      case "INVENTORY_CONSUMPTION":
        data = await generateInventoryConsumptionVariationData({
          pagination: {
            lastItemIndex,
            pageSize,
          },
          addedByIds,
          consumptionDateDuration: consumptionDateDuration
            ? {
                endDate: new Date(consumptionDateDuration.to),
                startDate: new Date(consumptionDateDuration.from),
              }
            : undefined,
          produceDateDuration: produceDateDuration
            ? {
                endDate: new Date(produceDateDuration.to),
                startDate: new Date(produceDateDuration.from),
              }
            : undefined,
          inventoryItemIds,
          conditionIds,
        });

        console.log(data, "whwyyyy");
        message = "Inventory consumption report created successfully!";

        break;
      case "INVENTORY_SUPPLY":
        // generateInventorySupplyData
        data = await generateInventorySupplyData({
          pagination: {
            lastItemIndex,
            pageSize,
          },
          addedByIds,
          supplyEntryDateDuration: supplyEntryDateDuration
            ? {
                endDate: new Date(supplyEntryDateDuration.to),
                startDate: new Date(supplyEntryDateDuration.from),
              }
            : undefined,

          inventoryItemIds,
          conditionIds,
        });

        console.log(data, "whwyyyy");
        message = "Inventory supply report created successfully!";

      default:
        break;
    }

    const report = await createReport({
      name,
      description,
      data: JSON.stringify(data),
      generatedBy: authUser.id,
      type,
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
    const fetchPromises: Promise<
      [string, { total: number; available: number }]
    >[] = Object.entries(MONTHS_IN_YEAR).map(
      async ([key, value]): Promise<
        [string, { total: number; available: number }]
      > => {
        const total = await getInventoryItemSupplyTotalNAvailableAggregate({
          monthValue: value,
          year: year ?? new Date().getFullYear(),
          inventoryItemIds: inventoryItemIds?.split(","),
        });
        return [key, total];
      }
    );

    // Wait for all promises to resolve
    const results = await Promise.all(fetchPromises);

    // Convert results to an object
    const organizedData: Record<string, { total: number; available: number }> =
      Object.fromEntries(results);
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
    const newDate = new Date();
    // organize data into months

    // Define an array to store promises for fetching data for each month
    const fetchPromises: Promise<[string, number]>[] = Object.entries(
      MONTHS_IN_YEAR
    ).map(async ([key, value]): Promise<[string, number]> => {
      const total = await getInventoryItemProductionAggregate({
        monthValue: value,
        year: year ?? newDate.getFullYear(),
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
      conditionIds?: string;
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
      conditionIds,
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

          produceDateDuration: year
            ? {
                endDate: new Date(`${year}-${value}-31`),
                startDate: new Date(`${year}-${value}-01`),
              }
            : undefined,
          inventoryItemIds: inventoryItemIds?.split(","),
          conditionIds: conditionIds?.split(","),
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

export const getSupplyPerInventoryItemGraph = async (
  req: Request<
    {},
    {},
    {},
    TPaginationQuery & {
      from?: string;
      to?: string;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize, from, to } = req.query;
    const inventoryItems = await retrieveInventoryItems({
      pagination: {
        pageSize: DEFAULT_PAGE_SIZE_4_REPORTS, //done to get all items, the assumption is that there will be no more than 100 items
      },
    });
    const newDate = new Date();
    // Define an array to store promises for fetching data for each month
    const fetchPromises: Promise<[string, { amount: number }]>[] =
      inventoryItems.data.map(
        async (item): Promise<[string, { amount: number }]> => {
          const data = await generateInventorySupplyData({
            pagination: {
              lastItemIndex,
              pageSize,
            },

            supplyEntryDateDuration: {
              endDate: to
                ? new Date(to)
                : new Date(`${newDate.getFullYear()}-12-31`),
              startDate: from
                ? new Date(from)
                : new Date(`${newDate.getFullYear()}-01-01`),
            },
            inventoryItemIds: [item.id],
          });
          const supplyTotalAmounts = data.map((item) =>
            item["Total Amount"] ? item["Total Amount"] : 0
          );

          const actualMaturityPeriodOfItem = lodash.sum(supplyTotalAmounts);

          return [
            item.name,
            {
              amount: actualMaturityPeriodOfItem ?? 0,
            },
          ];
        }
      );
    // Wait for all promises to resolve
    const results = await Promise.all(fetchPromises);

    // Convert results to an object
    const organizedData: Record<string, { amount: number }> =
      Object.fromEntries(results);
    const jsonReponse = new AppJSONResponse(
      "Supply per Inventory Item Graph retrieved Successfully",
      organizedData
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const getProducePerInventoryItemGraph = async (
  req: Request<
    {},
    {},
    {},
    TPaginationQuery & {
      from?: string;
      to?: string;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize, from, to } = req.query;
    const inventoryItems = await retrieveInventoryItems({
      pagination: {
        pageSize: DEFAULT_PAGE_SIZE_4_REPORTS, //done to get all items, the assumption is that there will be no more than 100 items
      },
    });
    const newDate = new Date();
    // Define an array to store promises for fetching data for each month
    const fetchPromises: Promise<[string, { amount: number }]>[] =
      inventoryItems.data.map(
        async (item): Promise<[string, { amount: number }]> => {
          const data = await generateInventoryConsumptionVariationData({
            pagination: {
              lastItemIndex,
              pageSize,
            },

            produceDateDuration: {
              endDate: to
                ? new Date(to)
                : new Date(`${newDate.getFullYear()}-12-31`),
              startDate: from
                ? new Date(from)
                : new Date(`${newDate.getFullYear()}-01-01`),
            },
            inventoryItemIds: [item.id],
          });
          const producedAmount = data.map((item) =>
            item["Actual Amount Produced"] ? item["Actual Amount Produced"] : 0
          );
          const actualMaturityPeriodOfItem = lodash.sum(producedAmount);

          return [
            item.name,
            {
              amount: actualMaturityPeriodOfItem ?? 0,
            },
          ];
        }
      );
    // Wait for all promises to resolve
    const results = await Promise.all(fetchPromises);

    // Convert results to an object
    const organizedData: Record<string, { amount: number }> =
      Object.fromEntries(results);
    const jsonReponse = new AppJSONResponse(
      "Produce per Inventory Item Graph retrieved Successfully",
      organizedData
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const getConsumptionPerInventoryItemGraph = async (
  req: Request<
    {},
    {},
    {},
    TPaginationQuery & {
      from?: string;
      to?: string;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize, from, to } = req.query;
    const inventoryItems = await retrieveInventoryItems({
      pagination: {
        pageSize: DEFAULT_PAGE_SIZE_4_REPORTS, //done to get all items, the assumption is that there will be no more than 100 items
      },
    });
    const newDate = new Date();
    // Define an array to store promises for fetching data for each month
    const fetchPromises: Promise<[string, { amount: number }]>[] =
      inventoryItems.data.map(
        async (item): Promise<[string, { amount: number }]> => {
          const data = await generateInventoryConsumptionVariationData({
            pagination: {
              lastItemIndex,
              pageSize,
            },

            produceDateDuration: {
              endDate: to
                ? new Date(to)
                : new Date(`${newDate.getFullYear()}-12-31`),
              startDate: from
                ? new Date(from)
                : new Date(`${newDate.getFullYear()}-01-01`),
            },
            inventoryItemIds: [item.id],
          });
          const consumedAmount = data.map((item) =>
            item["Amount Consumed"] ? item["Amount Consumed"] : 0
          );
          const total = lodash.sum(consumedAmount);

          return [
            item.name,
            {
              amount: total ?? 0,
            },
          ];
        }
      );
    // Wait for all promises to resolve
    const results = await Promise.all(fetchPromises);

    // Convert results to an object
    const organizedData: Record<string, { amount: number }> =
      Object.fromEntries(results);
    const jsonReponse = new AppJSONResponse(
      "Consumption per Inventory Item Graph retrieved Successfully",
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
        pageSize: DEFAULT_PAGE_SIZE_4_REPORTS, //done to get all items, the assumption is that there will be no more than 100 items
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

          produceDateDuration: year
            ? {
                endDate: new Date(`${year}-12-31`),
                startDate: new Date(`${year}-01-01`),
              }
            : undefined,
          inventoryItemIds: [item.id],
        });
        const produceDateInHrs = data
          .map((item) =>
            item["Actual Produce Date"]
              ? item["Actual Produce Date"].getTime()
              : 0
          )
          .map((item) => item / 1000 / 60 / 60);
        const expectedDateInHrs = data
          .map((item) =>
            item["Expected Produce Date"]
              ? item["Expected Produce Date"].getTime()
              : 0
          )
          .map((item) => item / 1000 / 60 / 60);
        const actualMaturityPeriodOfItem = lodash.mean(produceDateInHrs);
        const expectedMaturityPeriodOfItem = lodash.mean(expectedDateInHrs);
        console.log(
          data
            .map((item) => item["Actual Produce Date"])
            .filter((item) => item),
          "CONSUME"
        );
        console.log(produceDateInHrs, "produceDateInHrs");
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
