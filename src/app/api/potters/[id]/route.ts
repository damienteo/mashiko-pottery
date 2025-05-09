import { NextResponse } from "next/server";
import { mockPotters } from "@/mocks/potters";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Must await params in Next.js 15+
  const { id } = await context.params;
  const idNum = Number(id);
  const potter = mockPotters.find((p) => p.id === idNum);

  if (!potter) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.json(potter);
}
