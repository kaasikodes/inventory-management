import config from "../_config";
import { db } from "../lib/database";
import { TPaginationQuery } from "../types/generic";

export const createInventoryItem = async (data: TAddInventoryItem) => {
  try {
    const item = await db.inventoryItem.create({
      data: {
        ...data,
      },
    });

    return item;
  } catch (error) {
    throw error;
  }
};
export const updateInventoryItem = async ({
  id,
  data,
}: {
  id: string;
  data: Pick<
    TAddInventoryItem,
    | "description"
    | "growthPeriodInSecs"
    | "inputOutputRatioId"
    | "name"
    | "minStockThreshold"
    | "measurementUnitId"
  >;
}) => {
  try {
    const updatedGroup = await db.inventoryItem.update({
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
export const deleteInventoryItem = async ({ id }: { id: string }) => {
  try {
    const data = await db.inventoryItem.delete({
      where: {
        id,
      },

      select: {
        id: true,
        name: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const retrieveInventoryItem = async ({ id }: { id: string }) => {
  try {
    const data = await db.inventoryItem.findUnique({
      where: {
        id,
      },
      include: {
        measurementUnit: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const retrieveInventoryItems = async ({
  pagination = {},
  search,
}: {
  pagination?: TPaginationQuery;
  search?: string;
}) => {
  const { lastItemIndex, pageSize: _pageSize } = pagination;
  const pageSize = _pageSize ? +_pageSize : config.DEFAULT_PAGE_SIZE;
  try {
    const total = await db.inventoryItem.count({
      where: { name: { contains: search } },
    });
    const data = await db.inventoryItem.findMany({
      take: pageSize,
      ...(lastItemIndex
        ? {
            skip: 1, // Skip the cursor
            cursor: {
              id: lastItemIndex,
            },
          }
        : {}),
      where: { name: { contains: search } },
      include: {
        inputOutputRatio: true,
        measurementUnit: true,
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
export const addMultipleInventoryItems = async ({
  data,
}: {
  data: TAddInventoryItem[];
}) => {
  try {
    const users = await db.inventoryItem.createMany({
      data: data,
    });
    return { items: users, noOfItemsAdded: data.length };
  } catch (error) {
    throw error;
  }
};

type TAddInventoryItem = {
  growthPeriodInSecs: number;
  inputOutputRatioId: string;
  measurementUnitId: string;
  minStockThreshold: number;
  name: string;
  description?: string;
};
