import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'
import { buildPgAdapterConfig } from '@/lib/db/sslConfig'

const globalWithPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
}

function createPrismaClient() {
  const adapter = new PrismaPg(
    buildPgAdapterConfig(process.env.DATABASE_URL, process.env.DATABASE_CA_CERT)
  )
  return new PrismaClient({
    adapter,
    log: ['query', 'warn', 'error'],
  })
}

export const prisma = globalWithPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalWithPrisma.prisma = prisma
}
