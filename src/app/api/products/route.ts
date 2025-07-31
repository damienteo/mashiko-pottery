import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { jsonErrorResponse } from "@/lib/errors/jsonErrorResponse";
import { validateProductExists } from "@/lib/validation/validateProductExists";
import { validatePotterExists } from "@/lib/validation/validatePotterExists";
import { assertSellerAccess } from "@/lib/auth/assertSellerAccess";


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
   return jsonErrorResponse("Error fetching products", 400);
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { title, description, price, stock, potterId } = data;

    if (!title || !description || !price || !stock || !potterId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const potter = await prisma.potter.findUnique({ where: { id: potterId } });

    if (!potter || potter.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await assertSellerAccess(user.id);  

    const newProduct = await prisma.product.create({ data });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return jsonErrorResponse("Failed to create product", 500);
  }
}

const authorizeSellerForProduct = async (
  userId: string,
  productId: number,
  prisma: PrismaClient
): Promise<void> => {
  await assertSellerAccess(userId);
  const product = await validateProductExists(productId, prisma);
  const potter = await validatePotterExists(product.potterId, prisma);

  if (potter.userId !== userId) {
    throw new NextResponse("Forbidden", { status: 403 });
  }


};
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { id, ...updates } = data;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await authorizeSellerForProduct(user.id, id, prisma);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return jsonErrorResponse("Failed to update product", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await authorizeSellerForProduct(user.id, id, prisma);

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return jsonErrorResponse("Failed to delete product", 500);
  }
}