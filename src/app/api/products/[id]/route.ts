import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNum = Number(id);

  if (isNaN(idNum)) {
    return new NextResponse(JSON.stringify({ error: "Invalid product ID" }), {
      status: 400,
    });
  }

  const product = await prisma.product.findUnique({
    where: { id: idNum },
    include: { potter: true },
  });

  if (!product) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNum = Number(id);
  const data = await req.json();

  if (isNaN(idNum)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const updated = await prisma.product.update({
      where: { id: idNum },
      data,
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const idNum = Number(id);

  if (isNaN(idNum)) {
    return new NextResponse(JSON.stringify({ error: "Invalid product ID" }), {
      status: 400,
    });
  }

  try {
    await prisma.product.delete({
      where: { id: idNum },
    });
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(JSON.stringify({ error: "Delete failed" }), {
      status: 500,
    });
  }
}
