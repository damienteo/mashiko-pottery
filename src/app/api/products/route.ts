import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PrismaClient, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { jsonErrorResponse } from "@/lib/errors/jsonErrorResponse";
import { validateProductExists } from "@/lib/validation/validateProductExists";
import { validatePotterExists } from "@/lib/validation/validatePotterExists";
import { assertSellerAccess } from "@/lib/auth/assertSellerAccess";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination (safe defaults)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    // Unified text query and locale-aware search
    const textQuery =
      searchParams.get("q") ||
      searchParams.get("name") ||
      searchParams.get("title") ||
      undefined;

    const localeParam = searchParams.get("locale");
    const locale = (localeParam === "en" || localeParam === "ja" || localeParam === "zh")
      ? (localeParam as "en" | "ja" | "zh")
      : null;

    const category = searchParams.get("category") || undefined;
    const style = searchParams.get("style") || undefined; // NOTE: only used if Product has a `style` column

    const activeStr = searchParams.get("active");
    const inStockStr = searchParams.get("inStock");
    const active: boolean | null =
      typeof activeStr === "string"
        ? activeStr === "true" || activeStr === "1"
        : typeof inStockStr === "string"
        ? inStockStr === "true" || inStockStr === "1"
        : null;

    // Price range
    const priceMinRaw = searchParams.get("priceMin") ?? searchParams.get("minPrice") ?? "";
    const priceMaxRaw = searchParams.get("priceMax") ?? searchParams.get("maxPrice") ?? "";
    const priceMin = parseFloat(priceMinRaw);
    const priceMax = parseFloat(priceMaxRaw);

    // Potter filter
    const potterIdRaw = searchParams.get("potterId") || "";
    const potterId = parseInt(potterIdRaw, 10);

    // Build a locale-aware text filter against title/description JSON
    const textFilter: Prisma.ProductWhereInput =
      textQuery
        ? (locale
            ? {
                OR: [
                  { title: { path: [locale], string_contains: textQuery, mode: "insensitive" } },
                  { description: { path: [locale], string_contains: textQuery, mode: "insensitive" } },
                ],
              }
            : {
                OR: [
                  { title: { path: ["en"], string_contains: textQuery, mode: "insensitive" } },
                  { title: { path: ["ja"], string_contains: textQuery, mode: "insensitive" } },
                  { title: { path: ["zh"], string_contains: textQuery, mode: "insensitive" } },
                  { description: { path: ["en"], string_contains: textQuery, mode: "insensitive" } },
                  { description: { path: ["ja"], string_contains: textQuery, mode: "insensitive" } },
                  { description: { path: ["zh"], string_contains: textQuery, mode: "insensitive" } },
                ],
              })
        : {};

    // Build where clause
    const priceFilter: Prisma.FloatFilter = {};
    if (!Number.isNaN(priceMin)) priceFilter.gte = priceMin;
    if (!Number.isNaN(priceMax)) priceFilter.lte = priceMax;

    const whereClause: Prisma.ProductWhereInput = {
      ...(Object.keys(priceFilter).length ? { price: priceFilter } : {}),
      ...(category ? { category } : {}),
      ...textFilter,
      // "active" means in stock and not a draft
      ...(active ? { stock: { gt: 0 }, isDraft: false } : {}),
      ...(Number.isNaN(potterId) ? {} : { potterId }),
      // If your Product model has a `style` column, enable the next line
      ...(style ? ({ /* style */ } as Prisma.ProductWhereInput) : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        where: whereClause,
        include: {
          potter: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      products,
      filters: {
        name: textQuery ?? null,
        locale: locale ?? null,
        category: category ?? null,
        style: style ?? null,
        active: active ?? null,
        priceMin: Number.isNaN(priceMin) ? null : priceMin,
        priceMax: Number.isNaN(priceMax) ? null : priceMax,
        potterId: Number.isNaN(potterId) ? null : potterId,
      },
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

    // TODO: Add proper server-side data validation using Zod or similar
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
    throw new Error("Forbidden");
  }


};
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Add proper server-side data validation using Zod or similar
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
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
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

    // TODO: Add proper server-side data validation using Zod or similar
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await authorizeSellerForProduct(user.id, id, prisma);

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return jsonErrorResponse("Failed to delete product", 500);
  }
}