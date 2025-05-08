"use client";
import { useTranslations } from "next-intl";

export const metadata = {
  title: "Home – Mashiko Pottery",
  description:
    "Explore our curated collection of handmade Mashiko pottery from local artisans.",
};

export default function HomePage() {
  const t = useTranslations();
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600">{t("home.heading")}</h1>
    </main>
  );
}
