import config from "../_config";
import { PERMISSION_LABELS } from "../constants";
import { db } from "../lib/database";
import { TPaginationQuery } from "../types/generic";

export const retrievePermissions = async ({
  pagination = {},
  search,
}: {
  pagination?: TPaginationQuery;
  search?: string;
}) => {
  const { lastItemIndex, pageSize: _pageSize } = pagination;
  const pageSize = _pageSize ? +_pageSize : config.DEFAULT_PAGE_SIZE;
  try {
    const total = await db.permission.count({
      where: { name: { contains: search } },
    });
    const data = await db.permission.findMany({
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
        label: true,
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

export const createDefaultPermissions = async () => {
  try {
    const data = await db.permission.createMany({
      data: PERMISSION_LABELS.map((item) => ({ name: item, label: item })),
     
    });

    return data;
  } catch (error) {
    throw error;
  }
};
