'use client'

import { useEffect } from 'react'
import { logViewItem } from '@/lib/analytics'

export default function ViewItemBeacon({
  id,
  title,
  price,
}: {
  id: number
  title: string
  price: number
}) {
  useEffect(() => {
    logViewItem({ id, title, price })
  }, [id, title, price])
  return null
}
