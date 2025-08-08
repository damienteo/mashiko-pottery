import type { LocalizedString } from "./i18n";

export interface Product {
  id: number;
  potterId: number;
  title: LocalizedString;
  description: LocalizedString;
  price: number;
  stock?: number;
  weight?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  leadTimeDays?: number;
  photos: string[];
  mainImage?: string;
  tags: string[];
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  isDraft: boolean;
}
