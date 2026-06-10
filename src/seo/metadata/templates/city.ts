import type { SeoContext } from "@/seo/types/seo.types";
import { buildTitle, buildDescription } from "../core";

import { getCityPhrase } from "../../content/city-copy";

export function getCityMetadata(ctx: SeoContext) {
  const { city, locale } = ctx;
  const isUk = locale === "uk";
  
  if (!city) {
    return {
      title: buildTitle(isUk ? "Натяжні стелі" : "Натяжные потолки"),
      description: buildDescription(""),
      ogImageSlug: "home",
    };
  }

  const cityInCity = getCityPhrase(city.slug, locale);
  const cityPhone = city.phone;

  return {
    title: buildTitle(
      isUk 
        ? `Натяжні стелі ${cityInCity} — ціна за м² з монтажем, фото, встановлення під ключ`
        : `Натяжные потолки ${cityInCity} — цена за м² с монтажом, фото, установка под ключ`
    ),
    description: buildDescription(
      isUk
        ? `Встановлення натяжних стель будь-якої складності ${cityInCity}. Ціна за м² з монтажем, встановлення за 1 день, офіційна гарантія 10 років. ☎ Безкоштовний замір: ${cityPhone}`
        : `Установка натяжных потолков любой сложности ${cityInCity}. Цена за м² с монтажом, установка за 1 день, официальная гарантия 10 лет. ☎ Бесплатный замер: ${cityPhone}`
    ),
    ogImageSlug: `home-${city.slug}`,
  };
}
