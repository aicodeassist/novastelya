import type { CityConfig } from "@/config/geo-matrix";
import type { Locale } from "@/config/locales.config";

export const CITY_PHRASES: Record<string, Record<Locale, string>> = {
  kyiv:          { uk: "у Києві",       ru: "в Киеве" },
  dnipro:        { uk: "у Дніпрі",      ru: "в Днепре" },
  kharkiv:       { uk: "у Харкові",     ru: "в Харькове" },
  lviv:          { uk: "у Львові",      ru: "во Львове" },
  odesa:         { uk: "в Одесі",       ru: "в Одессе" },
  zaporizhzhia:  { uk: "у Запоріжжі",   ru: "в Запорожье" },
};

export function getCityPhrase(citySlug: string, locale: Locale): string {
  return CITY_PHRASES[citySlug]?.[locale] ?? "";
}

export function buildCityServiceH1(
  serviceTitle: string,
  city: CityConfig | null,
  locale: Locale,
  price: number
): string {
  if (!city) {
    return locale === "uk"
      ? `${serviceTitle} — від ${price} грн/м²`
      : `${serviceTitle} — от ${price} грн/м²`;
  }

  const phrase = getCityPhrase(city.slug, locale);
  return locale === "uk"
    ? `${serviceTitle} ${phrase} — від ${price} грн/м²`
    : `${serviceTitle} ${phrase} — от ${price} грн/м²`;
}

export function buildCTAText(city: CityConfig | null, locale: Locale): string {
  if (!city) {
    return locale === "uk" ? "Замовити безкоштовний замір" : "Заказать бесплатный замер";
  }
  const phrase = getCityPhrase(city.slug, locale);
  return locale === "uk"
    ? `Замовити замір ${phrase}`
    : `Заказать замер ${phrase}`;
}
