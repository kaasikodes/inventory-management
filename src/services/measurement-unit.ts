import config from "../_config";
import { db } from "../lib/database";
import { TPaginationQuery } from "../types/generic";

export const createMeasurementUnit = async ({ name }: { name: string }) => {
  try {
    const data = await db.measurementUnit.create({
      data: {
        name,
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
export const updateMeasurementUnit = async ({
  id,
  data,
}: {
  id: string;
  data: {
    name: string;
  };
}) => {
  try {
    const updatedGroup = await db.measurementUnit.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        name: true,
      },
    });
    return updatedGroup;
  } catch (error) {
    throw error;
  }
};

export const retrieveMeasurementUnitByName = async ({
  name,
}: {
  name: string;
}) => {
  try {
    const data = await db.measurementUnit.findFirst({
      where: {
        name,
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
export const retrieveMeasurementUnit = async ({ id }: { id: string }) => {
  try {
    const data = await db.measurementUnit.findUnique({
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
export const deleteMeasurementUnit = async ({ id }: { id: string }) => {
  try {
    const data = await db.measurementUnit.delete({
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
export const retrieveMeasurementUnits = async ({
  pagination = {},
  search,
}: {
  pagination?: TPaginationQuery;
  search?: string;
}) => {
  const { lastItemIndex, pageSize: _pageSize } = pagination;
  const pageSize = _pageSize ? +_pageSize : config.DEFAULT_PAGE_SIZE;
  try {
    const total = await db.measurementUnit.count({
      where: { name: { contains: search } },
    });
    const data = await db.measurementUnit.findMany({
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
