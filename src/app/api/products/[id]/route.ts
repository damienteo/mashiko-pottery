import { NextResponse } from "next/server";
import { mockProducts } from "@/mocks/products";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Must await params in Next.js 15+
  const { id } = await context.params;
  const idNum = Number(id);
  const product = mockProducts.find((p) => p.id === idNum);

  if (!product) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.json(product);
}
