import { NextResponse } from "next/server";
import { mockCart } from "@/mocks/cart";

export async function GET() {
  return NextResponse.json(mockCart);
}
