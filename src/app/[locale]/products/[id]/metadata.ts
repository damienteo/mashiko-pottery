import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) notFound();
  const product: { title: string; description: string; photos: string[] } =
    await res.json();

  const shortDesc = product.description?.slice(0, 150) ?? "";
  const title = `${product.title} – Mashiko Pottery`;

  return {
    title,
    description: shortDesc,
    openGraph: {
      title,
      description: shortDesc,
      images: product.photos.map((url) => ({ url })),
    },
  };
}
