import type { LocalizedString } from '@/types/i18n'

export interface SellerProfile {
  id: number
  name: LocalizedString
  bio: LocalizedString
  portfolio: LocalizedString
  image?: string
  style?: LocalizedString
  active?: boolean
  createdAt?: string
  updatedAt?: string
}
