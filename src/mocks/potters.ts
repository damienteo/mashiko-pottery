import type { Potter } from "@/store/potters/potterDetailsSlice";

export const mockPotters: Potter[] = [
  {
    id: "1",
    name: "Kazuo Tanaka",
    image: "/potters/1.png",
    bio: {
      en: "Renowned Mashiko potter known for his minimalist glaze techniques.",
      ja: "ミニマリストの釉薬技術で知られる有名な益子の陶芸家。",
      zh: "以其极简釉面技术闻名的著名益子陶艺家。",
    },
  },
  {
    id: "2",
    name: "Emiko Yamamoto",
    image: "/potters/2.png",
    bio: {
      en: "Specializes in hand–carved motifs and traditional Japanese patterns.",
      ja: "手彫りのモチーフと伝統的な日本の模様を専門としています。",
      zh: "专注于手工雕刻图案和传统日本图案。",
    },
  },
];
