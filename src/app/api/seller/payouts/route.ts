import { NextResponse } from "next/server";
import { PrismaClient, Prisma, PayoutStatus } from "@prisma/client";
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
  const status = searchParams.get("status");
  const month = searchParams.get("month");

  const sort = searchParams.get("sort") || "createdAt";
  const order =
    (searchParams.get("order") || "desc").toLowerCase() === "asc"
      ? "asc"
      : "desc";

  const whereClause: Prisma.PayoutWhereInput = { potterId: potter.id };
  if (status && Object.values(PayoutStatus).includes(status as PayoutStatus)) {
    whereClause.status = status as PayoutStatus;
  }

  if (month) {
    const [year, monthNum] = month.split("-").map(Number);
    if (!isNaN(year) && !isNaN(monthNum)) {
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 1);
      whereClause.createdAt = {
        gte: startDate,
        lt: endDate,
      };
    }
  }

  const [payouts, total] = await Promise.all([
    prisma.payout.findMany({
      where: whereClause,
      orderBy: { [sort]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.payout.count({ where: whereClause }),
  ]);

  return NextResponse.json({
    payouts,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}
