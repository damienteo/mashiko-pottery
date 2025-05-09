import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import CartClient from "./CartClient";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.cart" });

  // Grab session cookie if it exists
  const cookieStore = await cookies();
  const session = cookieStore.get("session_id");
  const headers: Record<string, string> = {};
  if (session) {
    headers.cookie = `session_id=${session.value}`;
  }

  // Server‑side fetch to our mock or real API
  const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const cartUrl = new URL("/api/cart", origin).toString();
  const res = await fetch(cartUrl, { headers, next: { revalidate: 60 } });

  // Count number of distinct items
  let count = 0;
  if (res.ok) {
    const items: Array<{ quantity: number }> = await res.json();
    count = items.length;
  }

  const base = t("title");
  const title = `${base} (${count}) – Mashiko Pottery`;

  return {
    title,
    description: t("description"),
    openGraph: {
      title: base + ` (${count})`,
      description: t("description"),
    },
  };
}
export default function CartPage() {
  return <CartClient />;
}
