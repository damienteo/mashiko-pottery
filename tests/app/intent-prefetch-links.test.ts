import { readFileSync } from 'fs'
import { join } from 'path'

const files = [
  'src/components/layout/Navbar.tsx',
  'src/components/layout/Footer.tsx',
  'src/components/home/Hero.tsx',
  'src/components/home/FeaturedCollections.tsx',
  'src/components/products/ProductCard.tsx',
  'src/components/potters/PotterGrid.tsx',
]

describe('intent prefetch on catalog links', () => {
  it.each(files)('%s uses IntentLink instead of viewport prefetch', (rel) => {
    const src = readFileSync(join(process.cwd(), rel), 'utf8')
    expect(src).toMatch(/IntentLink/)
    expect(src).not.toMatch(/prefetch=\{false\}/)
  })

  it('navbar catalog hrefs include the active locale prefix', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/components/layout/Navbar.tsx'),
      'utf8'
    )
    expect(src).toMatch(/href=\{`\/\$\{locale\}\/products`\}/)
    expect(src).toMatch(/href=\{`\/\$\{locale\}\/potters`\}/)
  })
})
