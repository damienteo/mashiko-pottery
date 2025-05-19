import { PrismaClient } from "@prisma/client";

export default async function seedPotters(prisma: PrismaClient) {
  const users = await prisma.user.findMany({ where: { role: "SELLER" } });
  if (users.length === 0) return;

  const count = await prisma.potter.count();
  if (count > 0) return;

  const potters = [
    {
      user: {
        connect: { id: 11 },
      },
      name: { en: "Aki Takahashi", ja: "高橋あき", zh: "高桥秋" },
      bio: {
        en: "A talented potter known for delicate porcelain work and innovative glazing.",
        ja: "繊細な磁器作品と革新的な釉薬で知られる才能ある陶芸家。",
        zh: "以精致的瓷器作品和创新的釉面技术闻名的才华横溢的陶艺家。",
      },
      style: "modern",
      imageUrl: "/potters/aki.png",
      active: true,
    },
    {
      user: {
        connect: { id: 12 },
      },
      name: { en: "Kenji Sato", ja: "佐藤健二", zh: "佐藤健二" },
      bio: {
        en: "Expert in traditional Mashiko pottery techniques with a modern twist.",
        ja: "伝統的な益子焼の技術に現代的なひねりを加えた専門家。",
        zh: "擅长传统益子陶艺技法并融入现代元素的专家。",
      },
      style: "modern",
      imageUrl: "/potters/kenji.png",
      active: true,
    },
    {
      user: {
        connect: { id: 13 },
      },
      name: { en: "Mariko Yamada", ja: "山田真理子", zh: "山田真理子" },
      bio: {
        en: "Creates vibrant, hand-painted ceramics inspired by nature.",
        ja: "自然に触発された鮮やかな手描きの陶器を制作。",
        zh: "创作受自然启发的生动手绘陶瓷作品。",
      },
      style: "modern",
      imageUrl: "/potters/mariko.png",
      active: true,
    },
    {
      user: {
        connect: { id: 14 },
      },
      name: { en: "Taro Fujimoto", ja: "藤本太郎", zh: "藤本太郎" },
      bio: {
        en: "Specializes in earthy stoneware with rustic charm.",
        ja: "素朴な魅力を持つ土器に特化している。",
        zh: "专注于具有质朴魅力的陶器。",
      },
      style: "rustic",
      active: true,
    },
    {
      user: {
        connect: { id: 15 },
      },
      name: { en: "Naoko Ishikawa", ja: "石川直子", zh: "石川直子" },
      bio: {
        en: "Known for minimalistic aesthetics and subtle textures.",
        ja: "ミニマルな美学と微妙な質感で知られる。",
        zh: "以极简美学和细腻质感而闻名。",
      },
      style: "minimalist",
      active: true,
    },
    {
      user: {
        connect: { id: 16 },
      },
      name: { en: "Riku Hoshino", ja: "星野陸", zh: "星野陸" },
      bio: {
        en: "Combines modern art with traditional kiln firing techniques.",
        ja: "現代アートと伝統的な窯焼き技術を融合。",
        zh: "融合现代艺术与传统烧窑技术。",
      },
      style: "fusion",
      active: true,
    },
    {
      user: {
        connect: { id: 17 },
      },
      name: { en: "Haruka Arai", ja: "新井遥", zh: "新井遥" },
      bio: {
        en: "Creates functional everyday ware with artistic flair.",
        ja: "芸術的なセンスのある日常使いの器を制作。",
        zh: "创作兼具艺术感与实用性的日常陶器。",
      },
      style: "functional",
      active: true,
    },
    {
      user: {
        connect: { id: 18 },
      },
      name: { en: "Takumi Nomura", ja: "野村匠", zh: "野村匠" },
      bio: {
        en: "Explores asymmetry and natural imperfections.",
        ja: "非対称性と自然な不完全さを追求している。",
        zh: "追求不对称与自然的不完美之美。",
      },
      style: "wabi-sabi",
      active: true,
    },
    {
      user: {
        connect: { id: 19 },
      },
      name: { en: "Emi Nakamura", ja: "中村恵美", zh: "中村惠美" },
      bio: {
        en: "Creates elegant forms with metallic finishes.",
        ja: "金属仕上げのエレガントな形状を制作。",
        zh: "创作金属质感的优雅造型陶器。",
      },
      style: "elegant",
      active: true,
    },
    {
      user: {
        connect: { id: 20 },
      },
      name: { en: "Souta Kimura", ja: "木村壮太", zh: "木村壮太" },
      bio: {
        en: "Blends geometric patterns into classic tea ware.",
        ja: "幾何学模様をクラシックな茶器に融合。",
        zh: "将几何图案融入经典茶具设计。",
      },
      style: "geometric",
      active: true,
    },
  ];

  for (const potter of potters) {
    await prisma.potter.create({ data: potter });
  }

  console.log("✅ Seeded potters");
}
