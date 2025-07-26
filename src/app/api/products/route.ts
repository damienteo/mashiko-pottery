import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const category = searchParams.get("category") || undefined;
    const minPrice = parseFloat(searchParams.get("minPrice") || "");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "");
    const potterId = parseInt(searchParams.get("potterId") || "", 10);
    const title = searchParams.get("title") || undefined;
    const inStock = searchParams.get("inStock") === "true";

    const whereClause: PrismaClient["product"]["findMany"]["arguments"]["where"] =
      {};

    if (category) whereClause.category = category;
    if (!isNaN(minPrice))
      whereClause.price = { ...(whereClause.price || {}), gte: minPrice };
    if (!isNaN(maxPrice))
      whereClause.price = { ...(whereClause.price || {}), lte: maxPrice };
    if (!isNaN(potterId)) whereClause.potterId = potterId;
    if (title) whereClause.title = { contains: title, mode: "insensitive" };
    if (inStock) whereClause.stock = { gt: 0 };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        where: whereClause,
        include: {
          potter: true,
        },
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({
      products,
      filters: { category, minPrice, maxPrice, potterId, title, inStock },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { title, description, price, stock, potterId } = data;

    if (!title || !description || !price || !stock || !potterId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
