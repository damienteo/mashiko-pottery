/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { readFileSync } from 'fs'
import { join } from 'path'
import { render, screen } from '@testing-library/react'
import HowItWorks from '@/components/home/HowItWorks'

jest.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => key,
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({
    alt,
    src,
    'aria-hidden': ariaHidden,
  }: {
    alt?: string
    src: string
    'aria-hidden'?: boolean | string
  }) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt} src={src} aria-hidden={ariaHidden ? 'true' : undefined} />
    )
  },
}))

describe('HowItWorks', () => {
  it('renders four steps with distinct titles and descriptions', async () => {
    const { container } = render(await HowItWorks())

    const titles = [
      'howItWorks.step1.title',
      'howItWorks.step2.title',
      'howItWorks.step3.title',
      'howItWorks.step4.title',
    ]
    const descriptions = [
      'howItWorks.step1.description',
      'howItWorks.step2.description',
      'howItWorks.step3.description',
      'howItWorks.step4.description',
    ]

    for (const title of titles) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    }
    for (const description of descriptions) {
      expect(screen.getByText(description)).toBeInTheDocument()
    }

    titles.forEach((title, i) => {
      expect(title).not.toEqual(descriptions[i])
    })

    const icons = container.querySelectorAll('img')
    expect(icons).toHaveLength(4)
    for (const icon of icons) {
      expect(icon).toHaveAttribute('alt', '')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('keeps title and description copy distinct in every locale', () => {
    for (const locale of ['en', 'ja', 'zh'] as const) {
      const copy = JSON.parse(
        readFileSync(
          join(process.cwd(), `src/locales/${locale}/howItWorks.json`),
          'utf8'
        )
      ) as {
        step1: { title: string; description: string }
        step2: { title: string; description: string }
        step3: { title: string; description: string }
        step4: { title: string; description: string }
      }
      for (const step of ['step1', 'step2', 'step3', 'step4'] as const) {
        expect(copy[step].title.length).toBeGreaterThan(0)
        expect(copy[step].description.length).toBeGreaterThan(0)
        expect(copy[step].title).not.toEqual(copy[step].description)
      }
    }
  })
})
