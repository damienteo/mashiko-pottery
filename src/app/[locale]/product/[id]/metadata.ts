// src/app/product/[id]/metadata.ts

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // Fetch minimal data just for head
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${params.id}`
  );
  const product = await res.json();

  return {
    title: `${product.title} – Mashiko Pottery`,
    description: product.description.slice(0, 150),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 150),
      images: product.photos.map((url: string) => ({ url })),
    },
  };
}
