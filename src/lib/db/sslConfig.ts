import type { PoolConfig } from 'pg'

/** Query params that make `pg` override the explicit `ssl` PoolConfig object. */
export const SSL_CONNECTION_QUERY_PARAMS = [
  'sslmode',
  'uselibpqcompat',
  'sslrootcert',
  'sslcert',
  'sslkey',
  'sslcrl',
] as const

export type PgAdapterConnectionConfig = Pick<PoolConfig, 'connectionString'> &
  Partial<Pick<PoolConfig, 'ssl'>>

/** Turn literal `\\n` sequences from env vars into real newlines in PEM text. */
export function normalizeCaCert(raw: string): string {
  return raw.replace(/\\n/g, '\n')
}

/** Remove SSL-related query params so PoolConfig.ssl is not overridden by the URL. */
export function stripSslQueryParams(connectionString: string): string {
  const url = new URL(connectionString)
  for (const param of SSL_CONNECTION_QUERY_PARAMS) {
    url.searchParams.delete(param)
  }
  return url.toString()
}

export function buildPgAdapterConfig(
  connectionString: string | undefined,
  caCert: string | undefined
): PgAdapterConnectionConfig {
  if (!connectionString) {
    return { connectionString: connectionString ?? '' }
  }

  const trimmedCa = caCert?.trim()
  if (!trimmedCa) {
    return { connectionString }
  }

  return {
    connectionString: stripSslQueryParams(connectionString),
    ssl: {
      ca: normalizeCaCert(trimmedCa),
      rejectUnauthorized: true,
    },
  }
}
