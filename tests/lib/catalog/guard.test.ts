import { catalogForStaticPage } from '@/lib/catalog/guard'

const connection = jest.fn(async () => undefined)

jest.mock('next/server', () => ({
  connection: () => connection(),
}))

describe('catalogForStaticPage', () => {
  const originalPhase = process.env.NEXT_PHASE
  const originalUrl = process.env.DATABASE_URL

  beforeEach(() => {
    connection.mockClear()
    process.env.DATABASE_URL = 'postgres://example'
  })

  afterEach(() => {
    process.env.NEXT_PHASE = originalPhase
    process.env.DATABASE_URL = originalUrl
  })

  it('returns fallback during next build when the catalog load fails', async () => {
    process.env.NEXT_PHASE = 'phase-production-build'
    const value = await catalogForStaticPage(async () => {
      throw new Error('db down')
    }, 'fallback')
    expect(value).toBe('fallback')
    expect(connection).toHaveBeenCalled()
  })

  it('rethrows at runtime so ISR can keep the last good page', async () => {
    delete process.env.NEXT_PHASE
    await expect(
      catalogForStaticPage(async () => {
        throw new Error('db down')
      }, 'fallback')
    ).rejects.toThrow('db down')
    expect(connection).not.toHaveBeenCalled()
  })
})
