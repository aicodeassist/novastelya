import React from "react";
import { Metadata } from "next";
import { getCityBySlug, CityConfig } from "@/config/geo-matrix";
import { services } from "@/config/services.config";
import { generatePageMetadata, SchemaScript } from "@/seo";
import { Badge, Button, Card } from "@/components/ui";
import Link from "next/link";
import styles from "./PricesPageTemplate.module.css";
import { getActiveCityFromParams, getActiveLocaleFromParams } from "@/lib/route-resolver";

type Props = {
  cityConfig?: CityConfig | null;
  locale?: "uk" | "ru";
  params?: any;
};

export function getPricesMetadataGenerator() {
  return async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    const resolvedParams = await params;
    const city = getActiveCityFromParams(resolvedParams);
    const locale = getActiveLocaleFromParams(resolvedParams);
    return generatePageMetadata({
      page: "prices",
      city: city,
      locale: locale,
    });
  };
}

export async function PricesPageTemplate({ cityConfig, locale: propLocale, params }: Props) {
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

  // 1. Build Product/Offer Schema
  const pricesSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": isUk ? `Ціни на натяжні стелі${citySuffix}` : `Цены на натяжные потолки${citySuffix}`,
    "description": isUk 
      ? `Прайс-лист на встановлення натяжних стель${citySuffix} від компанії NOVA STELYA.`
      : `Прейскурант на установку натяжных потолков${citySuffix} от компании NOVA STELYA.`,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "UAH",
      "lowPrice": city ? Math.round(280 * city.priceModifier) : 280,
      "highPrice": city ? Math.round(1500 * city.priceModifier) : 1500,
      "offerCount": services.length,
    }
  };

  const navPrefix = locale === "ru" ? "/ru" : "";

  return (
    <>
      <SchemaScript schema={pricesSchema} />
      <section className={styles.pricesSec}>
        <div className="container">
          <div className={styles.header}>
            <Badge variant="gold">
              {city ? `${cityName} • ${isUk ? "Локальний прайс" : "Локальный прайс"}` : (isUk ? "Вся Україна" : "Вся Украина")}
            </Badge>
            <h1 className={`${styles.title} text-glow`}>
              {isUk ? `Ціни на Натяжні Стелі${citySuffix}` : `Цены на Натяжные Потолки${citySuffix}`}
            </h1>
            <p className={styles.subtitle}>
              {isUk 
                ? "Актуальна вартість матеріалів та монтажних робіт за 1 м². Безкоштовний виїзд замірника."
                : "Актуальная стоимость материалов и монтажных работ за 1 м². Бесплатный выезд замерщика."}
            </p>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{isUk ? "Послуга / Матеріал" : "Услуга / Материал"}</th>
                  <th>{isUk ? "Категорія" : "Категория"}</th>
                  <th>{isUk ? "Ціна з монтажем" : "Цена с монтажом"}</th>
                  <th>{isUk ? "Дія" : "Действие"}</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => {
                  const localPrice = city ? Math.round(service.basePrice * city.priceModifier) : service.basePrice;
                  return (
                    <tr key={service.slug}>
                      <td>
                        <strong>{service[locale].title}</strong>
                        <p className={styles.tableDesc}>{service[locale].description}</p>
                      </td>
                      <td>
                        <Badge variant="outline">
                          {service.category === "materials" && (isUk ? "Матеріали" : "Материалы")}
                          {service.category === "designs" && (isUk ? "Конструкція" : "Конструкция")}
                          {service.category === "lighting" && (isUk ? "Освітлення" : "Освещение")}
                          {service.category === "rooms" && (isUk ? "Кімната" : "Комната")}
                        </Badge>
                      </td>
                      <td>
                        <span className={styles.price}>
                          {isUk ? "від" : "от"} <strong>{localPrice}</strong> грн/м²
                        </span>
                      </td>
                      <td>
                        <Link href={`${navPrefix}${city ? `/${city.slug}` : ""}/${service.slug}`}>
                          <Button variant="secondary" size="sm">
                            {isUk ? "Детальніше" : "Подробнее"}
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
