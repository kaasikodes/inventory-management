import config from "../_config";
import { db } from "../lib/database";
import { TPaginationQuery } from "../types/generic";

export const createPaymentTerm = async ({
  name,
  description,
}: {
  name: string;
  description?: string;
}) => {
  try {
    const data = await db.paymentTerm.create({
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
export const updatePaymentTerm = async ({
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
    const updatedGroup = await db.paymentTerm.update({
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

export const deletePaymentTerm = async ({ id }: { id: string }) => {
  try {
    const data = await db.paymentTerm.delete({
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
export const retrievePaymentTerms = async ({
  pagination = {},
  search,
}: {
  pagination?: TPaginationQuery;
  search?: string;
}) => {
  const { lastItemIndex, pageSize: _pageSize } = pagination;
  const pageSize = _pageSize ? +_pageSize : config.DEFAULT_PAGE_SIZE;
  try {
    const total = await db.paymentTerm.count({
      where: { name: { contains: search } },
    });
    const data = await db.paymentTerm.findMany({
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
        hasNextPage: data.length !== total, //TODO: Correct logic for hasNextPage in pagination, refer article or come up with a better solution

        lastIndex: cursor,
        total,
      },
    };
  } catch (error) {
    throw error;
  }
};
