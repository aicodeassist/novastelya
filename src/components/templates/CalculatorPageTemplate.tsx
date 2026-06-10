import React from "react";
import { Metadata } from "next";
import { Calculator } from "@/components/sections/Calculator/Calculator";
import { generatePageMetadata, SchemaScript } from "@/seo";
import { getCityBySlug, CityConfig } from "@/config/geo-matrix";
import { getActiveCityFromParams, getActiveLocaleFromParams } from "@/lib/route-resolver";
import styles from "./CalculatorPageTemplate.module.css";
import Link from "next/link";

type Props = {
  cityConfig?: CityConfig | null;
  locale?: "uk" | "ru";
  params?: any;
};

export function getCalculatorMetadataGenerator() {
  return async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    const resolvedParams = await params;
    const city = getActiveCityFromParams(resolvedParams);
    const locale = getActiveLocaleFromParams(resolvedParams);
    return generatePageMetadata({
      page: "calculator",
      city: city,
      locale: locale,
    });
  };
}

export async function CalculatorPageTemplate({ cityConfig, locale: propLocale, params }: Props) {
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
  const citySlug = city ? city.slug : null;
  const citySuffix = city ? (isUk ? ` у ${city.uk}` : ` в ${city.ru}`) : "";
  
  const navPrefix = locale === "ru" ? "/ru" : "";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": isUk ? `Калькулятор вартості натяжних стель${citySuffix}` : `Калькулятор стоимости натяжных потолков${citySuffix}`,
    "description": isUk
      ? `Онлайн калькулятор натяжних стель${citySuffix}. Розрахуйте точну вартість робіт з урахуванням матеріалів, профілів та освітлення.`
      : `Онлайн калькулятор натяжных потолков${citySuffix}. Рассчитайте точную стоимость работ с учетом материалов, профилей и освещения.`,
    "publisher": {
      "@type": "Organization",
      "name": "NOVA STELYA"
    }
  };

  return (
    <>
      <SchemaScript schema={websiteSchema} />

      <section className={styles.calculatorPage}>
        <div className="container">
          {/* Breadcrumbs */}
          <nav className={styles.breadcrumbs} aria-label={isUk ? "Навігація" : "Навигация"}>
            <Link href={navPrefix || "/"}>{isUk ? "Головна" : "Главная"}</Link>
            <span className={styles.separator}>/</span>
            {city && (
              <>
                <Link href={`${navPrefix}/${city.slug}`}>{city[locale]}</Link>
                <span className={styles.separator}>/</span>
              </>
            )}
            <span className={styles.active}>{isUk ? "Калькулятор" : "Калькулятор"}</span>
          </nav>

          {/* Header */}
          <header className={styles.header}>
            <h1 className={`${styles.title} text-glow`}>
              {isUk ? `Калькулятор Натяжних Стель${citySuffix}` : `Калькулятор Натяжных Потолков${citySuffix}`}
            </h1>
            <p className={styles.subtitle}>
              {isUk
                ? "Дайте відповіді на 7 простих запитань та отримайте детальний кошторис вашої майбутньої стелі з точністю до 99%."
                : "Ответьте на 7 простых вопросов и получите детальную смету вашего будущего потолка с точностью до 99%."}
            </p>
          </header>

          {/* Embedded Calculator */}
          <div className={styles.calcContainer}>
            <Calculator locale={locale} defaultCitySlug={citySlug} />
          </div>

          {/* SEO & Pricing Explanation (EEAT) */}
          <footer className={styles.seoFooter}>
            <h2 className={styles.seoTitle}>
              {isUk ? "Як розраховується вартість натяжної стелі?" : "Как рассчитывается стоимость натяжного потолка?"}
            </h2>
            <div className={styles.seoGrid}>
              <div className={styles.seoTextCol}>
                <p>
                  {isUk
                    ? "Підсумкова вартість проекту формується з кількох ключових факторів. Перш за все, це площа та периметр кімнати. Площа визначає витрату самого полотна, тоді як периметр визначає довжину монтажного профілю (багета)."
                    : "Итоговая стоимость проекта формируется из нескольких ключевых факторов. Прежде всего, это площадь и периметр комнаты. Площадь определяет расход самого полотна, в то время как периметр определяет длину монтажного профиля (багета)."}
                </p>
                <p>
                  {isUk
                    ? "Другий важливий компонент — тип полотна. Матові та сатинові ПВХ-плівки є найбільш бюджетними та практичними, в той час як тканинні та акустичні безшовні полотна належать до преміум сегменту."
                    : "Второй важный компонент — тип полотна. Матовые и сатиновые ПВХ-пленки являются наиболее бюджетными и практичными, в то время как тканевые и акустические бесшовные полотна относятся к премиум сегменту."}
                </p>
              </div>
              <div className={styles.seoTextCol}>
                <p>
                  {isUk
                    ? "Сучасне освітлення (магнітні трекові системи, вбудовані світлові лінії або контурне підсвічування) та складність профілю (тіньовий EuroKraab або безщілинний монтаж) також додають цінності та формують кінцеву естетику приміщення."
                    : "Современное освещение (магнитные трековые системы, встроенные световые линии или контурная подсветка) и сложность профиля (теневой EuroKraab или бесщелевой монтаж) также добавляют ценности и формируют конечную эстетику помещения."}
                </p>
                <p>
                  {isUk
                    ? "У нашому калькуляторі враховані всі актуальні технологічні рішення 2026 року та регіональні коефіцієнти для великих міст України (Дніпро, Одеса, Київ тощо), щоб ви отримали максимально точний результат."
                    : "В нашем калькуляторе учтены все актуальные технологические решения 2026 года и региональные коэффициенты для крупных городов Украины (Днепр, Одесса, Киев и т.д.), чтобы вы получили максимально точный результат."}
                </p>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </>
  );
}
