import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { assertSellerAccess } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  const user = await assertSellerAccess();

  const potter = await prisma.potter.findUnique({
    where: { userId: user.id },
  });

  if (!potter) {
    return NextResponse.json(
      { error: "Seller profile not found" },
      { status: 404 }
    );
  }

  const products = await prisma.product.findMany({
    where: { potterId: potter.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
