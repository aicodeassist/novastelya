import type { SeoContext } from "@/seo/types/seo.types";
import { buildTitle, buildDescription } from "../core";

import { getCityPhrase } from "../../content/city-copy";

export function getFaqMetadata(ctx: SeoContext) {
  const { city, locale } = ctx;
  const isUk = locale === "uk";
  
  if (city) {
    const cityInCity = getCityPhrase(city.slug, locale);
    return {
      title: buildTitle(
        isUk
          ? `Часті запитання про натяжні стелі ${cityInCity} — відповіді експертів`
          : `Частые вопросы о натяжных потолках ${cityInCity} — ответы экспертов`
      ),
      description: buildDescription(
        isUk
          ? `Відповіді на популярні запитання клієнтів ${cityInCity} про натяжні стелі: вибір матеріалу, етапи монтажу, гарантії та догляд.`
          : `Ответы на популярные вопросы клиентов ${cityInCity} о натяжных потолках: выбор материала, этапы монтажа, гарантии и уход.`
      ),
      ogImageSlug: `faq-${city.slug}`,
    };
  }

  return {
    title: buildTitle(
      isUk
        ? "Часті запитання про натяжні стелі — відповіді експертів"
        : "Частые вопросы о натяжных потолках — ответы экспертов"
    ),
    description: buildDescription(
      isUk
        ? "Все, що ви хотіли знати про натяжні стелі. Корисні поради від технологів, відповіді на питання щодо вибору матеріалів, монтажу та догляду."
        : "Все, что вы хотели знать о натяжных потолках. Полезные советы от технологов, ответы на вопросы по выбору материалов, монтажу и уходу."
    ),
    ogImageSlug: "faq",
  };
}
