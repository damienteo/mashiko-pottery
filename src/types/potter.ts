// src/types/potter.ts

import type { LocalizedString } from "@/types/i18n";

export interface Potter {
  id: number;
  userId?: number;
  name: LocalizedString;
  bio: LocalizedString;
  style: string;
  active: boolean;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}
