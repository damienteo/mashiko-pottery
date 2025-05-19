import { PrismaClient } from "@prisma/client";

export default async function seedProducts(prisma: PrismaClient) {
  const potters = await prisma.potter.findMany();
  if (potters.length === 0) return;

  const count = await prisma.product.count();
  if (count > 0) return;

  const photoPaths = [
    "/pottery/vase1.png",
    "/pottery/vase2.png",
    "/pottery/bowl1.png",
    "/pottery/planter1.png",
    "/pottery/planter2.png",
    "/pottery/plate1.png",
    "/pottery/decorative_plate.png",
    "/pottery/pitcher1.png",
    "/pottery/mug1.png",
    "/pottery/cup1.png",
    "/pottery/teapot1.png",
    "/pottery/tray1.png",
  ];

  const products = [
    {
      title: { en: "Test Vase", ja: "テスト花瓶", zh: "测试花瓶" },
      price: 3800,
      stock: 42,
      description: {
        en: "A small handmade test vase from Mashiko.",
        ja: "益子焼の小さな手作りテスト花瓶です。",
        zh: "来自益子的小型手工测试花瓶。",
      },
      weight: 1.2,
      category: "tableware",
    },
    {
      title: {
        en: "Sample Tea Cup",
        ja: "サンプルティーカップ",
        zh: "样品茶杯",
      },
      price: 1200,
      stock: 87,
      description: {
        en: "Elegant tea cup, perfect for your morning tea.",
        ja: "朝のお茶にぴったりのエレガントなティーカップ。",
        zh: "优雅的茶杯，完美适合您的晨间茶。",
      },
      weight: 1.2,
      category: "tableware",
    },
    {
      title: { en: "Demo Planter", ja: "デモプランター", zh: "演示花盆" },
      price: 4500,
      stock: 15,
      description: {
        en: "Ceramic planter ideal for succulents and small plants.",
        ja: "多肉植物や小さな植物に最適なセラミックプランター。",
        zh: "适合多肉植物和小型植物的陶瓷花盆。",
      },
      weight: 1.2,
      category: "tableware",
    },
    {
      title: { en: "Test Bowl", ja: "テストボウル", zh: "测试碗" },
      price: 2500,
      stock: 63,
      description: {
        en: "A handmade stoneware bowl for soups and salads.",
        ja: "スープやサラダにぴったりの石器製ハンドメイドボウル。",
        zh: "适合汤和沙拉的手工石器碗。",
      },
      weight: 1.2,
      category: "tableware",
    },
    {
      title: { en: "Demo Plate", ja: "デモプレート", zh: "演示盘" },
      price: 3000,
      stock: 29,
      description: {
        en: "A ceramic plate perfect for appetizers and desserts.",
        ja: "前菜やデザートに最適なセラミックプレート。",
        zh: "完美适合开胃菜和甜点的陶瓷盘。",
      },
      weight: 1.2,
      category: "tableware",
    },
    {
      title: { en: "Sample Mug", ja: "サンプルマグ", zh: "样品马克杯" },
      price: 1800,
      stock: 74,
      description: {
        en: "A sturdy mug for your daily coffee or tea.",
        ja: "毎日のコーヒーやお茶に最適な丈夫なマグカップ。",
        zh: "适合日常咖啡或茶的坚固马克杯。",
      },
      weight: 1.2,
      category: "tableware",
    },
    {
      title: { en: "Artisan Pitcher", ja: "職人のピッチャー", zh: "匠人水壶" },
      price: 5500,
      stock: 58,
      description: {
        en: "A beautiful pitcher for water or beverages.",
        ja: "水や飲み物に使える美しいピッチャー。",
        zh: "适用于水或饮料的漂亮水壶。",
      },
      weight: 1.2,
      category: "tableware",
    },
    {
      title: { en: "Mini Vase", ja: "ミニ花瓶", zh: "迷你花瓶" },
      price: 2200,
      stock: 36,
      description: {
        en: "A small vase ideal for single-stem flowers.",
        ja: "一輪の花にぴったりな小さな花瓶。",
        zh: "理想的单枝花迷你花瓶。",
      },
      weight: 1.2,
      category: "tableware",
    },
    {
      title: { en: "Large Planter", ja: "ラージプランター", zh: "大型花盆" },
      price: 6200,
      stock: 90,
      description: {
        en: "A spacious planter for larger plants and flowers.",
        ja: "大きな植物や花に最適な広々としたプランター。",
        zh: "适合大型植物和花卉的宽敞花盆。",
      },
      weight: 1.2,
      category: "tableware",
    },
    {
      title: { en: "Decorative Plate", ja: "装飾プレート", zh: "装饰盘" },
      price: 3400,
      stock: 12,
      description: {
        en: "A decorative plate to enhance your home decor.",
        ja: "インテリアを引き立てる装飾プレート。",
        zh: "提升家居装饰的装饰盘。",
      },
      weight: 1.2,
      category: "tableware",
    },
    {
      title: { en: "Tea Pot", ja: "ティーポット", zh: "茶壶" },
      price: 4800,
      stock: 50,
      description: {
        en: "A classic teapot for brewing loose-leaf tea.",
        ja: "茶葉用のクラシックなティーポット。",
        zh: "用于冲泡散茶的经典茶壶。",
      },
      weight: 1.2,
      category: "tableware",
    },
    {
      title: { en: "Serving Tray", ja: "サービングトレイ", zh: "托盘" },
      price: 2900,
      stock: 77,
      description: {
        en: "A versatile tray for serving food and drinks.",
        ja: "食べ物や飲み物を提供するための多用途トレイ。",
        zh: "用于提供食物和饮料的多功能托盘。",
      },
      weight: 1.2,
      category: "tableware",
    },
  ];

  for (let i = 0; i < products.length; i++) {
    await prisma.product.create({
      data: {
        ...products[i],
        potterId: potters[i % potters.length].id,
        photos: [photoPaths[i % photoPaths.length]],
      },
    });
  }

  console.log("✅ Seeded products");
}
