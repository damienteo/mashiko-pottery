import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { finaliseDraftImages } from "@/lib/cloudinary/finaliseDraftImages";
import { assertAdminAccess } from "@/lib/auth/assertAdminAccess";
import { jsonErrorResponse } from "@/lib/errors/jsonErrorResponse";
import { validateProductExists } from "@/lib/validation/validateProductExists";
import { validatePotterExists } from "@/lib/validation/validatePotterExists";


export async function POST(req: NextRequest) {
  try {
    await assertAdminAccess();

    const data = await req.json();
    const { title, description, price, stock, potterId, isDraft } = data;

    // potterId is always required
    if (potterId == null) {
      return NextResponse.json({ error: "Potter ID is required" }, { status: 400 });
    }

    // If not draft, enforce required fields. In draft mode, they can be empty.
    if (!isDraft) {
      if (!title || !description) {
        return NextResponse.json({ error: "Title and description are required when not a draft" }, { status: 400 });
      }
      // Allow 0 for price/stock; only reject undefined/null
      if (price == null || stock == null) {
        return NextResponse.json({ error: "Price and stock are required when not a draft" }, { status: 400 });
      }
      // Optional: basic sanity checks (non-negative numbers)
      if (typeof price !== "number" || typeof stock !== "number" || price < 0 || stock < 0) {
        return NextResponse.json({ error: "Price and stock must be non-negative numbers" }, { status: 400 });
      }
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
    if (error instanceof Response) {
      // assertAdminAccess throws NextResponse (which extends Response)
      return error as unknown as NextResponse;
    }
    console.error("Error creating product:", error);
    return jsonErrorResponse("Failed to create product", 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await assertAdminAccess();

    const data = await req.json();
    const { id, ...updates } = data;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await validateProductExists(id, prisma);
    if (updates.potterId != null) {
      await validatePotterExists(updates.potterId, prisma);
    } else {
      await validatePotterExists(product.potterId, prisma);
    }

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

    // If no fields were provided to update, return the current product
    if (!updatePayload || Object.keys(updatePayload).length === 0) {
      return NextResponse.json(product);
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updatePayload,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error instanceof Response) {
      // assertAdminAccess throws NextResponse (which extends Response)
      return error as unknown as NextResponse;
    }
    console.error("Error updating product:", error);
    return jsonErrorResponse("Failed to update product", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
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
    if (error instanceof Response) {
      // assertAdminAccess throws NextResponse (which extends Response)
      return error as unknown as NextResponse;
    }
    console.error("Error deleting product:", error);
    return jsonErrorResponse("Failed to delete product", 500);
  }
}