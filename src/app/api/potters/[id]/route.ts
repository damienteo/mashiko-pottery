import { createClient } from "@/lib/supabase/server";
import { assertSellerAccess } from "@/lib/auth/assertSellerAccess";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNum = Number(id);

  if (isNaN(idNum)) {
    return new NextResponse(JSON.stringify({ error: "Invalid potter ID" }), {
      status: 400,
    });
  }

  const potter = await prisma.potter.findUnique({
    where: { id: idNum },
    include: { products: true },
  });

  if (!potter) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.json(potter);
}

export async function POST(req: Request) {
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

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: "string | null | undefined" }> }
) {
  const { id } = await context.params;
  const idNum = Number(id);

  if (isNaN(idNum)) {
    return new NextResponse(JSON.stringify({ error: "Invalid potter ID" }), {
      status: 400,
    });
  }

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

  const potter = await prisma.potter.findUnique({
    where: { id: idNum },
  });

  if (!potter || potter.userId !== user.id) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  const data = await req.json();

  try {
    const updatedPotter = await prisma.potter.update({
      where: { id: idNum },
      data,
    });

    return NextResponse.json(updatedPotter);
  } catch {
    return new NextResponse(JSON.stringify({ error: "Update failed" }), {
      status: 500,
    });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNum = Number(id);

  if (isNaN(idNum)) {
    return new NextResponse(JSON.stringify({ error: "Invalid potter ID" }), {
      status: 400,
    });
  }

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

  const potter = await prisma.potter.findUnique({
    where: { id: idNum },
  });

  if (!potter || potter.userId !== user.id) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  try {
    await prisma.potter.delete({
      where: { id: idNum },
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(JSON.stringify({ error: "Delete failed" }), {
      status: 500,
    });
  }
}
