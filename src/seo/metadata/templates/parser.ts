import type { SeoContext } from "@/seo/types/seo.types";
import { getCityPhrase } from "../../content/city-copy";
import { getServiceBySlug } from "@/config/services.config";
import { SITE_NAME } from "../../constants/site";

/**
 * Replaces placeholders in template string with actual context values.
 * Placeholders:
 * - {city}: City name in selected locale (e.g., "Київ" / "Киев")
 * - {cityPhrase}: Prepositional city case (e.g., "у Києві" / "в Киеве")
 * - {cityPhone}: Phone number for the city, or general phone
 * - {service}: Service name in selected locale (e.g., "Матові натяжні стелі")
 * - {siteName}: Brandsite name (NOVA STELYA)
 */
export function applyTemplatePlaceholders(templateStr: string, ctx: SeoContext): string {
  if (!templateStr) return "";

  const { city, locale, pageType } = ctx;
  const isUk = locale === "uk";

  let cityText = "";
  let cityPhraseText = "";
  let cityPhoneText = "+380 44 000-00-00"; // fallback

  if (city) {
    cityText = isUk ? city.uk : city.ru;
    cityPhraseText = getCityPhrase(city.slug, locale);
    cityPhoneText = city.phone;
  } else {
    cityText = isUk ? "в Україні" : "в Украине";
    cityPhraseText = isUk ? "в Україні" : "в Украине";
  }

  let serviceText = "";
  const service = getServiceBySlug(pageType);
  if (service) {
    serviceText = isUk ? service.uk.title : service.ru.title;
  }

  return templateStr
    .replace(/{city}/g, cityText)
    .replace(/{cityPhrase}/g, cityPhraseText)
    .replace(/{cityPhone}/g, cityPhoneText)
    .replace(/{service}/g, serviceText)
    .replace(/{siteName}/g, SITE_NAME);
}
