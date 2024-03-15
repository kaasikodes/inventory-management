import { EReportType } from "@prisma/client";
import config from "../_config";
import { db } from "../lib/database";
import { TPaginationQuery } from "../types/generic";

export const createReport = async ({
  name,
  description,
  data,
  generatedBy,
  type,
}: {
  name: string;
  generatedBy: string;
  data: string; //json string
  type: EReportType;
  description?: string;
}) => {
  // TODO: Update schema to connect generatedBy to the user associated with the report, do this for all models implemting a similar pattern
  try {
    const report = await db.report.create({
      data: {
        name,
        description,
        data,
        generatedBy,
        type,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return report;
  } catch (error) {
    throw error;
  }
};

export const retrieveReports = async ({
  pagination = {},
  search,
}: {
  pagination?: TPaginationQuery;
  search?: string;
}) => {
  const { lastItemIndex, pageSize: _pageSize } = pagination;
  const pageSize = _pageSize ? +_pageSize : config.DEFAULT_PAGE_SIZE;
  try {
    const total = await db.report.count({
      where: { name: { contains: search } },
    });
    const data = await db.report.findMany({
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

export const retrieveReport = async ({ id }: { id: string }) => {
  try {
    const data = await db.report.findUnique({
      where: {
        id,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteReport = async ({ id }: { id: string }) => {
  try {
    const data = await db.report.delete({
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

export const updateReport = async ({
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
    const updatedGroup = await db.report.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        description: true,
        name: true,
      },
    });
    return updatedGroup;
  } catch (error) {
    throw error;
  }
};
