import type { Locale, LocalizedString } from '@/types/i18n'
import type { Product } from '@/types/product'
import type { Potter } from '@/types/potter'

function asLocalized(value: unknown): LocalizedString {
  if (typeof value === 'string') {
    return { en: value, ja: value, zh: value }
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    return {
      en: typeof record.en === 'string' ? record.en : '',
      ja: typeof record.ja === 'string' ? record.ja : '',
      zh: typeof record.zh === 'string' ? record.zh : '',
    }
  }
  return { en: '', ja: '', zh: '' }
}

function asIso(value: unknown): string | undefined {
  if (!value) return undefined
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'string') return value
  return undefined
}

export function serializeProduct(row: Record<string, unknown>): Product {
  return {
    id: Number(row.id),
    potterId: Number(row.potterId),
    title: asLocalized(row.title),
    description: asLocalized(row.description),
    price: typeof row.price === 'number' ? row.price : 0,
    stock: typeof row.stock === 'number' ? row.stock : undefined,
    weight: typeof row.weight === 'number' ? row.weight : undefined,
    lengthCm: typeof row.lengthCm === 'number' ? row.lengthCm : undefined,
    widthCm: typeof row.widthCm === 'number' ? row.widthCm : undefined,
    heightCm: typeof row.heightCm === 'number' ? row.heightCm : undefined,
    leadTimeDays:
      typeof row.leadTimeDays === 'number' ? row.leadTimeDays : undefined,
    photos: Array.isArray(row.photos)
      ? row.photos.filter((item): item is string => typeof item === 'string')
      : [],
    mainImage: typeof row.mainImage === 'string' ? row.mainImage : undefined,
    tags: Array.isArray(row.tags)
      ? row.tags.filter((item): item is string => typeof item === 'string')
      : [],
    category: typeof row.category === 'string' ? row.category : undefined,
    createdAt: asIso(row.createdAt),
    updatedAt: asIso(row.updatedAt),
    isDraft: Boolean(row.isDraft),
  }
}

export function serializePotter(row: Record<string, unknown>): Potter {
  return {
    id: Number(row.id),
    userId: typeof row.userId === 'string' ? row.userId : undefined,
    name: asLocalized(row.name),
    bio: asLocalized(row.bio),
    style: row.style == null ? undefined : asLocalized(row.style),
    active: Boolean(row.active),
    imageUrl: typeof row.imageUrl === 'string' ? row.imageUrl : undefined,
    photos: Array.isArray(row.photos)
      ? row.photos.filter((item): item is string => typeof item === 'string')
      : [],
    createdAt: asIso(row.createdAt) ?? '',
    updatedAt: asIso(row.updatedAt) ?? '',
    isDraft: Boolean(row.isDraft),
  }
}

export function localizedText(
  value: LocalizedString | undefined,
  locale: string
): string {
  if (!value) return ''
  if (locale in value) {
    return value[locale as Locale] ?? ''
  }
  return value.ja || value.en || value.zh || ''
}
