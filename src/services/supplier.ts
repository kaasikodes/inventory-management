import config from "../_config";
import { db } from "../lib/database";
import { TPaginationQuery } from "../types/generic";

export const createSupplierProfile = async ({
  creditLimitId,
  paymentTermId,
  userId,
}: {
  creditLimitId: string;
  paymentTermId: string;
  userId: string;
}) => {
  try {
    const data = await db.supplierProfile.create({
      data: {
        creditLimitId,
        paymentTermId,
        userId,
      },
      select: {
        id: true,
        user: {
          select: {
            name: true,
            image: true,
            id: true,
          },
        },
        creditLimit: true,
        paymentTerm: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const updateSupplierProfile = async ({
  id,
  data,
}: {
  id: string;
  data: {
    creditLimitId?: string;
    paymentTermId?: string;
  };
}) => {
  try {
    const updatedGroup = await db.supplierProfile.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        user: {
          select: {
            name: true,
            image: true,
            id: true,
          },
        },
        creditLimit: true,
        paymentTerm: true,
      },
    });
    return updatedGroup;
  } catch (error) {
    throw error;
  }
};

export const retrieveSupplierProfile = async ({ id }: { id: string }) => {
  try {
    const data = await db.supplierProfile.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        user: {
          select: {
            name: true,
            image: true,
            id: true,
          },
        },
        creditLimit: true,
        paymentTerm: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const deleteSupplierProfile = async ({ id }: { id: string }) => {
  try {
    const data = await db.supplierProfile.delete({
      where: {
        id,
      },

      select: {
        id: true,
        user: {
          select: {
            name: true,
            image: true,
            id: true,
          },
        },
        creditLimit: true,
        paymentTerm: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const retrieveSupplierProfiles = async ({
  pagination = {},
  search,
}: {
  pagination?: TPaginationQuery;
  search?: string;
}) => {
  const { lastItemIndex, pageSize: _pageSize } = pagination;
  const pageSize = _pageSize ? +_pageSize : config.DEFAULT_PAGE_SIZE;
  try {
    const total = await db.supplierProfile.count({
      where: {
        user: {
          name: { contains: search },
        },
      },
    });
    const data = await db.supplierProfile.findMany({
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
        user: {
          name: { contains: search },
        },
      },
      select: {
        id: true,
        user: {
          select: {
            name: true,
            image: true,
            id: true,
          },
        },
        creditLimit: true,
        paymentTerm: true,
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
