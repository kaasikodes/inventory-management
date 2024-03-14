import { v4 as uuidv4 } from "uuid";
import { db } from "../lib/database";
import config from "../_config";
import jwt from "jsonwebtoken";
import { TJwtUserPayload } from "../middleware/auth";

// TODO: Consider storing the refresh token & access token in the database as well, via user.account
export const createAccessToken = (user: TJwtUserPayload) =>
  jwt.sign({ ...user }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: config.accessTokenExpiresIn,
  });
export const createRefreshToken = (user: TJwtUserPayload) =>
  jwt.sign({ ...user }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: config.refreshTokenExpiresIn,
  });
export const createAccountForTokenMonitoring = async ({
  userId,
  accessToken,
  refreshToken,
}: {
  userId: string;
  accessToken: string;
  refreshToken: string;
}) => {
  // TODO: Consider using enums and also updating the account table to account for other methods of authentication such as google, twitter, microsoft
  try {
    const account = await db.account.create({
      data: {
        userId,
        provider: "credentials",
        providerAccountId: uuidv4(), //temporarily for now
        access_token: accessToken,
        type: "credentials",
        refresh_token: refreshToken,
      },
    });
    return account;
  } catch (error) {
    throw error;
  }
};
export const createPasswordResetToken = async ({
  email,
}: {
  email: string;
}) => {
  try {
    const token = await db.passwordResetToken.create({
      data: {
        token: uuidv4(),
        email,
        expires: config.passwordResetTokenExpiresAt(),
      },
    });
    return token;
  } catch (error) {
    throw error;
  }
};
export const createVerificationToken = async ({ email }: { email: string }) => {
  try {
    const token = await db.verificationToken.create({
      data: {
        token: uuidv4(),
        email,
        expires: config.verificationTokenExpiresAt(),
      },
    });
    return token;
  } catch (error) {
    throw error;
  }
};

export const deleteAccountForTokenMonitoring = async ({
  id,
}: {
  id: string;
}) => {
  try {
    await db.account.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw error;
  }
};
export const getAccountForTokenMonitoring = async ({
  refreshToken,
  userId,
  accessToken,
}: {
  refreshToken: string;
  userId: string;
  accessToken?: string;
}) => {
  try {
    const account = await db.account.findFirst({
      where: {
        refresh_token: refreshToken,
        userId: userId,
        access_token: accessToken,
      },
      select: {
        id: true,
        refresh_token: true,
        access_token: true,
      },
    });
    return account;
  } catch (error) {
    throw error;
  }
};
export const updateAccountForTokenMonitoringAccessToken = async ({
  refreshToken,
  userId,
  accessToken,
}: {
  refreshToken: string;
  accessToken: string;
  userId: string;
}) => {
  try {
    const account = await getAccountForTokenMonitoring({
      refreshToken,
      userId,
    });
    if (!account || !(account && account?.id)) {
      throw new Error("Account not found");
    }
    const updatedAccount = await db.account.update({
      where: {
        id: account?.id,
      },
      data: {
        access_token: accessToken,
      },
      select: {
        access_token: true,
      },
    });
    return updatedAccount;
  } catch (error) {
    throw error;
  }
};
export const deletePasswordResetToken = async ({ id }: { id: string }) => {
  try {
    await db.passwordResetToken.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw error;
  }
};
export const deleteVerificationToken = async ({ id }: { id: string }) => {
  try {
    await db.verificationToken.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw error;
  }
};
export const getUserPasswordResetToken = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: {
        email,
        token,
      },
    });
    return passwordResetToken;
  } catch (error) {
    throw error;
  }
};
export const getUserVerificationToken = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email,
        token,
      },
    });
    return verificationToken;
  } catch (error) {
    throw error;
  }
};
