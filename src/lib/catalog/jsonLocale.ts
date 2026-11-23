import { Prisma } from '@/generated/prisma/client'
import type { Locale } from '@/types/i18n'

const LOCALES: Locale[] = ['en', 'ja', 'zh']

export function whereJsonLocaleContains(
  field: 'style',
  value: string
): Prisma.PotterWhereInput {
  return {
    OR: LOCALES.map((locale) => ({
      [field]: {
        path: [locale],
        string_contains: value,
      },
    })),
  }
}
