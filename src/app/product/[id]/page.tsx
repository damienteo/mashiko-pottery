// src/app/product/[id]/page.tsx

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { logViewItem } from "@/lib/analytics";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  photos: string[];
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Fetch product data client‐side
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data: Product) => {
        setProduct(data);
        logViewItem({ id: data.id, title: data.title, price: data.price });
      });
  }, [id]);

  if (!product) {
    return <p className="p-8">Loading…</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">{product.title}</h1>
      <p className="mt-2 text-gray-700">¥{product.price.toLocaleString()}</p>
      <p className="mt-4 text-gray-600">{product.description}</p>
      {/* TODO: image carousel, add-to-cart button, etc. */}
    </div>
  );
}
