import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  leadDevPrisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.leadDevPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.leadDevPrisma = prisma;
}
