import type { SellerProfile } from "@/store/sellerSlice";

export const mockSellerProfile: SellerProfile = {
  id: 1,
  name: {
    en: "Aiko Tanaka",
    ja: "田中愛子",
    "zh-CN": "田中爱子",
  },
  bio: {
    en: "Hello! I studied pottery in Mashiko and create everyday ware that blends tradition with creativity.",
    ja: "こんにちは！私は益子で陶芸を学び、日常使いの器を制作しています。伝統と創造性の融合が私の作品の特徴です。",
    "zh-CN": "你好！我在益子学习陶艺，创作将传统与创造力相结合的日常用器皿。",
  },
  portfolio: {
    en: "View my handmade pottery online: https://example.com/aiko-tanaka-portfolio",
    ja: "手作りの器をオンラインでご覧いただけます： https://example.com/aiko-tanaka-portfolio",
    "zh-CN":
      "在线查看我的手工陶艺作品： https://example.com/aiko-tanaka-portfolio",
  },
};
