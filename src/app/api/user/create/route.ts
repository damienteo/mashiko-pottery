import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getUser();

  if (sessionError || !sessionData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = sessionData.user.id;
  const email = sessionData.user.email;

  try {
    // Ensure the user does not already exist in the database
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Parse request body for additional details
    const data = await req.json();

    // Create new user in the User table using Supabase UUID
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        email: email ?? "",
        ...data,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error("Error creating user:", err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
