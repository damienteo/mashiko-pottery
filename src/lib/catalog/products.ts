import { unstable_cache } from 'next/cache'
import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import type { Pagination, ProductFilters } from '@/types/common'
import type { Product } from '@/types/product'
import { isProductionBuild, withCatalogGuard } from './guard'
import { whereJsonLocaleContains } from './jsonLocale'
import { serializePotter, serializeProduct } from './serialize'

export type ProductListQuery = {
  page?: number
  limit?: number
  q?: string | null
  locale?: 'en' | 'ja' | 'zh' | null
  category?: string | null
  style?: string | null
  active?: boolean | null
  priceMin?: number | null
  priceMax?: number | null
  potterId?: number | null
}

export type ProductListResult = {
  products: Product[]
  filters: ProductFilters
  pagination: Pagination
}

function buildWhere(query: ProductListQuery): Prisma.ProductWhereInput {
  const textQuery = query.q || undefined
  const locale = query.locale ?? null

  const textFilter: Prisma.ProductWhereInput = textQuery
    ? locale
      ? {
          OR: [
            {
              title: {
                path: [locale],
                string_contains: textQuery,
                mode: 'insensitive',
              },
            },
            {
              description: {
                path: [locale],
                string_contains: textQuery,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {
          OR: [
            {
              title: {
                path: ['en'],
                string_contains: textQuery,
                mode: 'insensitive',
              },
            },
            {
              title: {
                path: ['ja'],
                string_contains: textQuery,
                mode: 'insensitive',
              },
            },
            {
              title: {
                path: ['zh'],
                string_contains: textQuery,
                mode: 'insensitive',
              },
            },
            {
              description: {
                path: ['en'],
                string_contains: textQuery,
                mode: 'insensitive',
              },
            },
            {
              description: {
                path: ['ja'],
                string_contains: textQuery,
                mode: 'insensitive',
              },
            },
            {
              description: {
                path: ['zh'],
                string_contains: textQuery,
                mode: 'insensitive',
              },
            },
          ],
        }
    : {}

  const priceFilter: Prisma.FloatFilter = {}
  if (typeof query.priceMin === 'number' && !Number.isNaN(query.priceMin)) {
    priceFilter.gte = query.priceMin
  }
  if (typeof query.priceMax === 'number' && !Number.isNaN(query.priceMax)) {
    priceFilter.lte = query.priceMax
  }

  return {
    ...(Object.keys(priceFilter).length ? { price: priceFilter } : {}),
    ...(query.category ? { category: query.category } : {}),
    ...textFilter,
    ...(query.active ? { stock: { gt: 0 }, isDraft: false } : {}),
    ...(typeof query.potterId === 'number' && !Number.isNaN(query.potterId)
      ? { potterId: query.potterId }
      : {}),
    ...(query.style
      ? { potter: whereJsonLocaleContains('style', query.style) }
      : {}),
  }
}

export function emptyProductList(query: ProductListQuery): ProductListResult {
  const page = Math.max(1, query.page ?? 1)
  const limit = Math.max(1, Math.min(100, query.limit ?? 10))
  return {
    products: [],
    filters: {
      name: query.q ?? null,
      q: query.q ?? null,
      locale: query.locale ?? null,
      category: query.category ?? null,
      style: query.style ?? null,
      active: query.active ?? null,
      priceMin: query.priceMin ?? null,
      priceMax: query.priceMax ?? null,
      potterId: query.potterId ?? null,
    },
    pagination: {
      page,
      limit,
      total: 0,
      totalPages: 0,
    },
  }
}

export async function listProducts(
  query: ProductListQuery = {}
): Promise<ProductListResult> {
  const page = Math.max(1, query.page ?? 1)
  const limit = Math.max(1, Math.min(100, query.limit ?? 10))
  const skip = (page - 1) * limit
  const whereClause = buildWhere(query)

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      where: whereClause,
      include: { potter: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where: whereClause }),
  ])

  return {
    products: rows.map((row) => {
      const product = serializeProduct(row)
      const potterRow = (row as { potter?: Record<string, unknown> }).potter
      return potterRow
        ? ({
            ...product,
            potter: serializePotter(potterRow),
          } as Product)
        : product
    }),
    filters: {
      name: query.q ?? null,
      q: query.q ?? null,
      locale: query.locale ?? null,
      category: query.category ?? null,
      style: query.style ?? null,
      active: query.active ?? null,
      priceMin:
        typeof query.priceMin === 'number' && !Number.isNaN(query.priceMin)
          ? query.priceMin
          : null,
      priceMax:
        typeof query.priceMax === 'number' && !Number.isNaN(query.priceMax)
          ? query.priceMax
          : null,
      potterId:
        typeof query.potterId === 'number' && !Number.isNaN(query.potterId)
          ? query.potterId
          : null,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  const row = await prisma.product.findUnique({
    where: { id },
    include: { potter: true },
  })
  if (!row) return null
  const product = serializeProduct(row)
  const potterRow = (row as { potter?: Record<string, unknown> }).potter
  return potterRow
    ? ({ ...product, potter: serializePotter(potterRow) } as Product)
    : product
}

export async function listProductIds(): Promise<number[]> {
  const rows = await prisma.product.findMany({
    select: { id: true },
    orderBy: { id: 'asc' },
  })
  return rows.map((row) => row.id)
}

export async function safeListProductIds(): Promise<number[]> {
  try {
    return await withCatalogGuard(() => listProductIds())
  } catch (error) {
    if (!isProductionBuild()) throw error
    return []
  }
}

export const getCachedProductList = unstable_cache(
  async (key: string) => {
    const query = JSON.parse(key) as ProductListQuery
    return listProducts(query)
  },
  ['public-product-list'],
  { revalidate: 60 }
)

export const getCachedProductById = unstable_cache(
  async (id: number) => getProductById(id),
  ['public-product-by-id'],
  { revalidate: 60 }
)
