import config from "../_config";
import { db } from "../lib/database";
import { TPaginationQuery } from "../types/generic";

export const createUserGroup = async ({
  name,
  description,
  permissionIds,
  assignedBy,
}: {
  name: string;
  description?: string;
  permissionIds?: string[];
  assignedBy: string;
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
      (await db.permissionsOnUserGroups.createMany({
        data: permissionIds?.map((permissionId) => ({
          permissionId,
          userGroupId: data.id,
          assignedBy,
        })),
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
    assignedBy: string;
  };
}) => {
  try {
    const group = await retrieveUserGroup({ id });
    const permissonIdsToDisconnect = group?.permissions
      .filter(
        (permission) =>
          !data.permissionIds?.includes(permission?.permission?.id ?? "")
      )
      .map((permission) => permission?.permission?.id);
    const permissionIdsToConnect = data.permissionIds
      ?.filter(
        (permissionId) =>
          !group?.permissions.some(
            (permission) => permission?.permission?.id === permissionId
          )
      )
      ?.filter((item) => typeof item === "string");
    // remove permission
    await db.permissionsOnUserGroups.deleteMany({
      where: {
        permissionId: {
          in: permissonIdsToDisconnect as string[],
        },
        userGroupId: id,
      },
    });
    // update group & connect permissions
    const updatedGroup = await db.userGroup.update({
      where: {
        id,
      },
      data: {
        description: data.description,
        name: data.name,
        permissions: {
          connectOrCreate: permissionIdsToConnect?.map((permissionId) => ({
            where: {
              userGroupId_permissionId: {
                userGroupId: id,
                permissionId,
              },
            },
            create: {
              assignedBy: data.assignedBy,
              permissionId,
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
        permissions: {
          select: {
            permission: true,
          },
        },
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
        hasNextPage: data.length !== total, //TODO: Correct logic for hasNextPage in pagination, refer article or come up with a better solution
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
