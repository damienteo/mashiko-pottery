import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSessionUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const user = await getServerSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getServerSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const existing = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.userSettings.update({
      where: { userId: user.id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
