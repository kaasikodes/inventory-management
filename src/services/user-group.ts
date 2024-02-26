import config from "../_config";
import { db } from "../lib/database";
import { TPaginationQuery } from "../types/generic";

export const createUserGroup = async ({
  name,
  description,
  permissionIds,
}: {
  name: string;
  description?: string;
  permissionIds?: string[];
}) => {
  try {
    const data = await db.userGroup.create({
      data: {
        name,
        description,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    permissionIds &&
      permissionIds?.length > 0 &&
      (await db.userGroup.update({
        where: {
          id: data.id,
        },
        data: {
          permissions: {
            connect: permissionIds?.map((permissionId) => ({
              permissionId,
              userGroupId_permissionId: {
                permissionId,
                userGroupId: data.id,
              },
            })),
          },
        },
      }));
    return data;
  } catch (error) {
    throw error;
  }
};
export const updateUserGroup = async ({
  id,
  data,
}: {
  id: string;
  data: {
    name: string;
    description?: string;
    permissionIds?: string[];
  };
}) => {
  try {
    const updatedGroup = await db.userGroup.update({
      where: {
        id,
      },
      data: {
        ...data,
        permissions: {
          connect: data.permissionIds?.map((permissionId) => ({
            permissionId,
            userGroupId_permissionId: {
              permissionId,
              userGroupId: id,
            },
          })),
        },
      },
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

export const deleteUserGroup = async ({ id }: { id: string }) => {
  try {
    const data = await db.userGroup.delete({
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
export const retrieveUserGroup = async ({ id }: { id: string }) => {
  try {
    const data = await db.userGroup.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        name: true,
        description: true,
        permissions: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const retriveUserGroups = async ({
  pagination = {},
  search,
}: {
  pagination?: TPaginationQuery;
  search?: string;
}) => {
  const { lastItemIndex, pageSize: _pageSize } = pagination;
  const pageSize = _pageSize ? +_pageSize : config.DEFAULT_PAGE_SIZE;
  try {
    const total = await db.userGroup.count({
      where: { name: { contains: search } },
    });
    const data = await db.userGroup.findMany({
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
export const addMultipleUsersToGroup = async ({
  groupId,
  userIds,
  assignedBy,
}: {
  userIds: string[];
  groupId: string;
  assignedBy: string;
}) => {
  try {
    const users = await db.userOnUserGroups.createMany({
      data: userIds.map((userId) => ({
        userGroupId: groupId,
        userId,
        assignedBy,
      })),
    });
    return { group: users, noOfUsersUpdated: userIds.length };
  } catch (error) {
    throw error;
  }
};
