import { z } from "zod";
import {
  addUserGroupSchema,
  addUsersToGroupSchema,
  updateUserGroupSchema,
} from "../validation/user-group";
import { NextFunction, Request, Response } from "express";
import {
  createUserGroup,
  deleteUserGroup,
  updateUserGroup,
  retriveUserGroups,
  addMultipleUsersToGroup,
  retrieveUserGroup,
} from "../services/user-group";
import {
  AppJSONResponse,
  AppJSONResponseWithPagination,
} from "../types/reponse";
import { TPaginationQuery, TSearchQuery } from "../types/generic";
import { AppError } from "../types/error";

export const getUserGroups = async (
  req: Request<{}, {}, {}, TPaginationQuery & TSearchQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize, search } = req.query;

    const { metaData, data } = await retriveUserGroups({
      pagination: {
        lastItemIndex,
        pageSize,
      },
      search,
    });

    const jsonReponse = new AppJSONResponseWithPagination(
      "User groups retrieved successfully!",
      {
        lastItemIndex: metaData.lastIndex,
        result: data,
        total: metaData.total,
        hasNextPage: metaData.hasNextPage,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const getUserGroup = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await retrieveUserGroup({
      id,
    });

    const jsonReponse = new AppJSONResponse(
      data ? "User group retrieved successfully!" : "User group not found!",
      data
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const removeUserGroup = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await deleteUserGroup({
      id,
    });

    const jsonReponse = new AppJSONResponse(
      "User group deleted successfully!",
      {
        data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const editUserGroup = async (
  req: Request<{ id: string }, {}, z.infer<typeof updateUserGroupSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    // TODO: Add middleware to validate permssionIds sent are actually present in the database
    const { name, description, permissionIds } = req.body;
    const authUser = req.user;
    if (!authUser) {
      throw new AppError("User not found", 404);
    }

    const group = await updateUserGroup({
      id,
      data: { name, description, permissionIds, assignedBy: authUser.id },
    });

    const jsonReponse = new AppJSONResponse(
      "User group updated successfully!",
      {
        name,
        description,
        id: group.id,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const addUsersToGroup = async (
  req: Request<{}, {}, z.infer<typeof addUsersToGroupSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { groupId, userIds } = req.body;
    const authUser = req.user;
    if (!authUser) {
      throw new AppError("Authenticated User missing", 401);
    }
    const data = await addMultipleUsersToGroup({
      groupId,
      userIds,
      assignedBy: authUser.id,
    });

    const jsonReponse = new AppJSONResponse(
      `${userIds.length} users added to group successfully!`,
      {
        ...data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const addUserGroup = async (
  req: Request<{}, {}, z.infer<typeof addUserGroupSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, permissionIds } = req.body;
    const authUser = req.user;
    if (!authUser) {
      throw new AppError("User not found", 404);
    }

    const user = await createUserGroup({
      name,
      description,
      permissionIds,
      assignedBy: authUser?.id,
    });

    const jsonReponse = new AppJSONResponse(
      "User group created successfully!",
      {
        name,
        description,
        id: user.id,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
