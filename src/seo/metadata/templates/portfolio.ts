import type { SeoContext } from "@/seo/types/seo.types";
import { buildTitle, buildDescription } from "../core";

import { getCityPhrase } from "../../content/city-copy";

export function getPortfolioMetadata(ctx: SeoContext) {
  const { slug, city, locale } = ctx;
  const isUk = locale === "uk";
  
  if (slug) {
    return {
      title: buildTitle(
        isUk
          ? `Проект ${slug} — фото виконаної натяжної стелі`
          : `Проект ${slug} — фото выполненного натяжного потолка`
      ),
      description: buildDescription(
        isUk
          ? `Деталі та фотографії виконаного проекту натяжної стелі: ${slug}. Опис рішень та матеріалів.`
          : `Детали и фотографии выполненного проекта натяжного потолка: ${slug}. Описание решений и материалов.`
      ),
      ogImageSlug: `portfolio-${slug}`,
    };
  }

  if (city) {
    const cityInCity = getCityPhrase(city.slug, locale);
    return {
      title: buildTitle(
        isUk
          ? `Наші роботи ${cityInCity} — фотографії готових натяжних стель`
          : `Наши работы ${cityInCity} — фотографии готовых натяжных потолков`
      ),
      description: buildDescription(
        isUk
          ? `Портфоліо виконаних проектів натяжних стель ${cityInCity}. Реальні фото встановлених стель у квартирах та будинках з описом рішень.`
          : `Портфолио выполненных проектов натяжных потолков ${cityInCity}. Реальные фото установленных потолков в квартирах и домах с описанием решений.`
      ),
      ogImageSlug: `portfolio-${city.slug}`,
    };
  }

  return {
    title: buildTitle(
      isUk
        ? "Портфоліо натяжних стель — фото виконаних робіт"
        : "Портфолио натяжных потолков — фото выполненных работ"
    ),
    description: buildDescription(
      isUk
        ? "Галерея виконаних робіт по встановленню натяжних стель по всій Україні. Фотографії тіньових, світлових та багаторівневих стель в інтер'єрі."
        : "Галерея выполненных работ по установке натяжных потолков по всей Украине. Фотографии теневых, световых и двухуровневых потолков в интерьере."
    ),
    ogImageSlug: "portfolio",
  };
}
