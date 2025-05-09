import { NextResponse } from "next/server";
import { mockProducts } from "@/mocks/products";

export async function GET({ params }: { params: { id: string } }) {
  const product = mockProducts.find((p) => p.id === Number(params.id));
  if (!product) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.json(product);
}
