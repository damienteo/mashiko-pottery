import type { Locale, LocalizedString } from '@/types/i18n'
import type { Product } from '@/types/product'
import type { Potter } from '@/types/potter'

const LOCALES: Locale[] = ['en', 'ja', 'zh']

function parseJsonValue(value: unknown): unknown {
  if (typeof value !== 'string') return value
  const trimmed = value.trim()
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) return value
  try {
    return JSON.parse(trimmed) as unknown
  } catch {
    return value
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function localeField(value: unknown, key: Locale): string {
  const parsed = parseJsonValue(value)
  if (typeof parsed === 'string') return parsed
  if (!isRecord(parsed)) return ''
  const inner = parseJsonValue(parsed[key])
  if (typeof inner === 'string' && inner.trim()) return inner
  for (const fallback of LOCALES) {
    const nested = parseJsonValue(parsed[fallback])
    if (typeof nested === 'string' && nested.trim()) return nested
  }
  return ''
}

/**
 * Coerce Prisma JSON (object, JSON string, or leftover plain text) into
 * `{ en, ja, zh }`. pg/jsonb and TEXT→jsonb migrations can leave a
 * stringified object; unwrap that so UI never renders raw JSON.
 */
export function asLocalized(value: unknown): LocalizedString {
  const parsed = parseJsonValue(value)
  if (typeof parsed === 'string') {
    return { en: parsed, ja: parsed, zh: parsed }
  }
  if (!isRecord(parsed)) {
    return { en: '', ja: '', zh: '' }
  }
  return {
    en: localeField(parsed.en ?? parsed, 'en'),
    ja: localeField(parsed.ja ?? parsed, 'ja'),
    zh: localeField(parsed.zh ?? parsed, 'zh'),
  }
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
  value: LocalizedString | string | undefined,
  locale: string
): string {
  const loc = asLocalized(value)
  const requested = locale in loc ? loc[locale as Locale] : ''
  if (requested.trim()) return requested
  return loc.ja || loc.en || loc.zh || ''
}
