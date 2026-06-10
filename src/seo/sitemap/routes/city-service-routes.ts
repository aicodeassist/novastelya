import { buildCanonicalUrl } from "@/seo/urls/build-canonical";
import { activeCities } from "@/config/geo-matrix";
import { services } from "@/config/services.config";
import { SITEMAP_CONFIG } from "../config";

export function getCityServiceRoutes() {
  const locales = ["uk", "ru"] as const;
  const config = SITEMAP_CONFIG["city-service"];
  const now = new Date();

  return locales.flatMap((locale) =>
    activeCities.flatMap((city) =>
      services.map((service) => ({
        url: buildCanonicalUrl(service.slug, locale, city.slug),
        lastModified: now,
        changeFrequency: config.changeFrequency,
        priority: config.priority,
      }))
    )
  );
}
