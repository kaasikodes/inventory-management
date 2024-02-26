import config from "../_config";
import { db } from "../lib/database";
import { TPaginationQuery } from "../types/generic";

export const createInputOutputRatio = async ({
  input,
  output,
}: {
  input: number;
  output: number;
}) => {
  try {
    const data = await db.inputOutputRatio.create({
      data: {
        input,
        output,
      },
      select: {
        id: true,
        input: true,
        output: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const createMultipleInputOutputRatios = async ({
  data,
}: {
  data: {
    input: number;
    output: number;
  }[];
}) => {
  try {
    // TODO: Update schema to connect input output ratio to inventory item
    const ratios = await db.inputOutputRatio.createMany({
      data: data,
    });
    return ratios;
  } catch (error) {
    throw error;
  }
};
export const updateInputOutputRatio = async ({
  id,
  data,
}: {
  id: string;
  data: {
    input: number;
    output: number;
  };
}) => {
  try {
    const updatedGroup = await db.inputOutputRatio.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        input: true,
        output: true,
      },
    });
    return updatedGroup;
  } catch (error) {
    throw error;
  }
};

export const deleteInputOutputRatio = async ({ id }: { id: string }) => {
  try {
    const data = await db.inputOutputRatio.delete({
      where: {
        id,
      },

      select: {
        id: true,
        input: true,
        output: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const retrieveInputOutputRatios = async ({
  pagination = {},
  search,
}: {
  pagination?: TPaginationQuery;
  search?: number;
}) => {
  const { lastItemIndex, pageSize: _pageSize } = pagination;
  const pageSize = _pageSize ? +_pageSize : config.DEFAULT_PAGE_SIZE;
  try {
    const total = await db.inputOutputRatio.count({
      where: {
        input: { in: search ? [search] : undefined },
        OR: [{ output: { in: search ? [search] : undefined } }],
      },
    });
    const data = await db.inputOutputRatio.findMany({
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
        input: { in: search ? [search] : undefined },
        OR: [{ output: { in: search ? [search] : undefined } }],
      },
      select: {
        id: true,
        input: true,
        output: true,
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
