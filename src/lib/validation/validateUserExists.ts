import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function validateUserExists(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new NextResponse("User not found", { status: 404 });
  }

  return user;
}