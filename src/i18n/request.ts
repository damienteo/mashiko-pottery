import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = {
    common: (await import(`../locales/${locale}/common.json`)).default,
    status: (await import(`../locales/${locale}/status.json`)).default,
    meta: (await import(`../locales/${locale}/meta.json`)).default,
    home: (await import(`../locales/${locale}/home.json`)).default,
    cart: (await import(`../locales/${locale}/cart.json`)).default,
    checkout: (await import(`../locales/${locale}/checkout.json`)).default,
    product: (await import(`../locales/${locale}/product.json`)).default,
    potter: (await import(`../locales/${locale}/potter.json`)).default,
    potters: (await import(`../locales/${locale}/potters.json`)).default,
    potterSpotlights: (
      await import(`../locales/${locale}/potterSpotlights.json`)
    ).default,
    seller: (await import(`../locales/${locale}/seller.json`)).default,
    admin: (await import(`../locales/${locale}/admin.json`)).default,
    products: (await import(`../locales/${locale}/products.json`)).default,
    featured: (await import(`../locales/${locale}/featured.json`)).default,
    howItWorks: (await import(`../locales/${locale}/howItWorks.json`)).default,
    shipping: (await import(`../locales/${locale}/shipping.json`)).default,
    shippingGuarantee: (
      await import(`../locales/${locale}/shippingGuarantee.json`)
    ).default,
    newsletter: (await import(`../locales/${locale}/newsletter.json`)).default,
    testimonials: (await import(`../locales/${locale}/testimonials.json`))
      .default,
    footer: (await import(`../locales/${locale}/footer.json`)).default,
  };

  return {
    locale,
    messages,
  };
});
