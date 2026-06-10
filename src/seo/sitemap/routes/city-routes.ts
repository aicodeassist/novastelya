import { buildCanonicalUrl } from "@/seo/urls/build-canonical";
import { activeCities } from "@/config/geo-matrix";
import { SITEMAP_CONFIG } from "../config";

export function getCityRoutes() {
  const locales = ["uk", "ru"] as const;
  const now = new Date();
  
  const routes: any[] = [];

  // City Hubs
  locales.forEach((locale) => {
    activeCities.forEach((city) => {
      // 1. Hub
      routes.push({
        url: buildCanonicalUrl("home", locale, city.slug),
        lastModified: now,
        changeFrequency: SITEMAP_CONFIG.city.changeFrequency,
        priority: SITEMAP_CONFIG.city.priority,
      });

      // 2. Prices
      routes.push({
        url: buildCanonicalUrl("prices", locale, city.slug),
        lastModified: now,
        changeFrequency: SITEMAP_CONFIG.prices.changeFrequency,
        priority: SITEMAP_CONFIG.prices.priority,
      });

      // 3. FAQ
      routes.push({
        url: buildCanonicalUrl("faq", locale, city.slug),
        lastModified: now,
        changeFrequency: SITEMAP_CONFIG.faq.changeFrequency,
        priority: SITEMAP_CONFIG.faq.priority,
      });

      // 4. Contacts
      routes.push({
        url: buildCanonicalUrl("contacts", locale, city.slug),
        lastModified: now,
        changeFrequency: SITEMAP_CONFIG.contacts.changeFrequency,
        priority: SITEMAP_CONFIG.contacts.priority,
      });

      // 5. Portfolio
      routes.push({
        url: buildCanonicalUrl("portfolio", locale, city.slug),
        lastModified: now,
        changeFrequency: SITEMAP_CONFIG.portfolio.changeFrequency,
        priority: SITEMAP_CONFIG.portfolio.priority,
      });
    });
  });

  return routes;
}
