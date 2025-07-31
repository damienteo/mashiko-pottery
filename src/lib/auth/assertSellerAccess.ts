import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function assertSellerAccess(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.role !== "SELLER") {
    throw new NextResponse("Forbidden: Seller access only", { status: 403 });
  }
}