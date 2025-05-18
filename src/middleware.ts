import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const LOCALE_MAP: Record<string, string> = {
  "zh-CN": "zh",
  "zh-TW": "zh",
  "zh-HK": "zh",
};

function normalizeLocale(locale: string): "en" | "ja" | "zh" {
  const mapped = LOCALE_MAP[locale] ?? locale;
  if (["en", "ja", "zh"].includes(mapped)) {
    return mapped as "en" | "ja" | "zh";
  }
  return routing.defaultLocale;
}

const supportedLocales = routing.locales;

export default function middleware(request: NextRequest) {
  const acceptLang = request.headers.get("accept-language");
  const preferredLocale = acceptLang?.split(",")?.[0] ?? routing.defaultLocale;
  const normalizedLocale = normalizeLocale(preferredLocale);

  // Update the routing object with the normalized locale
  const resolvedRouting = {
    ...routing,
    locales: supportedLocales,
    defaultLocale: routing.defaultLocale,
    getLocale() {
      return supportedLocales.includes(normalizedLocale)
        ? normalizedLocale
        : routing.defaultLocale;
    },
  };

  return createMiddleware(resolvedRouting)(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
