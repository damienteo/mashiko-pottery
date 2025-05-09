import { NextResponse } from "next/server";
import { mockPotters } from "@/mocks/potters";

export async function GET() {
  await new Promise((r) => setTimeout(r, 300));
  return NextResponse.json(mockPotters);
}
