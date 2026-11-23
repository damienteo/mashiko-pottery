const SENTENCE_END = new Set(['.', '!', '?', '。', '！', '？'])

/**
 * Shorten text for meta descriptions without cutting mid-sentence or
 * mid-word when a boundary exists. Always appends an ellipsis when truncated.
 */
export function trimAtBoundary(text: string, max = 150): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (!normalized) return ''
  if (normalized.length <= max) return normalized

  const slice = normalized.slice(0, max)

  for (let i = slice.length - 1; i >= 0; i--) {
    if (SENTENCE_END.has(slice[i])) {
      const cut = slice.slice(0, i + 1).trimEnd()
      if (cut.length > 0) return `${cut}…`
      break
    }
  }

  const lastSpace = slice.lastIndexOf(' ')
  if (lastSpace > 0) {
    return `${slice.slice(0, lastSpace).trimEnd()}…`
  }

  return `${slice.trimEnd()}…`
}

export function isNonEmptyText(value?: string | null): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

export function documentTitle(
  pageTitle: string,
  brand = 'Mashiko Pottery'
): string {
  const title = pageTitle.trim()
  if (!title) return brand
  return `${title} – ${brand}`
}
