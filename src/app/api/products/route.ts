import { NextResponse } from "next/server";
import { mockProducts } from "@/mocks/products";

export async function GET() {
  // simulate network latency
  await new Promise((r) => setTimeout(r, 300));
  return NextResponse.json(mockProducts);
}
