import config from "../_config";
import { db } from "../lib/database";
import { TMonthNumericValue, TPaginationQuery } from "../types/generic";

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
        availableAmount: data.totalAmount,
      },
    });

    return item;
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
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const retrieveInventorySupplyRecords = async ({
  pagination = {},
}: {
  pagination?: TPaginationQuery;
}) => {
  const { lastItemIndex, pageSize: _pageSize } = pagination;
  const pageSize = _pageSize ? +_pageSize : config.DEFAULT_PAGE_SIZE;
  try {
    const total = await db.inventoryItemSupplyRecord.count({});
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
      where: {},
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
  physicalParameters: string;
  totalAmount: number;
  conditionId: string;
  inventoryItemId: string;
  entryDate?: string;
  supplierProfileId?: string;
};
