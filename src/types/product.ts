export interface Product {
  id: number;
  potterId: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  weight: number;
  photos: string[];
  category: string;
}
