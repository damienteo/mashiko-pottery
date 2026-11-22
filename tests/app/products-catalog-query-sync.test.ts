import { readFileSync } from 'fs'
import { join } from 'path'

const catalog = readFileSync(
  join(process.cwd(), 'src/app/[locale]/products/ProductsCatalog.tsx'),
  'utf8'
).replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')

describe('ProductsCatalog query sync', () => {
  it('re-syncs from the URL on popstate and clears back to initialData', () => {
    expect(catalog).toMatch(/syncFromLocation/)
    expect(catalog).toMatch(/addEventListener\(\s*'popstate'/)
    expect(catalog).toMatch(/setData\(initialData\)/)
    expect(catalog).toMatch(/!parsed\.hasQuery/)
  })
})
