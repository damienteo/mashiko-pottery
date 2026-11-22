import { readFileSync } from 'fs'
import { join } from 'path'

const catalog = readFileSync(
  join(process.cwd(), 'src/app/[locale]/products/ProductsCatalog.tsx'),
  'utf8'
).replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')

describe('ProductsCatalog first paint', () => {
  it('does not hide the catalog behind a null Suspense fallback', () => {
    expect(catalog).not.toMatch(/useSearchParams/)
    expect(catalog).not.toMatch(/<Suspense/)
    expect(catalog).not.toMatch(/\bSuspense\b/)
  })
})
