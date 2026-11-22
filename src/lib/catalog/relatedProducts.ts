import type { Product } from '@/types/product'

function unitRand(seed: string): number {
  const h = Array.from(seed).reduce(
    (acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0,
    0
  )
  return ((h >>> 0) % 10000) / 10000
}

/** Stable daily shuffle of a potter's other products. */
export function pickRelatedProducts(
  products: Product[],
  currentId: number,
  limit = 8,
  dayStamp = new Date().toISOString().slice(0, 10)
): Product[] {
  const base = products.filter((p) => p.id !== currentId)
  const seedStr = `${currentId}-${dayStamp}`
  return base
    .map((item, idx) => ({ item, rand: unitRand(seedStr + idx) }))
    .sort((a, b) => a.rand - b.rand)
    .map(({ item }) => item)
    .slice(0, limit)
}
