import { db } from "../lib/database";
import bcrypt from "bcrypt";

export const verifyUserAccount = async ({ email }: { email: string }) => {
  try {
    const user = await db.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: new Date(),
        status: "ACTIVE",
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

export const doesUserPasswordMatch = async ({
  password,
  userPassword,
}: {
  password: string;
  userPassword: string;
}) => {
  const isPasswordCorrect = await bcrypt.compare(password, userPassword);
  return isPasswordCorrect;
};
export const hashPassword = async ({ password }: { password: string }) => {
  return await bcrypt.hash(password, 10);
};
