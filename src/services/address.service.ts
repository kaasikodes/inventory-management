import { Address } from "@prisma/client";
import { db } from "../lib/database";

export const getAddressByParams = async ({ id }: { id: string }) => {
  try {
    const data = await db.address.findUnique({
      where: {
        id,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const getAddress = async ({ id }: { id: string }) => {
  try {
    const data = await db.address.findUnique({
      where: {
        id,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const createOrUpdateAddress = async (
  address: Pick<
    Address,
    | "countryId"
    | "stateId"
    | "streetAddress"
    | "lgaId"
    | "latitude"
    | "timeZone"
    | "longitude"
  > & { id: string | undefined }
) => {
  try {
    const data = await db.address.upsert({
      where: {
        ...address,
      },
      update: {
        ...address,
      },
      create: {
        ...address,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
