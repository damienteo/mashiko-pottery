import type { Potter } from "@/store/potters/potterDetailsSlice";

export const mockPotters: Potter[] = [
  {
    id: "1",
    name: {
      en: "Aki Takahashi",
      ja: "高橋あき",
      zh: "高桥秋",
    },
    image: "/potters/aki.png",
    bio: {
      en: "A talented potter known for delicate porcelain work and innovative glazing.",
      ja: "繊細な磁器作品と革新的な釉薬で知られる才能ある陶芸家。",
      zh: "以精致的瓷器作品和创新的釉面技术闻名的才华横溢的陶艺家。",
    },
  },
  {
    id: "2",
    name: {
      en: "Kenji Sato",
      ja: "佐藤健二",
      zh: "佐藤健二",
    },
    image: "/potters/kenji.png",
    bio: {
      en: "Expert in traditional Mashiko pottery techniques with a modern twist.",
      ja: "伝統的な益子焼の技術に現代的なひねりを加えた専門家。",
      zh: "擅长传统益子陶艺技法并融入现代元素的专家。",
    },
  },
  {
    id: "3",
    name: {
      en: "Mariko Yamada",
      ja: "山田真理子",
      zh: "山田真理子",
    },
    image: "/potters/mariko.png",
    bio: {
      en: "Creates vibrant, hand-painted ceramics inspired by nature.",
      ja: "自然に触発された鮮やかな手描きの陶器を制作。",
      zh: "创作受自然启发的生动手绘陶瓷作品。",
    },
  },
];
