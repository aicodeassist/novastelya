import type { SeoContext } from "@/seo/types/seo.types";
import { buildTitle, buildDescription } from "../core";
import { SITE_NAME } from "@/seo/constants/site";

import { getCityPhrase } from "../../content/city-copy";

export function getHomeMetadata(ctx: SeoContext) {
  const { city, locale } = ctx;
  const isUk = locale === "uk";
  
  if (city) {
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

  return {
    title: buildTitle(
      isUk
        ? `Натяжні стелі в Україні — ціна за м² з монтажем, фото, гарантія 10 років`
        : `Натяжные потолки в Украине — цена за м² с монтажом, фото, гарантия 10 лет`
    ),
    description: buildDescription(
      isUk
        ? `Професійний монтаж натяжних стель по всій Україні. Найвигідніші ціни за м² з установкою, офіційна гарантія 10 років, велике портфоліо робіт. Безкоштовний замір.`
        : `Профессиональный монтаж натяжных потолков по всей Украине. Самые выгодные цены за м² с установкой, официальная гарантия 10 лет, большое портфолио работ. Закажите бесплатный замер.`
    ),
    ogImageSlug: "home",
  };
}
