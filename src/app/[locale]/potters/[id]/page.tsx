"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Potter {
  id: number;
  name: string;
  bio: string;
}

export default function PotterPage() {
  const { id } = useParams();
  const [potter, setPotter] = useState<Potter | null>(null);

  useEffect(() => {
    fetch(`/api/potters/${id}`)
      .then((res) => res.json())
      .then((data: Potter) => setPotter(data));
  }, [id]);

  if (!potter) return <p className="p-8">Loading…</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">{potter.name}</h1>
      <p className="mt-2 text-gray-700">{potter.bio}</p>
      {/* TODO: list this potter’s products */}
    </div>
  );
}
