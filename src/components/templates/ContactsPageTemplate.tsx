import React from "react";
import { Metadata } from "next";
import { activeCities, getCityBySlug, CityConfig } from "@/config/geo-matrix";
import { generatePageMetadata, SchemaScript } from "@/seo";
import { Badge, Card, Button, Input } from "@/components/ui";
import styles from "./ContactsPageTemplate.module.css";
import { getActiveCityFromParams, getActiveLocaleFromParams } from "@/lib/route-resolver";

type Props = {
  cityConfig?: CityConfig | null;
  locale?: "uk" | "ru";
  params?: any;
};

export function getContactsMetadataGenerator() {
  return async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    const resolvedParams = await params;
    const city = getActiveCityFromParams(resolvedParams);
    const locale = getActiveLocaleFromParams(resolvedParams);

    return generatePageMetadata({
      page: "contacts",
      city: city,
      locale: locale,
    });
  };
}

export async function ContactsPageTemplate({ cityConfig, locale: propLocale, params }: Props) {
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

  // Build Schema: if specific city, build single business schema; otherwise graph of all offices
  const contactsSchema = city
    ? {
        "@context": "https://schema.org",
        "@type": "HomeAndConstructionBusiness",
        "@id": `https://novastelya.com/${city.slug}/#business`,
        "name": `NOVA STELYA ${city[locale]}`,
        "telephone": city.phone,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": isUk ? city.address : city.addressRu,
          "addressLocality": city[locale],
          "addressCountry": "UA",
        },
      }
    : {
        "@context": "https://schema.org",
        "@graph": activeCities.map((c) => ({
          "@type": "HomeAndConstructionBusiness",
          "@id": `https://novastelya.com/${c.slug}/#business`,
          "name": `NOVA STELYA ${c[locale]}`,
          "telephone": c.phone,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": isUk ? c.address : c.addressRu,
            "addressLocality": c[locale],
            "addressCountry": "UA",
          },
        })),
      };

  // Filter or prioritize the active city
  const prioritizedCities = city
    ? [city, ...activeCities.filter((c) => c.slug !== city.slug)]
    : activeCities;

  return (
    <>
      <SchemaScript schema={contactsSchema} />
      <section className={styles.contactsSec}>
        <div className="container">
          <div className={styles.header}>
            <Badge variant="gold">{isUk ? "Контакти" : "Контакты"}</Badge>
            <h1 className={`${styles.title} text-glow`}>
              {isUk 
                ? `Контакти NOVA STELYA${citySuffix}` 
                : `Контакты NOVA STELYA${citySuffix}`}
            </h1>
            <p className={styles.subtitle}>
              {city
                ? (isUk
                  ? `Зв'яжіться з представництвом компанії NOVA STELYA ${citySuffix} або залиште заявку на безкоштовний замір.`
                  : `Свяжитесь с представительством компании NOVA STELYA ${citySuffix} или оставьте заявку на бесплатный замер.`)
                : (isUk
                  ? "Зв'яжіться з нами будь-яким зручним для вас способом або завітайте до нашого офісу."
                  : "Свяжитесь с нами любым удобным для вас способом или посетите наш офис.")}
            </p>
          </div>

          <div className={styles.grid}>
            {/* Office details */}
            <div className={styles.officesList}>
              <h2 className={styles.subTitle}>
                {city 
                  ? (isUk ? `Представництво ${citySuffix}` : `Представительство ${citySuffix}`) 
                  : (isUk ? "Наші представництва" : "Наши представительства")}
              </h2>
              <div className={styles.cardsStack}>
                {prioritizedCities.map((c, idx) => {
                  const isCurrentCity = city && c.slug === city.slug;
                  return (
                    <Card 
                      key={c.slug} 
                      variant={isCurrentCity || (!city && c.isPrimary) ? "premium" : "default"} 
                      className={styles.officeCard}
                    >
                      {(isCurrentCity || (!city && c.isPrimary)) && (
                        <Badge variant="gold" className={styles.primaryBadge}>
                          {isCurrentCity 
                            ? (isUk ? "Ваше місто" : "Ваш город") 
                            : (isUk ? "Головний офіс" : "Главный офис")}
                        </Badge>
                      )}
                      <h3>{c[locale]}</h3>
                      <p>📍 {isUk ? c.address : c.addressRu}</p>
                      <p>📞 {c.phone}</p>
                      <p>⏱️ {c.officeHours}</p>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Quick contact form */}
            <div className={styles.formCol}>
              <Card variant="premium" className={styles.formCard}>
                <h2>{isUk ? "Швидкий зв'язок" : "Быстрая связь"}</h2>
                <p>{isUk ? "Залиште ваші контакти, і ми зателефонуємо вам за 5 хвилин." : "Оставьте ваши контакты, и мы перезвоним вам за 5 минут."}</p>
                <form className={styles.form}>
                  <Input label={isUk ? "Ваше ім'я" : "Ваше имя"} placeholder={isUk ? "Олександр" : "Александр"} required />
                  <Input type="tel" label={isUk ? "Телефон" : "Телефон"} placeholder="+38 (0__) ___-__-__" required />
                  <Button type="submit" variant="primary" fullWidth>
                    {isUk ? "Замовити дзвінок" : "Заказать звонок"}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
