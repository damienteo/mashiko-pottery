import { createClient } from "@/lib/supabase/server";
import { assertSellerAccess } from "@/lib/auth/assertSellerAccess";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(Math.max(1, parseInt(searchParams.get("limit") || "10", 10)), 100);
    const skip = (page - 1) * limit;

    const name = searchParams.get("name");
    const style = searchParams.get("style");
    const active = searchParams.get("active");

    const whereClause: Prisma.PotterWhereInput = {};

    // KIV: This assumes `name` is a JSON object with an "en" key. May need fallback or validation.
    if (name) {
      whereClause.name = {
        path: ["en"],
        string_contains: name,
      };
    }

    if (style) {
      whereClause.style = style;
    }

    if (active === "true") {
      whereClause.active = true;
    } else if (active === "false") {
      whereClause.active = false;
    }

    const [potters, total] = await Promise.all([
      prisma.potter.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          products: true,
        },
      }),
      prisma.potter.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({
      potters,
      filters: { name, style, active },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching potters:", error);
    return NextResponse.json(
      { error: "Failed to fetch potters" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  await assertSellerAccess(user.id);

  const data = await req.json();

  try {
    const existingPotter = await prisma.potter.findUnique({
      where: { userId: user.id },
    });

    if (existingPotter) {
      return new NextResponse(JSON.stringify({ error: "Potter already exists" }), {
        status: 400,
      });
    }

    const newPotter = await prisma.potter.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return NextResponse.json(newPotter, { status: 201 });
  } catch (err) {
    console.error("Create potter failed:", err);
    return new NextResponse(JSON.stringify({ error: "Create failed" }), {
      status: 500,
    });
  }
}

/**
 * Optional Enhancements (KIV):
 * 
 * 1. Full-text search on localized names:
 *    - Implement flexible name search over `name` JSON field across all locales (e.g., "en", "ja", "zh").
 *    - Requires use of raw Prisma extensions or PostgreSQL-specific JSON path queries.
 *
 * 2. Filter by tags or categories:
 *    - Once added to the schema (e.g., potter tags or pottery category), support filtering by these fields.
 *
 * 3. Public vs Admin filtering:
 *    - Optionally restrict inactive potters from appearing in public views, while keeping them accessible to admin routes.
 * 
 * 4. Search by related fields:
 *    - Enable filtering or sorting based on fields within related `products`, such as product count or titles.
 * 
 * 5. Cursor-based pagination:
 *    - For scalability, replace skip/take pagination with cursor-based pagination using `createdAt` or `id` as a cursor.
 */