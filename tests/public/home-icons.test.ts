import { readFileSync } from 'fs'
import { join } from 'path'

const icons = [
  'step1.svg',
  'step2.svg',
  'step3.svg',
  'step4.svg',
  'shipping-guarantee.svg',
]

describe('home icons', () => {
  it.each(icons)('%s is a clean stroke icon without leftover comments', (name) => {
    const svg = readFileSync(join(process.cwd(), 'public/icons', name), 'utf8')
    expect(svg).toMatch(/stroke-width="2"/)
    expect(svg).toMatch(/stroke-linecap="round"/)
    expect(svg).not.toMatch(/save as/i)
    expect(svg).not.toMatch(/<!--/)
  })
})
