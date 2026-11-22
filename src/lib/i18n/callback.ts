/**
 * Login `callback` must be a same-origin relative path. Reject protocol-relative
 * URLs, schemes, backslashes, and ASCII whitespace/control characters (raw or
 * percent-encoded) so it cannot be used as an open redirect.
 */
const CALLBACK_ORIGIN = 'https://example.invalid'
const ASCII_CONTROLS_OR_SPACE = /[\u0000-\u0020\u007f]/

function isUnsafeRelativePath(value: string): boolean {
  return (
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    ASCII_CONTROLS_OR_SPACE.test(value) ||
    /^[a-zA-Z][a-zA-Z+.-]*:/.test(value)
  )
}

export function isSafeRelativeCallback(value: string): boolean {
  if (isUnsafeRelativePath(value)) {
    return false
  }
  try {
    const decoded = decodeURIComponent(value)
    if (isUnsafeRelativePath(decoded)) {
      return false
    }
    const parsed = new URL(value, CALLBACK_ORIGIN)
    return (
      parsed.origin === CALLBACK_ORIGIN &&
      parsed.username === '' &&
      parsed.password === '' &&
      parsed.pathname.startsWith('/') &&
      !parsed.pathname.startsWith('//')
    )
  } catch {
    return false
  }
}

export function parseCallbackParam(
  raw: string | undefined,
  fallback: string
): string {
  if (!raw) return fallback
  let value = raw
  try {
    value = decodeURIComponent(raw)
  } catch {
    return fallback
  }
  return isSafeRelativeCallback(value) ? value : fallback
}
