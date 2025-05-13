// src/constants/localeLabels.ts
export const localeLabels = {
  en: "English",
  ja: "日本語",
  "zh-CN": "简体中文",
} as const;

export type LocaleCode = keyof typeof localeLabels;
