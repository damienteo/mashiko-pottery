const BUILD_QUERY_TIMEOUT_MS = 8000

export function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

export function isProductionBuild(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build'
}

/**
 * Catalog reads used while prerendering. Missing URL or a hung Preview
 * database must not fail `next build`. Runtime (no NEXT_PHASE) waits on
 * the real database as before.
 */
export async function withCatalogGuard<T>(run: () => Promise<T>): Promise<T> {
  if (!hasDatabaseUrl()) {
    throw new Error('DATABASE_URL is not set')
  }

  if (!isProductionBuild()) {
    return run()
  }

  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      run(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error('Database timed out during next build'))
        }, BUILD_QUERY_TIMEOUT_MS)
      }),
    ])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

/** Opt this render out of static generation instead of baking empty HTML. */
export async function deferCatalogToRequest(): Promise<void> {
  const { connection } = await import('next/server')
  await connection()
}

export async function catalogForStaticPage<T>(
  load: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await withCatalogGuard(load)
  } catch (error) {
    if (!isProductionBuild()) {
      throw error
    }
    console.warn(
      '[catalog] DB unavailable during next build; opting out of static generation',
      error
    )
    // Fallback is returned only after connection() resolves, which tells Next
    // to render this page per-request instead of writing empty static HTML.
    await deferCatalogToRequest()
    return fallback
  }
}
