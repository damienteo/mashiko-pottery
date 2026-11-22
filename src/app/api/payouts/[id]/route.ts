import { NextResponse, NextRequest } from 'next/server'
import { mockPayoutDetails } from '@/mocks/payouts'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const payout = mockPayoutDetails[id]
  if (!payout) {
    return NextResponse.json({ message: 'Payout not found' }, { status: 404 })
  }
  return NextResponse.json(payout)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const existing = mockPayoutDetails[id]
  if (!existing) {
    return NextResponse.json({ message: 'Payout not found' }, { status: 404 })
  }

  const updates = await request.json()
  const updated = { ...existing, ...updates }
  mockPayoutDetails[id] = updated

  return NextResponse.json(updated)
}
