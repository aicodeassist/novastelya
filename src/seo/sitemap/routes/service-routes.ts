import { buildCanonicalUrl } from "@/seo/urls/build-canonical";
import { services } from "@/config/services.config";
import { SITEMAP_CONFIG } from "../config";

export function getServiceRoutes() {
  const locales = ["uk", "ru"] as const;
  const config = SITEMAP_CONFIG.service;
  const now = new Date();

  return locales.flatMap((locale) =>
    services.map((service) => ({
      url: buildCanonicalUrl(service.slug, locale),
      lastModified: now,
      changeFrequency: config.changeFrequency,
      priority: config.priority,
    }))
  );
}
