import { PrismaClient } from "@/generated/prisma/client";
import { NextResponse } from "next/server";

export const validatePotterExists = async (
  potterId: number,
  prisma: PrismaClient,
) => {
  const potter = await prisma.potter.findUnique({
    where: { id: potterId },
  });

  if (!potter) {
    throw new NextResponse("Potter not found", { status: 404 });
  }

  return potter;
};
