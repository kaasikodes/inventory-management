import config from "../_config";
import { DEFAULT_PAGE_SIZE_4_REPORTS } from "../constants";
import { db } from "../lib/database";
import { TMonthNumericValue, TPaginationQuery } from "../types/generic";

export const generateInventoryConsumptionVariationData = async ({
  pagination = {},
  inventoryItemIds,
  addedByIds,
  consumptionDateDuration,
  conditionIds,
  produceDateDuration,
}: TRetrieveConsumptionRecordsProps) => {
  try {
    const { lastItemIndex, pageSize = DEFAULT_PAGE_SIZE_4_REPORTS } =
      pagination;
    const { metaData: _metaData, data: _data } =
      await retrieveInventoryConsumptionRecords({
        pagination: {
          lastItemIndex,
          pageSize: pageSize,
        },
        inventoryItemIds,
        addedByIds,
        conditionIds,
        consumptionDateDuration: consumptionDateDuration
          ? {
              startDate: new Date(consumptionDateDuration.startDate),
              endDate: new Date(consumptionDateDuration.endDate),
            }
          : undefined,
        produceDateDuration: produceDateDuration
          ? {
              startDate: new Date(produceDateDuration.startDate),
              endDate: new Date(produceDateDuration.endDate),
            }
          : undefined,
      });
    const data = _data.map((item) => {
      const amountConsumed = item.amountConsumed.reduce(
        (prev, currentItem) => prev + currentItem.amountTaken,
        0
      );
      const dateofConsumption = item.dateConsumed;
      const expectedProduceDate = dateofConsumption
        ? new Date(
            dateofConsumption.getTime() +
              item.inventoryItem.growthPeriodInSecs * 1000
          )
        : null;
      const expectedAmountToBeProduced =
        (amountConsumed * item.inventoryItem.inputOutputRatio.output) /
        item.inventoryItem.inputOutputRatio.input;
      return {
        "Inventory Item": item.inventoryItem.name,
        "Consupmtion Date": dateofConsumption,
        "Added By": item.addedByUser.name,
        "Last Modified By": item.lastModifiedByUser.name,
        "Last Modified At": item.updatedAt,
        "Amount Consumed": amountConsumed,
        "Produce Condition": item.produceCondition?.name,
        "Actual Produce Date": item.dateProduceWasRealized,
        "Actual Amount Produced": item.amountProduced,
        "Expected Produce Date": expectedProduceDate,
        "Expected Amount To Be Produced": expectedAmountToBeProduced,
      };
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getInventoryItemProductionAggregate = async ({
  inventoryItemIds,
  year,
  monthValue,
}: {
  inventoryItemIds?: string[];
  year: number;
  monthValue: TMonthNumericValue;
}) => {
  try {
    const data = await db.inventoryItemConsumptionRecord.aggregate({
      where: {
        dateConsumed: {
          gte: new Date(`${year}-${monthValue}-01`),
          lte: new Date(`${year}-${monthValue}-31`),
        },
        inventoryItemId: {
          in: inventoryItemIds,
        },
      },
      _sum: {
        amountProduced: true,
      },
    });
    return data._sum.amountProduced ?? 0;
  } catch (error) {
    throw error;
  }
};
export const getInventoryItemConsumptionAggregate = async ({
  inventoryItemIds,
  year,
  monthValue,
}: {
  inventoryItemIds?: string[];
  year: number;
  monthValue: TMonthNumericValue;
}) => {
  try {
    const data = await db.inventoryItemRecordAmountConsumed.aggregate({
      where: {
        consumptionRecord: {
          dateConsumed: {
            gte: new Date(`${year}-${monthValue}-01`),
            lte: new Date(`${year}-${monthValue}-31`),
          },
          inventoryItemId: {
            in: inventoryItemIds,
          },
        },
      },
      _sum: {
        amountTaken: true,
      },
    });
    return data._sum.amountTaken ?? 0;
  } catch (error) {
    throw error;
  }
};
export const createInventoryConsumptionRecord = async (
  data: Pick<
    TAddConsumptionRecord,
    | "amountConsumed"
    | "addedBy"
    | "lastModifiedBy"
    | "inventoryItemId"
    | "dateConsumed"
  >
) => {
  try {
    const item = await db.inventoryItemConsumptionRecord.create({
      data: {
        ...data,
        amountConsumed: {
          createMany: {
            data: data.amountConsumed,
          },
        },
      },
    });

    return item;
  } catch (error) {
    throw error;
  }
};
export const updateInventoryConsumptionProduceInfo = async ({
  id,
  data,
}: {
  id: string;
  data: Pick<
    TAddConsumptionRecord,
    | "amountProduced"
    | "dateProduceWasRealized"
    | "produceConditionId"
    | "lastModifiedBy"
  >;
}) => {
  try {
    const updatedGroup = await db.inventoryItemConsumptionRecord.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
    return updatedGroup;
  } catch (error) {
    throw error;
  }
};

export const deleteInventoryConsumptionRecord = async ({
  id,
}: {
  id: string;
}) => {
  try {
    const data = await db.inventoryItemConsumptionRecord.delete({
      where: {
        id,
      },
      include: {
        amountConsumed: {
          include: {
            supplyRecord: true,
          },
        },
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const retrieveInventoryConsumptionRecord = async ({
  id,
}: {
  id: string;
}) => {
  try {
    const data = await db.inventoryItemConsumptionRecord.findUnique({
      where: {
        id,
      },
      select: {
        produceCondition: true,
        inventoryItem: {
          select: {
            name: true,
            growthPeriodInSecs: true,
            inputOutputRatio: true,
          },
        },
        id: true,
        dateProduceWasRealized: true,
        amountProduced: true,
        createdAt: true,
        updatedAt: true,
        amountConsumed: true,
        addedByUser: true,
        lastModifiedByUser: true,
        dateConsumed: true,
      },
    });
    if (data) {
      return {
        ...data,
        amountConsumedValue: data.amountConsumed.reduce(
          (prev, present) => prev + present.amountTaken,
          0
        ),
      };
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const retrieveInventoryConsumptionRecords = async ({
  pagination = {},
  consumptionDateDuration,
  produceDateDuration,
  addedByIds,
  inventoryItemIds,
  conditionIds,
}: TRetrieveConsumptionRecordsProps) => {
  const { lastItemIndex, pageSize: _pageSize } = pagination;
  const pageSize = _pageSize ? +_pageSize : config.DEFAULT_PAGE_SIZE;
  try {
    const total = await db.inventoryItemConsumptionRecord.count({
      where: {
        addedBy: {
          in: addedByIds,
        },
        inventoryItemId: {
          in: inventoryItemIds,
        },
        produceConditionId: {
          in: conditionIds,
        },
        dateProduceWasRealized: produceDateDuration
          ? {
              gte: produceDateDuration?.startDate,
              lte: produceDateDuration?.endDate,
            }
          : undefined,
        createdAt: consumptionDateDuration
          ? {
              gte: consumptionDateDuration?.startDate,
              lte: consumptionDateDuration?.endDate,
            }
          : undefined,
      },
    });
    const data = await db.inventoryItemConsumptionRecord.findMany({
      take: pageSize,
      ...(lastItemIndex
        ? {
            skip: 1, // Skip the cursor
            cursor: {
              id: lastItemIndex,
            },
          }
        : {}),
      where: {
        addedBy: {
          in: addedByIds,
        },
        inventoryItemId: {
          in: inventoryItemIds,
        },
        produceConditionId: {
          in: conditionIds,
        },
        dateProduceWasRealized: produceDateDuration
          ? {
              gte: produceDateDuration?.startDate,
              lte: produceDateDuration?.endDate,
            }
          : undefined,
        createdAt: consumptionDateDuration
          ? {
              gte: consumptionDateDuration?.startDate,
              lte: consumptionDateDuration?.endDate,
            }
          : undefined,
      },
      select: {
        produceCondition: true,
        inventoryItem: {
          select: {
            name: true,
            growthPeriodInSecs: true,
            inputOutputRatio: true,
          },
        },
        id: true,
        dateProduceWasRealized: true,
        amountProduced: true,
        createdAt: true,
        updatedAt: true,
        amountConsumed: true,
        addedByUser: true,
        lastModifiedByUser: true,
        dateConsumed: true,
      },
    });

    const lastItemInResults = data[pageSize - 1]; // Remember: zero-based index! :)
    const cursor = lastItemInResults?.id;
    return {
      data: data.map((item) => ({
        ...item,
        amountConsumedValue: item.amountConsumed.reduce(
          (prev, present) => prev + present.amountTaken,
          0
        ),
      })),
      metaData: {
        hasNextPage: data.length > 0,
        lastIndex: cursor,
        total,
      },
    };
  } catch (error) {
    throw error;
  }
};

type TAddConsumptionRecord = {
  addedBy: string;
  dateConsumed?: string;
  lastModifiedBy: string;
  amountProduced: number;
  produceConditionId: string;
  inventoryItemId: string;
  dateProduceWasRealized: string;
  amountConsumed: {
    amountTaken: number;
    supplyRecordId: string;
  }[];
};

export type TRetrieveConsumptionRecordsProps = {
  pagination?: TPaginationQuery;
  produceDateDuration?: {
    startDate: Date;
    endDate: Date;
  };
  consumptionDateDuration?: {
    startDate: Date;
    endDate: Date;
  };
  supplyEntryDateDuration?: {
    startDate: Date;
    endDate: Date;
  };
  inventoryItemIds?: string[];
  addedByIds?: string[];
  conditionIds?: string[];
};
