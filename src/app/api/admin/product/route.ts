import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

import { prisma } from "@/lib/prisma";
import { finaliseDraftImages } from "@/lib/cloudinary/finaliseDraftImages";
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

    // Finalise draft images before creating the product
    const { imageUrl, photos } = await finaliseDraftImages({
      imageUrl: data.mainImage,
      photos: data.photos,
      folderType: "products",
      finalId: "temp", // Temporarily use "temp" since product ID doesn't exist yet
    });
    data.mainImage = imageUrl;
    data.photos = photos;

    const newProduct = await prisma.product.create({ data });

    // Finalise image paths again using the actual product ID
    const finalImages = await finaliseDraftImages({
      imageUrl: data.mainImage,
      photos: data.photos,
      folderType: "products",
      finalId: String(newProduct.id),
    });

    const imageChanged = finalImages.imageUrl && finalImages.imageUrl !== data.mainImage;
    const photosChanged =
      finalImages.photos &&
      JSON.stringify(finalImages.photos) !== JSON.stringify(data.photos);

    if (imageChanged || photosChanged) {
      await prisma.product.update({
        where: { id: newProduct.id },
        data: {
          ...(imageChanged && { mainImage: finalImages.imageUrl }),
          ...(photosChanged && { photos: finalImages.photos }),
        },
      });
    }

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

    // Finalise draft images before updating the product
    const finalImages = await finaliseDraftImages({
      imageUrl: updates.mainImage,
      photos: updates.photos,
      folderType: "products",
      finalId: String(id),
    });

    const imageChanged = finalImages.imageUrl && finalImages.imageUrl !== updates.mainImage;
    const photosChanged =
      finalImages.photos &&
      JSON.stringify(finalImages.photos) !== JSON.stringify(updates.photos);

    const updatePayload: typeof updates = {
      ...updates,
      ...(imageChanged && { mainImage: finalImages.imageUrl }),
      ...(photosChanged && { photos: finalImages.photos }),
    };

    let updatedProduct = null;
    if (imageChanged || photosChanged) {
      updatedProduct = await prisma.product.update({
        where: { id },
        data: updatePayload,
      });
    }

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