import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const routes = [
  {
    name: 'products list',
    loadingPath: 'src/app/[locale]/products/loading.tsx',
    skeletonPath: 'src/components/loading/ProductsListSkeleton.tsx',
    translation: "getTranslations('common')",
  },
  {
    name: 'product detail',
    loadingPath: 'src/app/[locale]/products/[id]/loading.tsx',
    skeletonPath: 'src/components/loading/ProductDetailSkeleton.tsx',
    translation: "getTranslations('product')",
  },
  {
    name: 'potters list',
    loadingPath: 'src/app/[locale]/potters/loading.tsx',
    skeletonPath: 'src/components/loading/PottersListSkeleton.tsx',
    translation: "getTranslations('potters')",
  },
  {
    name: 'potter detail',
    loadingPath: 'src/app/[locale]/potters/[id]/loading.tsx',
    skeletonPath: 'src/components/loading/PotterDetailSkeleton.tsx',
    translation: "getTranslations('potter')",
  },
] as const

describe('route loading skeletons', () => {
  it.each(routes)(
    '$name has a server loading.tsx wired to a skeleton',
    ({ loadingPath, skeletonPath, translation }) => {
      const root = process.cwd()
      expect(existsSync(join(root, loadingPath))).toBe(true)
      expect(existsSync(join(root, skeletonPath))).toBe(true)

      const loadingSrc = readFileSync(join(root, loadingPath), 'utf8')
      expect(loadingSrc).not.toMatch(/['"]use client['"]/)
      expect(loadingSrc).toMatch(translation)
      expect(loadingSrc).toMatch(/t\('loading'\)/)

      const skeletonSrc = readFileSync(join(root, skeletonPath), 'utf8')
      const blocksSrc = readFileSync(
        join(root, 'src/components/loading/skeletonBlocks.tsx'),
        'utf8'
      )
      expect(skeletonSrc).not.toMatch(/['"]use client['"]/)
      expect(skeletonSrc).toMatch(/LoadingStatus/)
      expect(blocksSrc).toMatch(/animate-pulse/)
      expect(blocksSrc).toMatch(/aspect-square/)
    }
  )

  it('exposes aria-busy and screen-reader loading text', () => {
    const status = readFileSync(
      join(process.cwd(), 'src/components/loading/LoadingStatus.tsx'),
      'utf8'
    )
    expect(status).toMatch(/aria-busy="true"/)
    expect(status).toMatch(/sr-only/)
  })
})
