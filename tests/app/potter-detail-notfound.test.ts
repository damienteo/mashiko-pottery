import { readFileSync } from 'fs'
import { join } from 'path'

const page = readFileSync(
  join(process.cwd(), 'src/app/[locale]/potters/[id]/page.tsx'),
  'utf8'
)

describe('Potter detail missing id', () => {
  it('calls notFound for invalid or missing potters after catalog guard', () => {
    expect(page).toMatch(/Number\.isNaN\(idNum\)[\s\S]*notFound\(\)/)
    expect(page).toMatch(/catalogForStaticPageWithBuildFallback/)
    expect(page).toMatch(/potterBuildFallback/)
    expect(page).toMatch(/if \(!potter\)[\s\S]*notFound\(\)/)
  })
})
