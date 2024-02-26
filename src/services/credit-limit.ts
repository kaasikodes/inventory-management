import config from "../_config";
import { db } from "../lib/database";
import { TPaginationQuery } from "../types/generic";

export const createCreditLimit = async ({
  name,
  description,
}: {
  name: string;
  description?: string;
}) => {
  try {
    const data = await db.creditLimit.create({
      data: {
        name,
        description: description || "",
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const updateCreditLimit = async ({
  id,
  data,
}: {
  id: string;
  data: {
    name: string;
    description?: string;
  };
}) => {
  try {
    const updatedGroup = await db.creditLimit.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    return updatedGroup;
  } catch (error) {
    throw error;
  }
};

export const deleteCreditLimit = async ({ id }: { id: string }) => {
  try {
    const data = await db.creditLimit.delete({
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
export const retrieveCreditLimits = async ({
  pagination = {},
  search,
}: {
  pagination?: TPaginationQuery;
  search?: string;
}) => {
  const { lastItemIndex, pageSize: _pageSize } = pagination;
  const pageSize = _pageSize ? +_pageSize : config.DEFAULT_PAGE_SIZE;
  try {
    const total = await db.creditLimit.count({
      where: { name: { contains: search } },
    });
    const data = await db.creditLimit.findMany({
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
        description: true,
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
