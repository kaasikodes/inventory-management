import config from "../_config";
import { db } from "../lib/database";
import { TPaginationQuery } from "../types/generic";

export const saveNotificationSettings = async ({
  userGroupIdsToBeNotified,
  userIdsToBeNotified,
}: {
  userGroupIdsToBeNotified?: string[];
  userIdsToBeNotified?: string[];
}) => {
  try {
    const data = await db.notificationSettings.create({
      data: {
        userGroupIdsToBeNotified: userGroupIdsToBeNotified,
        userIdsToBeNotified: userIdsToBeNotified,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteAllUserNotifications = async ({
  userId,
}: {
  userId: string;
}) => {
  try {
    const data = await db.notification.deleteMany({
      where: {
        userId,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const retieveNotification = async ({ id }: { id: string }) => {
  try {
    const data = await db.notification.findUnique({
      where: {
        id,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const deleteNotification = async ({ id }: { id: string }) => {
  try {
    const data = await db.notification.delete({
      where: {
        id,
      },

      select: {
        id: true,
        title: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const retrieveNotifications = async ({
  pagination = {},
  search,
  userId,
}: {
  pagination?: TPaginationQuery;
  search?: string;
  userId?: string;
}) => {
  const { lastItemIndex, pageSize: _pageSize } = pagination;
  const pageSize = _pageSize ? +_pageSize : config.DEFAULT_PAGE_SIZE;
  try {
    const total = await db.notification.count({
      where: {
        title: { contains: search },
        userId: {
          equals: userId,
        },
      },
    });
    const data = await db.notification.findMany({
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
        title: { contains: search },
        userId: {
          equals: userId,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        user: true,
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
