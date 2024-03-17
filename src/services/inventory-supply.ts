import config from "../_config";
import { DEFAULT_PAGE_SIZE_4_REPORTS } from "../constants";
import { db } from "../lib/database";
import { AppError } from "../types/error";
import { TMonthNumericValue } from "../types/generic";
import { TRetrieveConsumptionRecordsProps } from "./inventory-consumption";

export const generateInventorySupplyData = async ({
  pagination = {},
  inventoryItemIds,
  addedByIds,
  supplyEntryDateDuration,
  conditionIds,
}: TRetrieveSupplyRecordsProps) => {
  try {
    const { lastItemIndex, pageSize = DEFAULT_PAGE_SIZE_4_REPORTS } =
      pagination;
    const { metaData: _metaData, data: _data } =
      await retrieveInventorySupplyRecords({
        pagination: {
          lastItemIndex,
          pageSize: pageSize,
        },
        inventoryItemIds,
        addedByIds,
        conditionIds,
        supplyEntryDateDuration: supplyEntryDateDuration
          ? {
              startDate: new Date(supplyEntryDateDuration.startDate),
              endDate: new Date(supplyEntryDateDuration.endDate),
            }
          : undefined,
      });
    const data = _data.map((item) => {
      const amountConsumed = item.amountConsumed.reduce(
        (prev, currentItem) => prev + currentItem.amountTaken,
        0
      );

      return {
        "Inventory Item": item.inventoryItem.name,
        "Added By": item.addedByUser.name,
        "Last Modified By": item.lastModifiedByUser.name,
        "Amount Consumed": amountConsumed,
        "Total Amount": item.totalAmount,
        "Supply Condition": item.condition?.name,
        "Entry Date": item.entryDate.toDateString(),
      };
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const getInventoryItemSupplyAggregate = async ({
  inventoryItemIds,
  year,
  monthValue,
}: {
  inventoryItemIds?: string[];
  year: number;
  monthValue: TMonthNumericValue;
}) => {
  try {
    const data = await db.inventoryItemSupplyRecord.aggregate({
      where: {
        entryDate: {
          gte: new Date(`${year}-${monthValue}-01`),
        },
        inventoryItemId: {
          in: inventoryItemIds,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });
    return data._sum.totalAmount ?? 0;
  } catch (error) {
    throw error;
  }
};

export const getInventoryItemSupplyTotalNAvailableAggregate = async ({
  inventoryItemIds,
  year,
  monthValue,
}: {
  inventoryItemIds?: string[];
  year: number;
  monthValue: TMonthNumericValue;
}) => {
  try {
    const data = await db.inventoryItemSupplyRecord.aggregate({
      where: {
        entryDate: {
          gte: new Date(`${year}-${monthValue}-01`),
          lte: new Date(`${year}-${monthValue}-31`),
        },
        inventoryItemId: {
          in: inventoryItemIds,
        },
      },
      _sum: {
        totalAmount: true,
        availableAmount: true,
      },
    });
    return {
      total: data._sum.totalAmount ?? 0,
      available: data._sum.availableAmount ?? 0,
    };
  } catch (error) {
    throw error;
  }
};

export const getInventoryItemAvailableSupplyAmount = async ({
  inventoryItemId,
}: {
  inventoryItemId: string;
}) => {
  try {
    const aggregateSupply = await db.inventoryItemSupplyRecord.aggregate({
      where: {
        inventoryItemId,
        availableAmount: {
          not: {
            equals: 0,
          },
        },
      },
      _sum: {
        availableAmount: true,
      },
    });
    return aggregateSupply._sum.availableAmount ?? 0;
  } catch (error) {
    throw error;
  }
};
export const getInventoryItemAvailableSupplies = async ({
  inventoryItemId,
}: {
  inventoryItemId: string;
}) => {
  try {
    const availableSupplies = await db.inventoryItemSupplyRecord.findMany({
      where: {
        inventoryItemId,
        availableAmount: {
          not: {
            equals: 0,
          },
        },
      },
      select: {
        availableAmount: true,
        id: true,
      },
    });
    return availableSupplies;
  } catch (error) {
    throw error;
  }
};
export const createInventorySupplyRecord = async (data: TAddSupplyRecord) => {
  try {
    const item = await db.inventoryItemSupplyRecord.create({
      data: {
        ...data,
        physicalParameters: data.physicalParameters
          ? data.physicalParameters
          : JSON.stringify({}),
        availableAmount: data.totalAmount,
      },
    });

    return item;
  } catch (error) {
    throw error;
  }
};
export const updateInventorySupplyAvailableAmount = async ({
  id,
  data,
}: {
  id: string;
  data: { availableAmount: number };
}) => {
  try {
    const updatedGroup = await db.inventoryItemSupplyRecord.update({
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
export const updateInventorySupplyTotalAmount = async ({
  id,
  data,
}: {
  id: string;
  data: Pick<TAddSupplyRecord, "totalAmount">;
}) => {
  try {
    const supply = await retrieveInventorySupplyRecord({ id });
    if (supply?.totalAmount === data.totalAmount) return supply;
    const amountOfSupplyConsumed =
      await db.inventoryItemRecordAmountConsumed.aggregate({
        where: {
          supplyRecordId: id,
        },
        _sum: {
          amountTaken: true,
        },
      });
    if ((amountOfSupplyConsumed._sum.amountTaken ?? 0) > data.totalAmount) {
      throw new AppError(
        `The supply amount cannot be decreased below ${amountOfSupplyConsumed._sum.amountTaken} because it has already been consumed!`,
        400
      );
    }
    const updatedSupply = await db.inventoryItemSupplyRecord.update({
      where: {
        id,
      },
      data: {
        ...data,
        availableAmount:
          data.totalAmount - (amountOfSupplyConsumed._sum.amountTaken ?? 0),
      },
    });
    return updatedSupply;
  } catch (error) {
    throw error;
  }
};
export const updateInventorySupplyCondition = async ({
  id,
  data,
}: {
  id: string;
  data: Pick<TAddSupplyRecord, "conditionId">;
}) => {
  try {
    const updatedGroup = await db.inventoryItemSupplyRecord.update({
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
export const updateInventorySupplyPhysicalParams = async ({
  id,
  data,
}: {
  id: string;
  data: Pick<TAddSupplyRecord, "physicalParameters">;
}) => {
  try {
    const updatedGroup = await db.inventoryItemSupplyRecord.update({
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
export const updateInventorySupplySupplier = async ({
  id,
  data,
}: {
  id: string;
  data: Pick<TAddSupplyRecord, "supplierProfileId">;
}) => {
  try {
    const updatedGroup = await db.inventoryItemSupplyRecord.update({
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
export const updateInventorySupplyEntryDate = async ({
  id,
  data,
}: {
  id: string;
  data: Pick<TAddSupplyRecord, "entryDate">;
}) => {
  try {
    const updatedGroup = await db.inventoryItemSupplyRecord.update({
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
export const deleteInventorySupplyRecord = async ({ id }: { id: string }) => {
  try {
    const data = await db.inventoryItemSupplyRecord.delete({
      where: {
        id,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const retrieveInventorySupplyRecord = async ({ id }: { id: string }) => {
  try {
    const data = await db.inventoryItemSupplyRecord.findUnique({
      where: {
        id,
      },
      include: {
        inventoryItem: {
          include: {
            measurementUnit: true,
          },
        },
        condition: true,
        amountConsumed: true,
        addedByUser: true,
        lastModifiedByUser: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const retrieveInventorySupplyRecords = async ({
  pagination = {},
  supplyEntryDateDuration,
  addedByIds,
  inventoryItemIds,
  conditionIds,
}: TRetrieveSupplyRecordsProps) => {
  const { lastItemIndex, pageSize: _pageSize } = pagination;
  const pageSize = _pageSize ? +_pageSize : config.DEFAULT_PAGE_SIZE;
  try {
    const total = await db.inventoryItemSupplyRecord.count({
      where: {
        addedBy: {
          in: addedByIds,
        },
        inventoryItemId: {
          in: inventoryItemIds,
        },
        conditionId: {
          in: conditionIds,
        },
        entryDate: {
          gte: supplyEntryDateDuration?.startDate,
          lte: supplyEntryDateDuration?.endDate,
        },
      },
    });
    const data = await db.inventoryItemSupplyRecord.findMany({
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
        conditionId: {
          in: conditionIds,
        },
        entryDate: {
          gte: supplyEntryDateDuration?.startDate,
          lte: supplyEntryDateDuration?.endDate,
        },
      },
      include: {
        inventoryItem: {
          include: {
            measurementUnit: true,
          },
        },
        condition: true,
        amountConsumed: true,
        addedByUser: true,
        lastModifiedByUser: true,
      },
    });

    const lastItemInResults = data[pageSize - 1]; // Remember: zero-based index! :)
    const cursor = lastItemInResults?.id;
    return {
      data,
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

type TAddSupplyRecord = {
  addedBy: string;
  lastModifiedBy: string;
  physicalParameters?: string;
  totalAmount: number;
  conditionId: string;
  inventoryItemId: string;
  entryDate?: string;
  supplierProfileId?: string;
};

type TRetrieveSupplyRecordsProps = TRetrieveConsumptionRecordsProps;
