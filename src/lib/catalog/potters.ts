import { unstable_cache } from 'next/cache'
import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import type { Pagination, PotterFilters } from '@/types/common'
import type { Potter } from '@/types/potter'
import { isProductionBuild, withCatalogGuard } from './guard'
import { serializePotter, serializeProduct } from './serialize'

export type PotterListQuery = {
  page?: number
  limit?: number
  name?: string | null
  style?: string | null
  active?: boolean | null
  includeProducts?: boolean
}

export type PotterListResult = {
  potters: Potter[]
  filters: PotterFilters
  pagination: Pagination
}

function buildWhere(query: PotterListQuery): Prisma.PotterWhereInput {
  const whereClause: Prisma.PotterWhereInput = {}
  if (query.name) {
    whereClause.name = {
      path: ['en'],
      string_contains: query.name,
    }
  }
  if (query.style) {
    whereClause.style = query.style
  }
  if (query.active === true) {
    whereClause.active = true
  } else if (query.active === false) {
    whereClause.active = false
  }
  return whereClause
}

export function emptyPotterList(query: PotterListQuery): PotterListResult {
  const page = Math.max(1, query.page ?? 1)
  const limit = Math.min(Math.max(1, query.limit ?? 10), 100)
  return {
    potters: [],
    filters: {
      name: query.name ?? null,
      style: query.style ?? null,
      active: query.active ?? null,
    },
    pagination: {
      page,
      limit,
      total: 0,
      totalPages: 1,
    },
  }
}

export async function listPotters(
  query: PotterListQuery = {}
): Promise<PotterListResult> {
  const page = Math.max(1, query.page ?? 1)
  const limit = Math.min(Math.max(1, query.limit ?? 10), 100)
  const skip = (page - 1) * limit
  const whereClause = buildWhere(query)

  const [rows, total] = await Promise.all([
    prisma.potter.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: query.includeProducts === false ? undefined : { products: true },
    }),
    prisma.potter.count({ where: whereClause }),
  ])

  return {
    potters: rows.map((row) => {
      const potter = serializePotter(row)
      const productRows = (row as { products?: Record<string, unknown>[] })
        .products
      if (!productRows) return potter
      return {
        ...potter,
        products: productRows.map((product) => serializeProduct(product)),
      } as Potter
    }),
    filters: {
      name: query.name ?? null,
      style: query.style ?? null,
      active: query.active ?? null,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  }
}

export async function getPotterById(id: number): Promise<Potter | null> {
  const row = await prisma.potter.findUnique({
    where: { id },
    include: { products: true },
  })
  if (!row) return null
  const potter = serializePotter(row)
  const productRows = (row as { products?: Record<string, unknown>[] }).products
  if (!productRows) return potter
  return {
    ...potter,
    products: productRows.map((product) => serializeProduct(product)),
  } as Potter
}

export async function listPotterIds(): Promise<number[]> {
  const rows = await prisma.potter.findMany({
    select: { id: true },
    orderBy: { id: 'asc' },
  })
  return rows.map((row) => row.id)
}

export async function safeListPotters(
  query: PotterListQuery = {}
): Promise<PotterListResult> {
  try {
    return await withCatalogGuard(() => listPotters(query))
  } catch (error) {
    if (!isProductionBuild()) throw error
    return emptyPotterList(query)
  }
}

export async function safeGetPotterById(id: number): Promise<Potter | null> {
  try {
    return await withCatalogGuard(() => getPotterById(id))
  } catch (error) {
    if (!isProductionBuild()) throw error
    return null
  }
}

export async function safeListPotterIds(): Promise<number[]> {
  try {
    return await withCatalogGuard(() => listPotterIds())
  } catch (error) {
    if (!isProductionBuild()) throw error
    return []
  }
}

export const getCachedPotterList = unstable_cache(
  async (key: string) => {
    const query = JSON.parse(key) as PotterListQuery
    return listPotters(query)
  },
  ['public-potter-list'],
  { revalidate: 60 }
)

export const getCachedPotterById = unstable_cache(
  async (id: number) => getPotterById(id),
  ['public-potter-by-id'],
  { revalidate: 60 }
)

export async function safeCachedPotterList(
  query: PotterListQuery = {}
): Promise<PotterListResult> {
  try {
    return await withCatalogGuard(() =>
      getCachedPotterList(JSON.stringify(query))
    )
  } catch (error) {
    if (!isProductionBuild()) throw error
    return emptyPotterList(query)
  }
}

export async function safeCachedPotterById(id: number): Promise<Potter | null> {
  try {
    return await withCatalogGuard(() => getCachedPotterById(id))
  } catch (error) {
    if (!isProductionBuild()) throw error
    return null
  }
}
