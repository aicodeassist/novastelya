import { WithContext, Service } from "schema-dts";
import { CityConfig } from "@/config/geo-matrix";
import { ServiceConfig } from "@/config/services.config";
import { SITE_URL, SITE_NAME } from "@/seo/constants/site";

type BuildServiceSchemaParams = {
  service: ServiceConfig;
  city?: CityConfig | null;
  locale: "uk" | "ru";
};

export function buildService({
  service,
  city,
  locale,
}: BuildServiceSchemaParams): WithContext<Service> {
  const serviceName = service[locale].title;
  const cityName = city ? city[locale] : "";
  const finalTitle = city ? `${serviceName} у ${cityName}` : serviceName;
  
  const basePrice = service.basePrice;
  const finalPrice = city ? Math.round(basePrice * city.priceModifier) : basePrice;

  const urlPath = city 
    ? `/${city.slug}/${service.slug}` 
    : `/${service.slug}`;
  const canonicalUrl = `${SITE_URL}${locale === "ru" ? "/ru" : ""}${urlPath}`;

  const schema: WithContext<Service> = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": finalTitle,
    "description": service[locale].description,
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": SITE_NAME,
      "url": SITE_URL,
    },
    "offers": {
      "@type": "Offer",
      "price": finalPrice,
      "priceCurrency": "UAH",
      "url": canonicalUrl,
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": finalPrice,
        "priceCurrency": "UAH",
        "unitText": "MTK",
      },
    },
  };

  if (city) {
    schema.areaServed = {
      "@type": "City",
      "name": cityName,
    };
  }

  return schema;
}
export { buildService as buildServiceSchema };
