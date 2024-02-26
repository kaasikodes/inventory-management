import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(3),
});
export const verifyUserSchema = z.object({
  email: z.string().email(),
  token: z.string(),
});
export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});
export const resetPasswordSchema = z.object({
  email: z.string().email(),
  token: z.string(),
  newPassword: z.string().min(6),
});
export const changeAuthUserPasswordSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  oldPassword: z.string(),
});
