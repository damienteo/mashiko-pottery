import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const name = searchParams.get("name");
    const style = searchParams.get("style");
    const active = searchParams.get("active");

    const whereClause: Record<string, unknown> = {};

    if (name) {
      whereClause.name = {
        path: ["en"],
        string_contains: name,
        string_mode: "insensitive",
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
        totalPages: Math.ceil(total / limit),
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
  try {
    const data = await req.json();
    const { userId, name, bio } = data;

    if (!userId || !name || !bio) {
      return NextResponse.json(
        { error: "Missing required fields: userId, name, or bio" },
        { status: 400 }
      );
    }

    const potter = await prisma.potter.create({
      data,
    });

    return NextResponse.json(potter, { status: 201 });
  } catch (error) {
    console.error("Error creating potter:", error);
    return NextResponse.json(
      { error: "Failed to create potter" },
      { status: 500 }
    );
  }
}
