import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

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

  //TODO:
  // const user = await getServerSessionUser();

  // const potter = await prisma.potter.findUnique({
  //   where: { id: idNum },
  // });

  // if (
  //   !user ||
  //   (!["ADMIN", "OPERATIONS"].includes(user.role) && user.id !== potter?.userId)
  // ) {
  //   return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
  //     status: 403,
  //   });
  // }

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

// export async function DELETE(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await context.params;
//   const idNum = Number(id);

//   if (isNaN(idNum)) {
//     return new NextResponse(JSON.stringify({ error: "Invalid potter ID" }), {
//       status: 400,
//     });
//   }

//   const user = await getServerSessionUser();

//   if (!user || !["ADMIN", "OPERATIONS"].includes(user.role)) {
//     return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
//       status: 403,
//     });
//   }

//   try {
//     await prisma.potter.delete({
//       where: { id: idNum },
//     });

//     return new NextResponse(null, { status: 204 });
//   } catch {
//     return new NextResponse(JSON.stringify({ error: "Delete failed" }), {
//       status: 500,
//     });
//   }
// }
