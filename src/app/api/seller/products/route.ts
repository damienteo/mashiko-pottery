import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { assertSellerAccess } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
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

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
  const category = searchParams.get("category");
  const title = searchParams.get("title");
  const sort = searchParams.get("sort") || "createdAt";
  const order =
    (searchParams.get("order") || "desc").toLowerCase() === "asc"
      ? "asc"
      : "desc";

  const whereClause: PrismaClient["product"]["findMany"]["arguments"]["where"] =
    {
      potterId: potter.id,
    };
  if (category) whereClause.category = category;
  if (title) whereClause.title = { contains: title, mode: "insensitive" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      orderBy: { [sort]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where: whereClause }),
  ]);

  return NextResponse.json({
    products,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}
