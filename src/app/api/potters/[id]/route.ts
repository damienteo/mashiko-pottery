import { NextResponse } from "next/server";
import { mockPotters } from "@/mocks/potters";

export async function GET({ params }: { params: { id: string } }) {
  const potter = mockPotters.find((p) => p.id === Number(params.id));
  if (!potter) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.json(potter);
}
