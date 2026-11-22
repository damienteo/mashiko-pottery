import { readFileSync } from 'fs'
import { join } from 'path'

const page = readFileSync(
  join(process.cwd(), 'src/app/[locale]/page.tsx'),
  'utf8'
)
const productsPage = readFileSync(
  join(process.cwd(), 'src/app/[locale]/products/page.tsx'),
  'utf8'
)
const homeClient = readFileSync(
  join(process.cwd(), 'src/app/[locale]/HomeClient.tsx'),
  'utf8'
)
const newsletter = readFileSync(
  join(process.cwd(), 'src/components/home/NewsletterSignup.tsx'),
  'utf8'
)

describe('Home page catalog fetch', () => {
  it('loads featured products server-side with the static-page guard', () => {
    expect(page).toMatch(/export const revalidate = 60/)
    expect(page).toMatch(/generateStaticParams/)
    expect(page).toMatch(/setRequestLocale\(locale\)/)
    expect(page).toMatch(/catalogForStaticPage/)
    expect(page).toMatch(/getCachedProductList/)
    expect(page).toMatch(/emptyProductList/)
    expect(page).toMatch(/getCachedPotterList/)
    expect(page).toMatch(/featuredProducts=\{products\.products\}/)
    expect(page).toMatch(/const productQuery = \{ page: 1, limit: 3 \}/)
    expect(page).not.toMatch(/active:\s*true/)
    expect(productsPage).toMatch(/const query = \{ page: 1, limit: 10 \}/)
    expect(productsPage).not.toMatch(/active:\s*true/)
  })

  it('passes featured products into FeaturedCollections', () => {
    expect(homeClient).toMatch(/featuredProducts/)
    expect(homeClient).toMatch(
      /<FeaturedCollections products=\{featuredProducts\} \/>/
    )
  })

  it('does not fetch a newsletter endpoint', () => {
    expect(newsletter).not.toMatch(/fetch\(/)
    expect(newsletter).not.toMatch(/\/api\/newsletter/)
    expect(newsletter).not.toMatch(/'use client'/)
  })
})
