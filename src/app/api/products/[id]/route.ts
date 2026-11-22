import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertSellerAccess } from "@/lib/auth/assertSellerAccess";
import { createClient } from "@/lib/supabase/server";
import { getProductById } from "@/lib/catalog/products";

async function findSellerProduct(userId: string, productId: number) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return { error: { message: "Product not found", status: 404 } };
  }

  const potter = await prisma.potter.findUnique({
    where: { id: product.potterId },
  });
  if (!potter || potter.userId !== userId) {
    return { error: { message: "Forbidden", status: 403 } };
  }

  return { product };
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const idNum = Number(id);

  if (isNaN(idNum)) {
    return new NextResponse(JSON.stringify({ error: "Invalid product ID" }), {
      status: 400,
    });
  }

  const product = await getProductById(idNum);

  if (!product) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const idNum = Number(id);
  const data = await req.json();

  if (isNaN(idNum)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await assertSellerAccess(user.id);

  const { error: findError } = await findSellerProduct(user.id, idNum);
  if (findError) {
    return NextResponse.json(
      { error: findError.message },
      { status: findError.status },
    );
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
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const idNum = Number(id);

  if (isNaN(idNum)) {
    return new NextResponse(JSON.stringify({ error: "Invalid product ID" }), {
      status: 400,
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await assertSellerAccess(user.id);

  const { error: findError } = await findSellerProduct(user.id, idNum);
  if (findError) {
    return NextResponse.json(
      { error: findError.message },
      { status: findError.status },
    );
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
