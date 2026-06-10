import citiesJson from "@/config/cities.json";

export type CityConfig = {
  slug: string;
  uk: string;                    // Назва міста українською
  ru: string;                    // Назва міста російською
  region: string;                // ISO код регіону (UA-30)
  active: boolean;               // false = місто не генерується
  isPrimary?: boolean;           // Головний офіс
  phone: string;
  phone0800?: string;            // Безкоштовний номер
  address: string;
  addressRu: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  priceModifier: number;         // 1.0 = базова ціна
  landmarks: string[];           // ЖК для GEO/AEO контенту
  officeHours: string;
  managerId?: string;            // ID менеджера для Schema
};

export const cities: CityConfig[] = citiesJson as CityConfig[];

// Build-time validation to prevent routing conflicts with static routes
const RESERVED_SLUGS = ["prices", "faq", "portfolio", "blog", "contacts", "about", "api", "admin", "ru", "uk", "not-found", "_next", "static", "favicon.ico"];
for (const city of cities) {
  if (RESERVED_SLUGS.includes(city.slug.toLowerCase())) {
    throw new Error(`Routing Conflict: City slug "${city.slug}" overlaps with a reserved static path!`);
  }
}

// Активні міста — використовується в generateStaticParams
export const activeCities = cities.filter(c => c.active);
export type CitySlug = string;

export function getCityBySlug(slug: string | undefined): CityConfig | null {
  if (!slug) return null;
  return cities.find(c => c.slug === slug) ?? null;
}
