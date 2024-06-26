import { PrismaClient } from "@prisma/client";
import config from "../../_config";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (config.nodeEnv !== "production") globalThis.prisma = db;
