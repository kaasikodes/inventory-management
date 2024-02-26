import { UserStatus } from "@prisma/client";
import { db } from "../lib/database";

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
export const retriveUsers = async () => {
  // TODO: Implement authentication
  try {
    const user = await db.user.findMany({
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
        password: true,
        emailVerified: true,
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
    name: string;
    image?: string;
    addressId?: string;
  };
}) => {
  const { addressId, name, image } = data;
  try {
    const updatedGroup = await db.user.update({
      where: {
        id,
      },
      data: {
        name,
        image,
        addressId,
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
