import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function assertAdminAccess(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.role !== "ADMIN") {
    throw new NextResponse("Forbidden: Admin access only", { status: 403 });
  }
}