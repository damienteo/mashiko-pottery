import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { assertAdminAccess } from "@/lib/auth/assertAdminAccess";
import { validateUserExists } from "@/lib/validation/validateUserExists";
import { updateUserRole } from "@/lib/user/updateUserRole";
import { finalizeDraftImages } from "@/lib/cloudinary/finaliseDraftImages";


export async function POST(req: Request) {
  await assertAdminAccess();

  const { userId, name, bio, style, imageUrl, photos } = await req.json();

  await validateUserExists(userId);

  const existingPotter = await prisma.potter.findUnique({ where: { userId } });
  if (existingPotter) {
    return NextResponse.json({ error: "User is already a potter" }, { status: 400 });
  }

  const potter = await prisma.potter.create({
    data: { userId, name, bio, style, imageUrl },
  });

  // Finalize image if needed
  const finalized = await finalizeDraftImages({
    imageUrl,
    photos,
    folderType: "potters",
    finalId: potter.id.toString(),
  });

  if (finalized.imageUrl !== imageUrl) {
    await prisma.potter.update({
      where: { id: potter.id },
      data: { imageUrl: finalized.imageUrl },
    });
  }

  if (finalized.photos && JSON.stringify(finalized.photos) !== JSON.stringify(photos)) {
    await prisma.potter.update({
      where: { id: potter.id },
      data: { photos: finalized.photos },
    });
  }

  await updateUserRole(userId, "SELLER");

  return NextResponse.json({ potter }, { status: 201 });
}

export async function PATCH(req: Request) {
  await assertAdminAccess();

  const { userId, name, bio, style, imageUrl, photos, active } = await req.json();

  const potter = await prisma.potter.findUnique({ where: { userId } });
  if (!potter) {
    return NextResponse.json({ error: "Potter not found" }, { status: 404 });
  }

  const updatedPotter = await prisma.potter.update({
    where: { userId },
    data: { name, bio, style, imageUrl, active },
  });

  // Finalize image if needed
  const finalized = await finalizeDraftImages({
    imageUrl,
    photos,
    folderType: "potters",
    finalId: potter.id.toString(),
  });

  if (finalized.imageUrl !== imageUrl) {
    await prisma.potter.update({
      where: { id: potter.id },
      data: { imageUrl: finalized.imageUrl },
    });
  }

  if (finalized.photos && JSON.stringify(finalized.photos) !== JSON.stringify(photos)) {
    await prisma.potter.update({
      where: { id: potter.id },
      data: { photos: finalized.photos },
    });
  }

  return NextResponse.json({ potter: updatedPotter }, { status: 200 });
}

export async function DELETE(req: Request) {
  await assertAdminAccess();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const potter = await prisma.potter.findUnique({ where: { userId } });
  if (!potter) {
    return NextResponse.json({ error: "Potter not found" }, { status: 404 });
  }

  await prisma.potter.delete({ where: { userId } });

  await updateUserRole(userId, "CUSTOMER");

  return NextResponse.json({ message: "Potter deleted and user role reverted." }, { status: 200 });
}