import { WithContext, HomeAndConstructionBusiness } from "schema-dts";
import { CityConfig } from "@/config/geo-matrix";
import { SITE_URL, SITE_NAME } from "@/seo/constants/site";

export function buildLocalBusiness(
  city: CityConfig,
  locale: "uk" | "ru"
): WithContext<HomeAndConstructionBusiness> {
  const cityName = city[locale];
  const addressStreet = locale === "uk" ? city.address : city.addressRu;

  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/${city.slug}/#business`,
    "name": `${SITE_NAME} ${cityName}`,
    "url": `${SITE_URL}${locale === "ru" ? "/ru" : ""}/${city.slug}`,
    "image": `${SITE_URL}/og/office-${city.slug}.jpg`,
    "telephone": city.phone,
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": addressStreet,
      "addressLocality": cityName,
      "addressRegion": city.region,
      "addressCountry": "UA",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": city.coordinates.lat,
      "longitude": city.coordinates.lon,
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": city.slug === "kyiv" ? "20:00" : "19:00",
    },
    "areaServed": {
      "@type": "City",
      "name": cityName,
      "containsPlace": city.landmarks.map((lm) => ({
        "@type": "Residence",
        "name": lm,
      })),
    },
  };
}
export { buildLocalBusiness as buildLocalBusinessSchema };
