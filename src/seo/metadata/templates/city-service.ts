import type { SeoContext } from "@/seo/types/seo.types";
import { buildTitle, buildDescription } from "../core";
import { getServiceBySlug } from "@/config/services.config";

import { getCityPhrase } from "../../content/city-copy";

export function getCityServiceMetadata(ctx: SeoContext) {
  const { pageType, city, locale } = ctx;
  const isUk = locale === "uk";
  
  const service = getServiceBySlug(pageType);
  const serviceName = service ? service[locale].title : "";
  
  if (!city) {
    return {
      title: buildTitle(serviceName),
      description: buildDescription(""),
      ogImageSlug: pageType as string,
    };
  }

  const cityInCity = getCityPhrase(city.slug, locale);
  const cityPhone = city.phone;

  return {
    title: buildTitle(
      isUk
        ? `${serviceName} ${cityInCity} — ціна за м², фото, монтаж під ключ`
        : `${serviceName} ${cityInCity} — цена за м², фото, монтаж под ключ`
    ),
    description: buildDescription(
      isUk
        ? `${serviceName} ${cityInCity} під ключ від виробника. Ціна за м² з установкою, монтаж за 1 день, реальні фото робіт, гарантія 10 років. ☎ Безкоштовний замір: ${cityPhone}`
        : `${serviceName} ${cityInCity} под ключ от производителя. Цена за м² с установкой, монтаж за 1 день, реальные фото работ, гарантия 10 лет. ☎ Бесплатный замер: ${cityPhone}`
    ),
    ogImageSlug: `${pageType}-${city.slug}`,
  };
}
