import { readFileSync } from 'fs'
import { join } from 'path'

const page = readFileSync(
  join(process.cwd(), 'src/app/[locale]/products/[id]/page.tsx'),
  'utf8'
)

describe('Product detail missing id', () => {
  it('calls notFound instead of a hard-coded English message', () => {
    expect(page).not.toMatch(/Product not found/)
    expect(page).toMatch(/catalogForStaticPageWithBuildFallback/)
    expect(page).toMatch(/productBuildFallback/)
    expect(page).toMatch(/if \(!product\)[\s\S]*notFound\(\)/)
  })
})
