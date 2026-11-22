import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const supabase = await createClient()
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getUser()

  if (sessionError || !sessionData.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = sessionData.user.id

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user, { status: 200 })
  } catch (err) {
    console.error('Error fetching user:', err)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}
