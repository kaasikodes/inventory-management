import { UserStatus } from "@prisma/client";
import { db } from "../lib/database";
import { TPaginationQuery } from "../types/generic";
import config from "../_config";

export const updateUserPassword = async ({
  userId,
  hashedPassword,
}: {
  userId: string;
  hashedPassword: string;
}) => {
  try {
    const user = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
};

// TODO: Add to postman documentation for the associated route
export const removeMultipleUsersFromGroup = async ({
  groupId,
  userIds,
}: {
  userIds: string[];
  groupId: string;
}) => {
  try {
    const group = await db.userOnUserGroups.deleteMany({
      where: {
        userGroupId: groupId,
        userId: {
          in: userIds,
        },
      },
    });
    return { count: userIds.length, group };
  } catch (error) {
    throw error;
  }
};
export const assignMultipleUsersToGroup = async ({
  groupId,
  userIds,
  assignedBy,
}: {
  userIds: string[];
  groupId: string;
  assignedBy: string;
}) => {
  try {
    const group = await db.userGroup.update({
      where: {
        id: groupId,
      },
      data: {
        users: {
          connectOrCreate: userIds.map((userId) => ({
            create: {
              assignedBy,
              userId,
            },
            where: {
              userId_userGroupId: {
                userGroupId: groupId,
                userId,
              },
            },
          })),
        },
      },
    });
    return { count: userIds.length, group };
  } catch (error) {
    throw error;
  }
};
export const changeUserStatusInBulk = async ({
  status,
  userIds,
}: {
  userIds: string[];
  status: UserStatus;
}) => {
  try {
    const users = await db.user.updateMany({
      where: {
        id: {
          in: userIds,
        },
      },
      data: {
        status,
      },
    });
    return users;
  } catch (error) {
    throw error;
  }
};
export const createUser = async ({
  name,
  email,
  hashedPassword,
  status,
  addressId,
}: {
  name: string;
  email: string;
  addressId?: string;
  hashedPassword: string;
  status?: UserStatus;
}) => {
  try {
    const user = await db.user.create({
      data: {
        name,
        password: hashedPassword,
        email,
        status,
        addressId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
};
export const createMultipleUsers = async ({
  data,
}: {
  data: {
    name: string;
    email: string;
    hashedPassword: string;
    status?: UserStatus;
  }[];
}) => {
  try {
    const user = await db.user.createMany({
      data: data.map(({ name, email, hashedPassword, status }) => ({
        name,
        password: hashedPassword,
        status,
        email,
      })),
      skipDuplicates: true,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

export const retrieveUsers = async ({
  pagination = {},
  search,
  groupIds,
}: {
  pagination?: TPaginationQuery;
  search?: string;
  groupIds?: string[];
}) => {
  const { lastItemIndex, pageSize: _pageSize } = pagination;
  const pageSize = _pageSize ? +_pageSize : config.DEFAULT_PAGE_SIZE;
  try {
    const total = await db.user.count({
      where: {
        name: { contains: search },
        userGroups: groupIds
          ? {
              some: {
                userGroupId: {
                  in: groupIds,
                },
              },
            }
          : undefined,
      },
    });
    const data = await db.user.findMany({
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
        name: { contains: search },
        userGroups: groupIds
          ? {
              some: {
                userGroupId: {
                  in: groupIds,
                },
              },
            }
          : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
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

export const deleteUser = async ({ id }: { id: string }) => {
  try {
    const user = await db.user.delete({
      where: {
        id,
      },

      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
};
export const getUserById = async ({ id }: { id: string }) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
        userGroups: {
          select: {
            userGroup: {
              select: {
                name: true,
                permissions: {
                  select: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
};
export const checkExistingUserEmails = async ({
  emails,
}: {
  emails: string[];
}) => {
  try {
    const users = await db.user.findMany({
      where: {
        email: {
          in: emails,
        },
      },

      select: {
        name: true,
        email: true,
      },
    });
    return {
      allEmailsAreTaken: users.length === emails.length,
      emailsTaken: users,
      emailsNotTaken: emails.filter(
        (email) => !users.some((user) => user.email === email)
      ),
    };
  } catch (error) {
    throw error;
  }
};
export const getUserByEmail = async ({ email }: { email: string }) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },

      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
        password: true,
        emailVerified: true,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async ({
  id,
  data,
}: {
  id: string;
  data: {
    name?: string;
    image?: string;
    addressId?: string;
    status?: UserStatus;
  };
}) => {
  const { addressId, name, image, status } = data;
  try {
    const updatedGroup = await db.user.update({
      where: {
        id,
      },
      data: {
        name,
        image,
        addressId,
        status,
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });
    return updatedGroup;
  } catch (error) {
    throw error;
  }
};
