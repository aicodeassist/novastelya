import { buildCanonicalUrl } from "@/seo/urls/build-canonical";
import { SITEMAP_CONFIG } from "../config";

export function getStaticRoutes() {
  const locales = ["uk", "ru"] as const;
  const staticPages = [
    { page: "home", config: SITEMAP_CONFIG.home },
    { page: "prices", config: SITEMAP_CONFIG.prices },
    { page: "faq", config: SITEMAP_CONFIG.faq },
    { page: "portfolio", config: SITEMAP_CONFIG.portfolio },
    { page: "blog", config: SITEMAP_CONFIG.blog },
    { page: "contacts", config: SITEMAP_CONFIG.contacts },
    { page: "about", config: SITEMAP_CONFIG.about },
  ] as const;

  const now = new Date();
  
  return locales.flatMap((locale) =>
    staticPages.map(({ page, config }) => ({
      url: buildCanonicalUrl(page, locale),
      lastModified: now,
      changeFrequency: config.changeFrequency,
      priority: config.priority,
    }))
  );
}
