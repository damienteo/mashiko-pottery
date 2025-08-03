import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

import { prisma } from "@/lib/prisma";
import { assertAdminAccess } from "@/lib/auth/assertAdminAccess";
import { jsonErrorResponse } from "@/lib/errors/jsonErrorResponse";
import { validateProductExists } from "@/lib/validation/validateProductExists";
import { validatePotterExists } from "@/lib/validation/validatePotterExists";


export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await assertAdminAccess();

    const data = await req.json();
    const { title, description, price, stock, potterId } = data;

    if (!title || !description || !price || !stock || !potterId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const potter = await prisma.potter.findUnique({ where: { id: potterId } });
    if (!potter) {
      return NextResponse.json({ error: "Potter not found" }, { status: 404 });
    }

    const newProduct = await prisma.product.create({ data });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return jsonErrorResponse("Failed to create product", 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await assertAdminAccess();

    const data = await req.json();
    const { id, ...updates } = data;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await validateProductExists(id, prisma);
    await validatePotterExists(product.potterId, prisma);

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

    await assertAdminAccess();

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await validateProductExists(id, prisma);
    await validatePotterExists(product.potterId, prisma);

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return jsonErrorResponse("Failed to delete product", 500);
  }
}