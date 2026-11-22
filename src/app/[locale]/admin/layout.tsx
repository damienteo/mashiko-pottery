import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import AdminLayoutClient from "./AdminLayoutClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin – Mashiko Pottery",
  description: "Administration dashboard for Mashiko Pottery",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
