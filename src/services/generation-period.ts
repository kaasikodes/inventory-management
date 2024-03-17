import config from "../_config";
import { db } from "../lib/database";
import { TPaginationQuery } from "../types/generic";

type TAddPeriod = {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
};
export const createGenerationPeriod = async ({
  name,
  description,
  endDate,
  startDate,
}: TAddPeriod) => {
  try {
    const data = await db.generationPeriod.create({
      data: {
        name,
        description: description || "",
        endDate,
        startDate,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const updateGenerationPeriod = async ({
  id,
  data,
}: {
  id: string;
  data: TAddPeriod;
}) => {
  try {
    const updatedGroup = await db.generationPeriod.update({
      where: {
        id,
      },
      data,
    });
    return updatedGroup;
  } catch (error) {
    throw error;
  }
};

export const deleteGenerationPeriod = async ({ id }: { id: string }) => {
  try {
    const data = await db.generationPeriod.delete({
      where: {
        id,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const retrieveGenerationPeriods = async ({
  pagination = {},
  search,
}: {
  pagination?: TPaginationQuery;
  search?: string;
}) => {
  const { lastItemIndex, pageSize: _pageSize } = pagination;
  const pageSize = _pageSize ? +_pageSize : config.DEFAULT_PAGE_SIZE;
  try {
    const total = await db.generationPeriod.count({
      where: { name: { contains: search } },
    });
    const data = await db.generationPeriod.findMany({
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
        endDate: true,
        startDate: true,
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
