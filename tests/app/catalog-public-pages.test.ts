import { readFileSync } from 'fs'
import { join } from 'path'

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8')

describe('public products catalog', () => {
  const catalog = read('src/app/[locale]/products/ProductsCatalog.tsx')
  const page = read('src/app/[locale]/products/page.tsx')

  it('uses compact cards and a slim public toolbar', () => {
    expect(catalog).toMatch(/variant="compact"/)
    expect(catalog).toMatch(/showStyle=\{false\}/)
    expect(catalog).toMatch(/showActive=\{false\}/)
    expect(page).toMatch(/variant="compact"/)
    expect(page).toMatch(/namespace: 'meta.products'/)
    expect(page).toMatch(/openGraph:/)
  })

  it('translates fetch errors instead of hard-coding English', () => {
    expect(catalog).toMatch(/products\.fetchError/)
    expect(catalog).not.toMatch(/Failed to fetch products/)
  })
})

describe('potter works catalog', () => {
  const catalog = read(
    'src/app/[locale]/potters/[id]/PotterProductsCatalog.tsx'
  )
  const page = read('src/app/[locale]/potters/[id]/page.tsx')

  it('uses compact cards, slim toolbar, and works-by heading', () => {
    expect(catalog).toMatch(/variant="compact"/)
    expect(catalog).toMatch(/showStyle=\{false\}/)
    expect(catalog).toMatch(/showActive=\{false\}/)
    expect(catalog).toMatch(/worksBy/)
    expect(catalog).toMatch(/tProduct\('list.retry'\)/)
    expect(catalog).not.toMatch(/>Retry</)
    expect(page).toMatch(/variant="compact"/)
    expect(page).toMatch(/getCachedPotterById/)
    expect(page).toMatch(/trimAtBoundary/)
    expect(page).toMatch(/localizedText\(potter\.style/)
    expect(page).not.toMatch(/potter\.active/)
  })
})

describe('product detail public copy', () => {
  const details = read('src/components/products/ProductDetails.tsx')
  const page = read('src/app/[locale]/products/[id]/page.tsx')

  it('links the potter block and matches heading ids', () => {
    expect(details).toMatch(
      /href=\{`\/\$\{locale\}\/potters\/\$\{potter\.id\}`\}/
    )
    expect(details).toMatch(/id="specs-heading"/)
    expect(details).toMatch(/id="metadata-heading"/)
    expect(details).toMatch(/t\('soldOut'\)/)
    expect(details).toMatch(/productCategoryLabel/)
    expect(details).not.toMatch(/onAddToCart/)
    expect(page).toMatch(/trimAtBoundary/)
  })
})

describe('potters list heading', () => {
  const page = read('src/app/[locale]/potters/page.tsx')
  const grid = read('src/components/potters/PotterGrid.tsx')

  it('uses potters.title and clamps bios on cards', () => {
    expect(page).toMatch(/t\('potters\.title'\)/)
    expect(page).not.toMatch(/potterSpotlights\.title/)
    expect(page).toMatch(/openGraph:/)
    expect(grid).toMatch(/line-clamp-3/)
  })
})
