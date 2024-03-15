import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import {
  AppJSONResponse,
  AppJSONResponseWithPagination,
} from "../types/reponse";
import { TPaginationQuery, TSearchQuery } from "../types/generic";
import {
  deleteAllUserNotifications,
  deleteNotification,
  retieveNotification,
  retieveNotificationSettings,
  retrieveNotifications,
  saveNotificationSettings,
} from "../services/notification";
import { saveNotificationSettingSchema } from "../validation/notification";

export const getUserNotifications = async (
  req: Request<{}, {}, {}, TPaginationQuery & TSearchQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lastItemIndex, pageSize, search } = req.query;
    const authUser = req.user;
    if (!authUser) {
      throw new Error("User not found");
    }

    const { metaData, data } = await retrieveNotifications({
      pagination: {
        lastItemIndex,
        pageSize,
      },
      search,
      userId: authUser.id,
    });

    const jsonReponse = new AppJSONResponseWithPagination(
      "Notifications retrieved successfully!",
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
export const removeNotification = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await deleteNotification({
      id,
    });

    const jsonReponse = new AppJSONResponse(
      "Notification deleted successfully!",
      {
        data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const removeAllUserNotifications = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const authUser = req.user;
    if (!authUser) {
      throw new Error("User not found");
    }
    const data = await deleteAllUserNotifications({
      userId: authUser.id,
    });

    const jsonReponse = new AppJSONResponse(
      "All User Notification deleted successfully!",
      {
        data,
      }
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const getNotificationSettings = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await retieveNotificationSettings();

    const jsonReponse = new AppJSONResponse(
      "Notification Setting retrieved successfully!",
      data
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const getNotification = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const data = await retieveNotification({
      id,
    });

    const jsonReponse = new AppJSONResponse(
      "Notification retrieved successfully!",
      data
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
export const createOrUpdateNotificationSettings = async (
  req: Request<{}, {}, z.infer<typeof saveNotificationSettingSchema>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userGroupIdsToBeNotified, userIdsToBeNotified } = req.body;

    const data = await saveNotificationSettings({
      userGroupIdsToBeNotified,
      userIdsToBeNotified,
    });

    const jsonReponse = new AppJSONResponse(
      "Notification setting saved successfully!",
      data
    );
    return res.status(200).json(jsonReponse);
  } catch (error) {
    next(error);
  }
};
