// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

import Analytics from "./ClientAnalytics";
import StoreProvider from "./StoreProvider";
import Navbar from "@/components/Navbar";
import "./globals.css";

// Pre-render all locale variants
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Generate localized metadata
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const t = await getTranslations({
    locale,
    namespace: "meta.home",
  });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
    },
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className="bg-gray-50 text-gray-800">
        <NextIntlClientProvider>
          <StoreProvider>
            <Analytics />
            <Navbar />
            {children}
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
