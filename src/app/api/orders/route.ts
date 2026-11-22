import { NextResponse } from 'next/server'
import { mockOrders, mockOrder } from '@/mocks/orders'

/**
 * GET /api/orders
 * Returns a list of mock orders
 */
export async function GET() {
  return NextResponse.json(mockOrders)
}

/**
 * POST /api/orders
 * Create a new order based on items in the request body
 */
export async function POST(req: Request) {
  const { items } = await req.json()
  const order = mockOrder(items)
  return NextResponse.json(order)
}
