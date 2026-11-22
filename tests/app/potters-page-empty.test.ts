import { readFileSync } from 'fs'
import { join } from 'path'

const page = readFileSync(
  join(process.cwd(), 'src/app/[locale]/potters/page.tsx'),
  'utf8'
)

describe('Potters list empty state', () => {
  it('shows translated empty copy instead of loading forever', () => {
    expect(page).toMatch(/potters\.length === 0/)
    expect(page).toMatch(/potters\.empty/)
    expect(page).not.toMatch(/potters\.length === 0[\s\S]*t\('loading'\)/)
  })
})
