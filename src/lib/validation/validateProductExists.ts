import { PrismaClient } from '@/generated/prisma/client'
import { NextResponse } from 'next/server'

export const validateProductExists = async (
  productId: number,
  prisma: PrismaClient
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw new NextResponse('Product not found', { status: 404 })
  }

  return product
}
