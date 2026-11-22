/**
 * Login `callback` must be a same-origin relative path. Reject protocol-relative
 * URLs, schemes, and backslashes so it cannot be used as an open redirect.
 */
export function isSafeRelativeCallback(value: string): boolean {
  if (
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\')
  ) {
    return false
  }
  if (/^[a-zA-Z][a-zA-Z+.-]*:/.test(value)) {
    return false
  }
  try {
    const decoded = decodeURIComponent(value)
    if (
      decoded.startsWith('//') ||
      decoded.includes('\\') ||
      /^[a-zA-Z][a-zA-Z+.-]*:/.test(decoded)
    ) {
      return false
    }
  } catch {
    return false
  }
  return true
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
