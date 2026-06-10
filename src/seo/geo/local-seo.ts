import type { CityConfig } from "@/config/geo-matrix";
import { activeCities } from "@/config/geo-matrix";

export function buildServiceArea(city: CityConfig) {
  return [
    { "@type": "City", "name": city.uk },
    ...(city.landmarks ? city.landmarks.map((lm) => ({ "@type": "AdministrativeArea", "name": lm })) : []),
  ];
}

export function buildNationalServiceArea() {
  return activeCities.map((city) => ({
    "@type": "City",
    "name": city.uk,
    "addressRegion": city.region,
  }));
}
