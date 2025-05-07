// src/lib/prisma.ts

import { PrismaClient } from "@prisma/client";

const globalWithPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma =
  globalWithPrisma.prisma ??
  new PrismaClient({ log: ["query", "warn", "error"] });

if (process.env.NODE_ENV !== "production") {
  globalWithPrisma.prisma = prisma;
}
