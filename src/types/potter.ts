// src/types/potter.ts

import type { LocalizedString } from '@/types/i18n'

export interface Potter {
  id: number
  userId?: string
  name: LocalizedString
  bio: LocalizedString
  style?: string
  active: boolean
  imageUrl?: string
  photos: string[]
  createdAt: string
  updatedAt: string
  isDraft: boolean
}
