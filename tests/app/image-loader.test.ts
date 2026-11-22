import { readFileSync } from 'fs'
import { join } from 'path'

const nextConfig = readFileSync(join(process.cwd(), 'next.config.ts'), 'utf8')
const smartImage = readFileSync(
  join(process.cwd(), 'src/components/ui/SmartImage.tsx'),
  'utf8'
)

describe('image loaders', () => {
  it('does not set a global custom image loader', () => {
    expect(nextConfig).not.toMatch(/loaderFile/)
    expect(nextConfig).not.toMatch(/loader:\s*'custom'/)
  })

  it('keeps the Cloudinary loader inside the client SmartImage module', () => {
    expect(smartImage).toMatch(/'use client'/)
    expect(smartImage).toMatch(/cloudinaryLoader/)
    expect(smartImage).toMatch(/res\.cloudinary\.com/)
  })
})
