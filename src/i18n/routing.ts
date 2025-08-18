import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // list your supported locale prefixes exactly as in next.config.js
  locales: ["en", "ja", "zh"],
  // which one to fall back to when none matches
  defaultLocale: "ja",
});
