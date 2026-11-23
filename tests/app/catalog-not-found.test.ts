import { readFileSync } from 'fs'
import { join } from 'path'

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8')

describe('in-page catalog not-found', () => {
  it('keeps potter notFound() plus a locale layout not-found view', () => {
    const page = read('src/app/[locale]/potters/[id]/page.tsx')
    const view = read('src/app/[locale]/potters/[id]/not-found.tsx')
    expect(page).toMatch(/if \(!potter\)[\s\S]*notFound\(\)/)
    expect(page).toMatch(/catalogForStaticPageWithBuildFallback/)
    expect(view).toMatch(/potter\.notFound/)
    expect(view).toMatch(/\$\{locale\}\/potters/)
    expect(view).toMatch(/generateMetadata/)
  })

  it('keeps product notFound() plus a locale layout not-found view', () => {
    const page = read('src/app/[locale]/products/[id]/page.tsx')
    const view = read('src/app/[locale]/products/[id]/not-found.tsx')
    expect(page).toMatch(/if \(!product\)[\s\S]*notFound\(\)/)
    expect(page).toMatch(/catalogForStaticPageWithBuildFallback/)
    expect(page).not.toMatch(/Product not found/)
    expect(view).toMatch(/product\.notFound/)
    expect(view).toMatch(/\$\{locale\}\/products/)
    expect(view).toMatch(/generateMetadata/)
  })
})
