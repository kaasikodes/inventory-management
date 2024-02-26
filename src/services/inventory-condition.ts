import config from "../_config";
import { db } from "../lib/database";
import { TPaginationQuery } from "../types/generic";

export const createInventoryItemCondition = async ({
  name,
  rating,
}: {
  name: string;
  rating?: number;
}) => {
  try {
    const data = await db.inventoryItemCondition.create({
      data: {
        name,
        rating,
      },
      select: {
        id: true,
        name: true,
        rating: true,
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};
export const updateInventoryItemCondition = async ({
  id,
  data,
}: {
  id: string;
  data: {
    name: string;
    rating?: number;
  };
}) => {
  try {
    const updatedGroup = await db.inventoryItemCondition.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        rating: data.rating,
      },
      select: {
        id: true,
        name: true,
        rating: true,
      },
    });
    return updatedGroup;
  } catch (error) {
    throw error;
  }
};

export const deleteInventoryItemCondition = async ({ id }: { id: string }) => {
  try {
    const data = await db.inventoryItemCondition.delete({
      where: {
        id,
      },

      select: {
        id: true,
        name: true,
        rating: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const retrieveInventoryItemCondition = async ({
  id,
}: {
  id: string;
}) => {
  try {
    const data = await db.inventoryItemCondition.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        name: true,
        rating: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const retrieveInventoryItemConditions = async ({
  pagination = {},
  search,
}: {
  pagination?: TPaginationQuery;
  search?: string;
}) => {
  const { lastItemIndex, pageSize: _pageSize } = pagination;
  const pageSize = _pageSize ? +_pageSize : config.DEFAULT_PAGE_SIZE;
  try {
    const total = await db.inventoryItemCondition.count({
      where: { name: { contains: search } },
    });
    const data = await db.inventoryItemCondition.findMany({
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
      select: {
        id: true,
        name: true,
        rating: true,
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
