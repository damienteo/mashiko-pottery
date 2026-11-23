const potterFindMany = jest.fn()
const potterCount = jest.fn()

jest.mock('@/lib/prisma', () => ({
  prisma: {
    potter: {
      findMany: (...args: unknown[]) => potterFindMany(...args),
      count: (...args: unknown[]) => potterCount(...args),
    },
  },
}))

jest.mock('next/cache', () => ({
  unstable_cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}))

import { listPotters } from '@/lib/catalog/potters'

function lastArgs() {
  return potterFindMany.mock.calls[0][0] as {
    where: Record<string, unknown>
    orderBy: unknown
    skip: number
    take: number
    include: unknown
  }
}

describe('listPotters query parity with the former GET /api/potters handler', () => {
  beforeEach(() => {
    potterFindMany.mockReset()
    potterCount.mockReset()
    potterFindMany.mockResolvedValue([])
    potterCount.mockResolvedValue(0)
  })

  it('searches name.en', async () => {
    await listPotters({ name: 'Kenji' })
    expect(lastArgs().where).toEqual({
      name: { path: ['en'], string_contains: 'Kenji' },
    })
  })

  it('filters by style and active', async () => {
    await listPotters({ style: 'mashiko', active: true })
    expect(lastArgs().where).toEqual({
      OR: [
        { style: { path: ['en'], string_contains: 'mashiko' } },
        { style: { path: ['ja'], string_contains: 'mashiko' } },
        { style: { path: ['zh'], string_contains: 'mashiko' } },
      ],
      active: true,
    })
  })

  it('does not hide inactive potters when active is omitted', async () => {
    await listPotters({})
    expect(lastArgs().where).toEqual({})
  })

  it('paginates, includes products, and orders by createdAt desc', async () => {
    potterCount.mockResolvedValue(5)
    const result = await listPotters({ page: 1, limit: 2 })
    const args = lastArgs()
    expect(args.skip).toBe(0)
    expect(args.take).toBe(2)
    expect(args.orderBy).toEqual({ createdAt: 'desc' })
    expect(args.include).toEqual({ products: true })
    expect(potterCount).toHaveBeenCalledWith({ where: args.where })
    expect(result.pagination).toEqual({
      page: 1,
      limit: 2,
      total: 5,
      totalPages: 3,
    })
  })
})
