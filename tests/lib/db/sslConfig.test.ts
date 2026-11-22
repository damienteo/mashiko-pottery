import {
  buildPgAdapterConfig,
  normalizeCaCert,
  stripSslQueryParams,
} from '@/lib/db/sslConfig'

describe('normalizeCaCert', () => {
  it('converts literal \\n escapes to newlines', () => {
    expect(
      normalizeCaCert('-----BEGIN CERTIFICATE-----\\nMIIB\\n-----END')
    ).toBe('-----BEGIN CERTIFICATE-----\nMIIB\n-----END')
  })

  it('leaves PEM that already contains newlines unchanged', () => {
    const pem = '-----BEGIN CERTIFICATE-----\nabc\n-----END'
    expect(normalizeCaCert(pem)).toBe(pem)
  })
})

describe('stripSslQueryParams', () => {
  const base =
    'postgresql://user:pass@db.example.com:5432/postgres?pool_timeout=10'

  it('removes ssl-related params and keeps the rest', () => {
    const url = `${base}&sslmode=require&uselibpqcompat=true&sslrootcert=/tmp/ca.pem`
    expect(stripSslQueryParams(url)).toBe(
      'postgresql://user:pass@db.example.com:5432/postgres?pool_timeout=10'
    )
  })

  it('removes sslcert, sslkey, and sslcrl', () => {
    const url = `${base}&sslmode=verify-full&sslcert=a&sslkey=b&sslcrl=c`
    expect(stripSslQueryParams(url)).toBe(
      'postgresql://user:pass@db.example.com:5432/postgres?pool_timeout=10'
    )
  })

  it('returns the same string when no ssl params are present', () => {
    expect(stripSslQueryParams(base)).toBe(base)
  })
})

describe('buildPgAdapterConfig', () => {
  const connectionString =
    'postgresql://user:pass@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require&uselibpqcompat=true'

  it('passes DATABASE_URL unchanged when no CA cert is set', () => {
    expect(buildPgAdapterConfig(connectionString, undefined)).toEqual({
      connectionString,
    })
    expect(buildPgAdapterConfig(connectionString, '   ')).toEqual({
      connectionString,
    })
  })

  it('strips ssl query params and attaches verified ssl when CA is set', () => {
    const ca = '-----BEGIN CERTIFICATE-----\\nROOT\\n-----END CERTIFICATE-----'
    const result = buildPgAdapterConfig(connectionString, ca)

    expect(result.connectionString).toBe(
      'postgresql://user:pass@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
    )
    expect(result.ssl).toEqual({
      ca: '-----BEGIN CERTIFICATE-----\nROOT\n-----END CERTIFICATE-----',
      rejectUnauthorized: true,
    })
  })

  it('handles missing connection string like the previous prisma setup', () => {
    expect(buildPgAdapterConfig(undefined, 'cert')).toEqual({
      connectionString: '',
    })
    expect(buildPgAdapterConfig(undefined, undefined)).toEqual({
      connectionString: '',
    })
  })
})
