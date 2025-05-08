import type { Metadata } from "next";
import { Provider } from "react-redux";
import { NextIntlClientProvider } from "next-intl";

import Analytics from "./ClientAnalytics";
import { store } from "@/store/store";

import "./globals.css";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  // load the correct JSON
  const messages = (await import(`../locales/${params.locale}.json`)).default;

  return {
    title: messages.meta.home.title,
    description: messages.meta.home.description,
    openGraph: {
      title: messages.meta.home.title,
      description: messages.meta.home.description,
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
  const messages = (await import(`../locales/${params.locale}.json`)).default;

  return (
    <html lang={params.locale}>
      <body className="bg-gray-50 text-gray-800">
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <Provider store={store}>
            <Analytics />
            {children}
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
