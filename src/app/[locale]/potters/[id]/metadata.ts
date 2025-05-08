import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/potters/${params.id}`
  );
  const potter = await res.json();
  return {
    title: `${potter.name} – Potter Profile`,
    description: potter.bio.slice(0, 150),
  };
}
