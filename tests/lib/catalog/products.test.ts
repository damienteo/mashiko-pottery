const productFindMany = jest.fn()
const productCount = jest.fn()

jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: (...args: unknown[]) => productFindMany(...args),
      count: (...args: unknown[]) => productCount(...args),
    },
  },
}))

jest.mock('next/cache', () => ({
  unstable_cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}))

import { listProducts } from '@/lib/catalog/products'

function lastWhere() {
  return productFindMany.mock.calls[0][0] as {
    where: Record<string, unknown>
    orderBy: unknown
    skip: number
    take: number
  }
}

describe('listProducts query parity with the former GET /api/products handler', () => {
  beforeEach(() => {
    productFindMany.mockReset()
    productCount.mockReset()
    productFindMany.mockResolvedValue([])
    productCount.mockResolvedValue(0)
  })

  it('searches title and description for one locale', async () => {
    await listProducts({ q: 'bowl', locale: 'ja' })
    expect(lastWhere().where).toMatchObject({
      OR: [
        {
          title: {
            path: ['ja'],
            string_contains: 'bowl',
            mode: 'insensitive',
          },
        },
        {
          description: {
            path: ['ja'],
            string_contains: 'bowl',
            mode: 'insensitive',
          },
        },
      ],
    })
  })

  it('searches en, ja, and zh title and description when locale is omitted', async () => {
    await listProducts({ q: 'bowl' })
    const where = lastWhere().where as { OR: unknown[] }
    expect(where.OR).toHaveLength(6)
    expect(where.OR).toEqual(
      expect.arrayContaining([
        {
          title: { path: ['en'], string_contains: 'bowl', mode: 'insensitive' },
        },
        {
          title: { path: ['ja'], string_contains: 'bowl', mode: 'insensitive' },
        },
        {
          title: { path: ['zh'], string_contains: 'bowl', mode: 'insensitive' },
        },
        {
          description: {
            path: ['en'],
            string_contains: 'bowl',
            mode: 'insensitive',
          },
        },
        {
          description: {
            path: ['ja'],
            string_contains: 'bowl',
            mode: 'insensitive',
          },
        },
        {
          description: {
            path: ['zh'],
            string_contains: 'bowl',
            mode: 'insensitive',
          },
        },
      ])
    )
  })

  it('applies a price range', async () => {
    await listProducts({ priceMin: 10, priceMax: 50 })
    expect(lastWhere().where).toMatchObject({
      price: { gte: 10, lte: 50 },
    })
  })

  it('filters by category', async () => {
    await listProducts({ category: 'vase' })
    expect(lastWhere().where).toMatchObject({ category: 'vase' })
  })

  it('treats active as in-stock and not draft', async () => {
    await listProducts({ active: true })
    expect(lastWhere().where).toMatchObject({
      stock: { gt: 0 },
      isDraft: false,
    })
  })

  it('still lists drafts when active is not set', async () => {
    await listProducts({})
    expect(lastWhere().where).not.toHaveProperty('isDraft')
    expect(lastWhere().where).not.toHaveProperty('stock')
  })

  it('filters by potterId', async () => {
    await listProducts({ potterId: 7 })
    expect(lastWhere().where).toMatchObject({ potterId: 7 })
  })

  it('paginates and orders by createdAt desc', async () => {
    productCount.mockResolvedValue(23)
    productFindMany.mockResolvedValue([])
    const result = await listProducts({ page: 2, limit: 10 })
    const args = lastWhere()
    expect(args.skip).toBe(10)
    expect(args.take).toBe(10)
    expect(args.orderBy).toEqual({ createdAt: 'desc' })
    expect(productCount).toHaveBeenCalledWith({ where: args.where })
    expect(result.pagination).toEqual({
      page: 2,
      limit: 10,
      total: 23,
      totalPages: 3,
    })
  })
})
