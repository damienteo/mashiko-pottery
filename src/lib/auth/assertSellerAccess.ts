import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function assertSellerAccess(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.role !== "SELLER") {
    throw new NextResponse("Forbidden: Seller access only", { status: 403 });
  }
}