import { readFileSync } from 'fs'
import { join } from 'path'

const read = (relative: string) =>
  readFileSync(join(process.cwd(), relative), 'utf8')

describe('public potter style is localized and hidden when empty', () => {
  it('uses localizedText on the potter profile', () => {
    const page = read('src/app/[locale]/potters/[id]/page.tsx')
    expect(page).toMatch(/localizedText\(potter\.style/)
    expect(page).toMatch(/isNonEmptyText\(styleText\)/)
  })

  it('shows style on potter list cards only when present', () => {
    const grid = read('src/components/potters/PotterGrid.tsx')
    expect(grid).toMatch(/localizedText\(potter\.style/)
    expect(grid).toMatch(/styleText \?/)
  })

  it('shows style on product pages only when present', () => {
    const details = read('src/components/products/ProductDetails.tsx')
    expect(details).toMatch(/localizedText\(potter\?\.style/)
    expect(details).toMatch(/isNonEmptyText\(styleText\)/)
  })

  it('serializes public style through asLocalized rather than raw JSON', () => {
    const serialize = read('src/lib/catalog/serialize.ts')
    expect(serialize).toMatch(/asLocalized\(row\.style\)/)
    expect(serialize).toMatch(/JSON\.parse/)
  })
})

describe('admin and seller potter forms edit style in three locales', () => {
  it('validates en, ja, and zh style on PotterForm', () => {
    const form = read('src/components/forms/PotterForm.tsx')
    expect(form).toMatch(/register\(`style\.\$\{lang\}`\)/)
    expect(form).toMatch(/English style is required/)
    expect(form).toMatch(/Japanese style is required/)
    expect(form).toMatch(/Chinese style is required/)
  })

  it('edits seller style per locale', () => {
    const form = read(
      'src/app/[locale]/seller/profile/components/SellerProfileForm.tsx'
    )
    expect(form).toMatch(/register\(`style\.\$\{loc\}`/)
  })
})
