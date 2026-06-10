import React from "react";
import type { CityConfig } from "@/config/geo-matrix";
import type { Locale } from "@/config/locales.config";

type GeoMetaTagsProps = {
  city: CityConfig;
  locale: Locale;
};

export function GeoMetaTags({ city, locale }: GeoMetaTagsProps) {
  const placename = city[locale];
  const position = `${city.coordinates.lat};${city.coordinates.lon}`;
  const icbm = `${city.coordinates.lat}, ${city.coordinates.lon}`;

  return (
    <>
      <meta name="geo.region" content={city.region} />
      <meta name="geo.placename" content={placename} />
      <meta name="geo.position" content={position} />
      <meta name="ICBM" content={icbm} />
    </>
  );
}

export function getLocalSeoMarker(city: CityConfig | null, locale: Locale): string {
  if (!city) return locale === "uk" ? "по всій Україні" : "по всей Украине";
  return locale === "uk" ? `у ${city.uk}` : `в ${city.ru}`;
}
export { GeoMetaTags as GeoTags };
export { getLocalSeoMarker as getMarker };
