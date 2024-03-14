import { ActionStatus } from "@prisma/client";
import config from "../_config";
import { db } from "../lib/database";
import { TPaginationQuery } from "../types/generic";

export const createAuditRecord = async ({
  summary,
  action,
  details,
  invokerId,
  routePath,
  status,
}: {
  summary?: string;
  action: string;
  routePath: string;
  invokerId: string;
  details?: string;
  status: ActionStatus;
}) => {
  try {
    const data = await db.audit.create({
      data: {
        summary,
        details,
        invokerId,
        action,
        routePath,
        status,
      },
      select: {
        id: true,
        summary: true,
        invokedAt: true,
        invoker: true,
        details: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const retrieveAuditRecords = async ({
  pagination = {},
  search,
  invokerId,
}: {
  pagination?: TPaginationQuery;
  search?: string;
  invokerId?: string;
}) => {
  const { lastItemIndex, pageSize: _pageSize } = pagination;
  const pageSize = _pageSize ? +_pageSize : config.DEFAULT_PAGE_SIZE;
  try {
    const total = await db.audit.count({
      where: {
        summary: { contains: search },
        invokerId: { equals: invokerId },
      },
    });
    const data = await db.audit.findMany({
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
        summary: { contains: search },
        invokerId: { equals: invokerId },
      },
      select: {
        id: true,
        summary: true,
        invokedAt: true,
        invoker: true,
        details: true,
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

export const retrieveAuditRecord = async ({ id }: { id: string }) => {
  try {
    const data = await db.audit.findUnique({
      where: {
        id,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
