export const PRODUCT_CATEGORIES = [
  'vase',
  'cup',
  'plate',
  'bowl',
  'bottle',
  'lidded',
  'teapot',
  'planter',
  'donabe',
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

type CategoryTranslator = {
  (key: string): string
  has: (key: string) => boolean
}

export function isProductCategory(value: string): value is ProductCategory {
  return (PRODUCT_CATEGORIES as readonly string[]).includes(value)
}

export function productCategoryLabel(
  t: CategoryTranslator,
  value?: string | null
): string {
  if (!value) return ''
  return t.has(value) ? t(value) : value
}
