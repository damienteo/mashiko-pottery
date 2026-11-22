/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import PotterSpotlights from '@/components/home/PotterSpotlights'

jest.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => key,
  getLocale: async () => 'en',
}))

jest.mock('@/components/ui/IntentLink', () => ({
  __esModule: true,
  default: function MockIntentLink({
    href,
    children,
  }: {
    href: string
    children: React.ReactNode
  }) {
    return <a href={href}>{children}</a>
  },
}))

describe('PotterSpotlights', () => {
  it('shows a coming-soon message when there are no potters', async () => {
    render(await PotterSpotlights({ potters: [] }))
    expect(screen.getByText('potterSpotlights.empty')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'potterSpotlights.title' })
    ).toBeInTheDocument()
  })
})
