import type { Product } from "@/store/products/productDetailSlice";

export const mockProducts: Product[] = [
  {
    id: 1,
    title: "Test Vase",
    price: 3800,
    description: "A small handmade test vase from Mashiko.",
    photos: ["/images/vase1.jpg"],
  },
  {
    id: 2,
    title: "Sample Tea Cup",
    price: 1200,
    description: "Elegant tea cup, perfect for your morning tea.",
    photos: ["/images/cup1.jpg"],
  },
  {
    id: 3,
    title: "Demo Planter",
    price: 4500,
    description: "Ceramic planter ideal for succulents and small plants.",
    photos: ["/images/planter1.jpg"],
  },
];
