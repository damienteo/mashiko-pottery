/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import NewsletterSignup from '@/components/home/NewsletterSignup'

jest.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => key,
}))

describe('NewsletterSignup', () => {
  it('is a coming-soon state and never calls fetch', async () => {
    const fetchMock = jest.fn()
    global.fetch = fetchMock

    render(await NewsletterSignup())

    expect(screen.getByText('newsletter.comingSoon')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'newsletter.button' })
    ).toBeDisabled()
    expect(screen.getByPlaceholderText('newsletter.placeholder')).toBeDisabled()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
