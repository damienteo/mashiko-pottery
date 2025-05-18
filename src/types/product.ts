import type { LocalizedString } from "./i18n";

export interface Product {
  id: number;
  potterId: string;
  title: LocalizedString;
  description: LocalizedString;
  price: number;
  inventory: number;
  weight: number;
  photos: string[];
  category: string;
  createdAt?: string;
  updatedAt?: string;
}
