import React from "react";
import { Metadata } from "next";
import { getCityBySlug, CityConfig } from "@/config/geo-matrix";
import { generatePageMetadata, SchemaScript, buildFAQSchema } from "@/seo";
import { Badge } from "@/components/ui";
import styles from "./FaqPageTemplate.module.css";
import { getActiveCityFromParams, getActiveLocaleFromParams } from "@/lib/route-resolver";

type Props = {
  cityConfig?: CityConfig | null;
  locale?: "uk" | "ru";
  params?: any;
};

export function getFaqMetadataGenerator() {
  return async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    const resolvedParams = await params;
    const city = getActiveCityFromParams(resolvedParams);
    const locale = getActiveLocaleFromParams(resolvedParams);
    return generatePageMetadata({
      page: "faq",
      city: city,
      locale: locale,
    });
  };
}

export async function FaqPageTemplate({ cityConfig, locale: propLocale, params }: Props) {
  let locale: "uk" | "ru" = propLocale || "uk";
  let city: CityConfig | null = cityConfig || null;

  if (params) {
    const resolvedParams = await params;
    const rawLocale = resolvedParams.locale;
    const rawCity = resolvedParams.city;

    const cityFromLocale = getCityBySlug(rawLocale);
    if (cityFromLocale && cityFromLocale.active) {
      city = cityFromLocale;
      locale = "uk";
    } else {
      city = getCityBySlug(rawCity) || null;
      locale = rawLocale === "ru" ? "ru" : "uk";
    }
  }

  const isUk = locale === "uk";

  const cityName = city ? city[locale] : "";
  const citySuffix = city ? (isUk ? ` у ${city.uk}` : ` в ${city.ru}`) : "";

  const faqs = [
    {
      q: isUk 
        ? `Які натяжні стелі найкраще обрати для кухні${citySuffix}?` 
        : `Какие натяжные потолки лучше всего выбрать для кухни${citySuffix}?`,
      a: isUk
        ? "Для кухні найкраще обрати ПВХ стелі (матові, глянцеві або сатинові). Вони не вбирають жир та запахи, легко миються звичайним мильним розчином і надійно захищають від затоплення зверху."
        : "Для кухни лучше всего выбрать ПВХ потолки (матовые, глянцевые или сатиновые). Они не впитывают жир и запахи, легко моются обычным мыльным раствором и надежно защищают от затопления сверху.",
    },
    {
      q: isUk
        ? `Чи шкідливі натяжні стелі для здоров'я?`
        : `Вредны ли натяжные потолки для здоровья?`,
      a: isUk
        ? "Ні, наші полотна сертифіковані за європейськими екологічними стандартами. Вони не мають неприємного запаху, гіпоалергенні та абсолютно безпечні для встановлення у спальнях та дитячих кімнатах."
        : "Нет, наши полотна сертифицированы по европейским экологическим стандартам. Они не имеют неприятного запаха, гипоаллергенны и абсолютно безопасны для установки в спальнях и детских комнатах.",
    },
    {
      q: isUk
        ? `Чи потрібно виносити меблі з кімнати перед монтажем${citySuffix}?`
        : `Нужно ли выносить мебель из комнаты перед монтажом${citySuffix}?`,
      a: isUk
        ? "Повністю виносити меблі не обов'язково. Досить забезпечити вільний доступ по периметру стін (відсунути меблі до центру кімнати), а також прибрати кімнатні рослини, техніку та дрібні речі."
        : "Полностью выносить мебель не обязательно. Достаточно обеспечить свободный доступ по периметру стен (отодвинуть мебель к центру комнаты), а также убрать комнатные растения, технику и мелкие вещи.",
    }
  ];

  const faqSchema = buildFAQSchema(faqs);

  return (
    <>
      <SchemaScript schema={faqSchema} />
      <section className={styles.faqSec}>
        <div className="container">
          <div className={styles.header}>
            <Badge variant="gold">
              {city ? `${cityName} • FAQ` : "FAQ"}
            </Badge>
            <h1 className={`${styles.title} text-glow`}>
              {isUk ? `Часті Запитання про Натяжні Стелі${citySuffix}` : `Частые Вопросы о Натяжных Потолках${citySuffix}`}
            </h1>
            <p className={styles.subtitle}>
              {isUk
                ? "Знайдіть відповіді на найпопулярніші запитання про вибір, монтаж та догляд за натяжними стелями."
                : "Найдите ответы на самые популярные вопросы о выборе, монтаже и уходе за натяжными потолками."}
            </p>
          </div>

          <div className={styles.faqList}>
            {faqs.map((faq, index) => (
              <details key={index} className={styles.faqDetails}>
                <summary className={styles.faqSummary}>{faq.q}</summary>
                <div className={styles.faqAnswer}>{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
