import type { SeoContext } from "@/seo/types/seo.types";
import { buildTitle, buildDescription } from "../core";

import { getCityPhrase } from "../../content/city-copy";

export function getPricesMetadata(ctx: SeoContext) {
  const { city, locale } = ctx;
  const isUk = locale === "uk";
  
  if (city) {
    const cityInCity = getCityPhrase(city.slug, locale);
    const cityPhone = city.phone;
    return {
      title: buildTitle(
        isUk
          ? `Ціни на натяжні стелі ${cityInCity} — вартість за м² з установкою під ключ`
          : `Цены на натяжные потолки ${cityInCity} — стоимость за м² с установкой под ключ`
      ),
      description: buildDescription(
        isUk
          ? `Актуальний прайс-лист на натяжні стелі ${cityInCity}. Ціна за м² з урахуванням монтажу, матеріалу та профілю. Розрахуйте вартість робіт на калькуляторі!`
          : `Актуальный прайс-лист на натяжные потолки ${cityInCity}. Цена за м² с учетом монтажа, материала и профиля. Рассчитайте стоимость работ на калькуляторе!`
      ),
      ogImageSlug: `prices-${city.slug}`,
    };
  }

  return {
    title: buildTitle(
      isUk
        ? "Ціни на натяжні стелі в Україні — вартість за м² з установкою під ключ"
        : "Цены на натяжные потолки в Украине — стоимость за м² с установкой под ключ"
    ),
    description: buildDescription(
      isUk
        ? "Прайс-лист на всі види натяжних стель в Україні. Порівняння вартості різних матеріалів та комплектуючих. Безкоштовний виїзд замірника."
        : "Прайс-лист на все виды натяжных потолков в Украине. Сравнение стоимости различных материалов и комплектующих. Бесплатный выезд замерщика."
    ),
    ogImageSlug: "prices",
  };
}
