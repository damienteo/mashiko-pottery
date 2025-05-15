import type { SellerProfile } from "@/store/seller/sellerSlice";

export const mockSellerProfile: SellerProfile = {
  id: 1,
  name: {
    en: "Aiko Tanaka",
    ja: "田中愛子",
    "zh-CN": "田中爱子",
  },
  bio: {
    en: `
      <h2>About Me</h2>
      <p>Hello! I studied pottery in Mashiko and create everyday ware that blends tradition with creativity.</p>
      <p><strong>Highlights:</strong></p>
      <ul>
        <li>Hand-thrown vases</li>
        <li>Glazed mugs</li>
        <li>Functional dinnerware</li>
      </ul>
      <p>Watch my studio tour:</p>
      <div class="w-full aspect-video">
        <iframe
          class="w-full h-full"
          src="https://www.youtube.com/embed/2taUjbCb3N8"
          title="Pottery Studio Tour"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    `,
    ja: `
      <h2>私について</h2>
      <p>こんにちは！私は益子で陶芸を学び、伝統と創造性を融合させた日常使いの器を制作しています。</p>
      <p><strong>主な作品:</strong></p>
      <ul>
        <li>手びねりの花瓶</li>
        <li>釉薬マグカップ</li>
        <li>機能的な食器</li>
      </ul>
      <p>スタジオツアーをご覧ください：</p>
      <div class="w-full aspect-video">
        <iframe
          class="w-full h-full"
          src="https://www.youtube.com/embed/2taUjbCb3N8"
          title="陶芸スタジオツアー"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    `,
    "zh-CN": `
      <h2>关于我</h2>
      <p>你好！我在益子学习陶艺，创作将传统与创造力相结合的日常用器皿。</p>
      <p><strong>作品亮点：</strong></p>
      <ul>
        <li>手工拉坯花瓶</li>
        <li>釉面马克杯</li>
        <li>实用餐具</li>
      </ul>
      <p>观看我的工作室之旅：</p>
      <div class="w-full aspect-video">
        <iframe
          class="w-full h-full"
          src="https://www.youtube.com/embed/2taUjbCb3N8"
          title="陶艺工作室之旅"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    `,
  },
  portfolio: {
    en: "View my handmade pottery online: https://example.com/aiko-tanaka-portfolio",
    ja: "手作りの器をオンラインでご覧いただけます： https://example.com/aiko-tanaka-portfolio",
    "zh-CN":
      "在线查看我的手工陶艺作品： https://example.com/aiko-tanaka-portfolio",
  },
};
