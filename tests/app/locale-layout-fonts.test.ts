import { readFileSync } from 'node:fs'
import path from 'node:path'

const root = path.join(__dirname, '../..')
const layoutSource = readFileSync(
  path.join(root, 'src/app/[locale]/layout.tsx'),
  'utf8'
)
const globalsSource = readFileSync(
  path.join(root, 'src/app/[locale]/globals.css'),
  'utf8'
)

describe('locale font loading', () => {
  it('does not construct Noto via next/font (avoids shipping CJK woff2)', () => {
    expect(layoutSource).not.toMatch(/Noto_Sans_JP/)
    expect(layoutSource).not.toMatch(/Noto_Serif_SC/)
    expect(layoutSource).not.toMatch(/Noto_Sans_SC/)
    expect(layoutSource).toMatch(/from 'next\/font\/google'/)
    expect(layoutSource).toMatch(/Inter/)
    expect(layoutSource).toMatch(/Playfair_Display/)
  })

  it('applies Inter and Playfair variables on every locale', () => {
    expect(layoutSource).toMatch(/inter\.variable/)
    expect(layoutSource).toMatch(/playfair\.variable/)
  })

  it('uses system CJK stacks keyed by html lang', () => {
    expect(globalsSource).toMatch(/html\[lang='ja'\]/)
    expect(globalsSource).toMatch(/html\[lang='zh'\]/)
    expect(globalsSource).toMatch(/Hiragino Sans/)
    expect(globalsSource).toMatch(/Hiragino Kaku Gothic ProN/)
    expect(globalsSource).toMatch(/Yu Gothic/)
    expect(globalsSource).toMatch(/Meiryo/)
    expect(globalsSource).toMatch(/PingFang SC/)
    expect(globalsSource).toMatch(/Hiragino Sans GB/)
    expect(globalsSource).toMatch(/Microsoft YaHei/)
    expect(globalsSource).toMatch(/Noto Sans SC/)
    expect(globalsSource).toMatch(/font-family: var\(--font-sans\)/)
    expect(globalsSource).toMatch(/font-family: var\(--font-serif\)/)
  })
})
