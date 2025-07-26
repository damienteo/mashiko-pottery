// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

import Analytics from "./ClientAnalytics";
import StoreProvider from "./StoreProvider";
import AuthLoader from "@/components/auth/AuthLoader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ToasterContainer } from "@/components/ui/Toast";
import "./globals.css";

import {
  Inter,
  Playfair_Display,
  Merriweather,
  Noto_Sans_JP,
  Noto_Serif_SC,
} from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
});
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-merriweather",
});
// Locale-specific font fallbacks (reuse Inter variable)
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
});
const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
});

// Pre-render all locale variants
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Generate localized metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
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
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Choose font variable based on locale (default to Inter)
  const localeFonts: Record<string, string> = {
    ja: notoSansJP.variable,
    zh: notoSerifSC.variable,
  };
  const fontClass = localeFonts[locale] ?? inter.variable;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable} ${merriweather.variable} ${fontClass} antialiased`}
    >
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        <NextIntlClientProvider>
          <StoreProvider>
            <AuthLoader />
            <Analytics />
            {/* main content grows to push footer to bottom */}
            <main className="flex-grow">
              <Navbar />
              <ToasterContainer />
              {children}
            </main>
            <Footer />
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
