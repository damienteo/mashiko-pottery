const LOCALE_PREFIX = /^\/(en|ja|zh)(?=\/|$)/;

export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(LOCALE_PREFIX, "");
  return stripped.length > 0 ? stripped : "/";
}

export function localeFromPathname(
  pathname: string,
): "en" | "ja" | "zh" | null {
  const match = pathname.match(/^\/(en|ja|zh)(?=\/|$)/);
  if (!match) return null;
  return match[1] as "en" | "ja" | "zh";
}

/** Admin, seller, and profile routes need a session. Public catalog does not. */
export function isSessionRequiredPath(pathname: string): boolean {
  const path = stripLocalePrefix(pathname);
  return /^\/(admin|seller|profile)(\/|$)/.test(path);
}
