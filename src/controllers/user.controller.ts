import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import {
  addUserSchema,
  assignMultipleUsersToGroupSchema,
  changeUserStatusInBulkSchema,
  editUserSchema,
  importUsersSchema,
  removeMultipleUsersFromGroupSchema,
} from "../validation/user";
import {
  assignMultipleUsersToGroup,
  changeUserStatusInBulk,
  createMultipleUsers,
  deleteUser,
  getUserById,
  removeMultipleUsersFromGroup,
  retrieveUsers,
  updateUser,
} from "../services/user.service";
import { hashPassword } from "../services/auth.service";
import { v4 as uuidv4 } from "uuid";
import {
  AppJSONResponse,
  AppJSONResponseWithPagination,
} from "../types/reponse";
import { sendAddedUserPasswordGeneratedBySystem } from "../services/mail.service";
import { exportCsvFile } from "../lib/file";
import { UserStatus } from "@prisma/client";
import { createOrUpdateAddress } from "../services/address.service";
import { executeAddUserSteps } from "../lib/utils/user";
import { AppError } from "../types/error";
import { TPaginationQuery, TSearchQuery } from "../types/generic";
import { Counter } from "prom-client";

export const exportUserImportTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const csvData = [
      {
        name: "John Doe",
        email: "john doe",
        status: "ACTIVE, INACTIVE,  PENDING,  BLACKLISTED",
      },
    ];
    return exportCsvFile({ csvData, fileName: "user-import-template" })(
      req,
      res
    );
  } catch (error) {
    next(error);
  }
};
export const removeUsersFromGroup = async (
  req: Request<{}, {}, z.infer<typeof removeMultipleUsersFromGroupSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { groupId, userIds } = req.body;

    const users = await removeMultipleUsersFromGroup({
      groupId,
      userIds,
    });
    if (users.count === 0) {
      return res
        .status(200)
        .json(new AppJSONResponse("No users were added to the group!", null));
    }
    const jsonReponse = new AppJSONResponse(
      `${users.count} user(s) were added successfully to group!`,
      {
        count: users.count,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const addUsersToGroup = async (
  req: Request<{}, {}, z.infer<typeof assignMultipleUsersToGroupSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { groupId, userIds } = req.body;
    const authUser = req.user;
    if (!authUser) {
      throw new AppError("Authenticated User missing", 401);
    }
    const users = await assignMultipleUsersToGroup({
      groupId,
      userIds,
      assignedBy: authUser.id,
    });
    if (users.count === 0) {
      return res
        .status(200)
        .json(new AppJSONResponse("No users were added to the group!", null));
    }
    const jsonReponse = new AppJSONResponse(
      `${users.count} user(s) were added successfully to group!`,
      {
        count: users.count,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const updateStatusOfUsersInBulk = async (
  req: Request<{}, {}, z.infer<typeof changeUserStatusInBulkSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, userIds } = req.body;
    const users = await changeUserStatusInBulk({
      status,
      userIds,
    });
    if (users.count === 0) {
      return res
        .status(200)
        .json(new AppJSONResponse("No user status were updated!", null));
    }
    const jsonReponse = new AppJSONResponse(
      `${users.count} user(s) status updated successfully!`,
      {
        count: users.count,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const removeUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await deleteUser({
      id,
    });
    if (user === null) {
      return res.status(200).json(new AppJSONResponse("No user found!", null));
    }
    const jsonReponse = new AppJSONResponse("User deleted successfully!", {
      ...user,
    });
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const getUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await getUserById({
      id,
    });
    if (user === null) {
      return res.status(200).json(new AppJSONResponse("No user found!", null));
    }
    const jsonReponse = new AppJSONResponse("User retrieved successfully!", {
      email: user.email,
      id: user.id,
      name: user.name,
    });
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const getUsers =
  (userCounter: Counter) =>
  async (
    req: Request<
      {},
      {},
      {},
      TPaginationQuery & TSearchQuery & { groupIds?: string }
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { lastItemIndex, pageSize, search, groupIds } = req.query;

      const { metaData, data } = await retrieveUsers({
        pagination: {
          lastItemIndex,
          pageSize,
        },
        search,
        groupIds: groupIds?.split(","),
      });

      const jsonReponse = new AppJSONResponseWithPagination(
        "Users retrieved successfully!",
        {
          lastItemIndex: metaData.lastIndex,
          result: data,
          total: metaData.total,
          hasNextPage: metaData.hasNextPage,
        }
      );
      userCounter.inc();
      return res.status(200).json(jsonReponse);
    } catch (error) {
      next(error);
    }
  };
export const importUsers = async (
  req: Request<{}, {}, z.infer<typeof importUsersSchema>>,
  res: Response,
  next: NextFunction
) => {
  // TODO: Wrap the entire function in try catch, folowing the pattern demonstrated here
  try {
    const { data } = req.body;
    const usersWithPasswords = await Promise.all(
      data.map(
        async ({
          email,
          name,
          status,
        }): Promise<{
          email: string;
          name: string;
          status?: UserStatus;
          password: string;
          hashedPassword: string;
        }> => {
          // TODO: Create a service for creatingAUniquePassword generated by system as opposed to just the uuid
          const password = uuidv4();
          const hashedPassword = await hashPassword({ password });
          return {
            email,
            name,
            status,
            password,
            hashedPassword,
          };
        }
      )
    );
    await createMultipleUsers({
      data: usersWithPasswords.map((user) => ({
        email: user.email,
        hashedPassword: user.hashedPassword,
        name: user.name,
        status: user.status,
      })),
    });
    usersWithPasswords.forEach(({ email, password }) => {
      sendAddedUserPasswordGeneratedBySystem({
        email,
        password,
      });
    });
    const jsonReponse = new AppJSONResponse("Users imported successfully!", {
      usersAddedCount: data.length,
      content: data,
    });
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const addUser = async (
  req: Request<{}, {}, z.infer<typeof addUserSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const user = await executeAddUserSteps(data);
    const jsonReponse = new AppJSONResponse("User created successfully!", {
      email: user.email,
      id: user.id,
      name: user.name,
    });
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};

export const editUser = async (
  req: Request<{ id: string }, {}, z.infer<typeof editUserSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Attach the image to the req body via middleware (use aws s3)
    const { id } = req.params;
    const { name, address, image, status } = req.body;
    const _address =
      address && (await createOrUpdateAddress({ ...address, id: address?.id }));
    const user = await updateUser({
      id,
      data: {
        name,
        image,
        addressId: _address?.id,
        status,
      },
    });

    const jsonReponse = new AppJSONResponse("User updated successfully!", {
      name,

      id: user.id,
    });
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
