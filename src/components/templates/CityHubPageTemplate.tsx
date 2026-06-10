import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CityConfig } from "@/config/geo-matrix";
import { services } from "@/config/services.config";
import { generatePageMetadata, SchemaScript, buildLocalBusinessSchema, buildBreadcrumbSchema } from "@/seo";
import { Button, Card, Badge } from "@/components/ui";
import styles from "./CityHubPageTemplate.module.css";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Calculator } from "@/components/sections/Calculator/Calculator";

type CityHubProps = {
  cityConfig: CityConfig;
  locale: "uk" | "ru";
};

export async function CityHubPageTemplate({ cityConfig, locale }: CityHubProps) {
  const isUk = locale === "uk";
  const cityName = cityConfig[locale];
  
  // Fetch localized city name variations
  const tCities = await getTranslations({ locale, namespace: "cities" });
  const cityInCity = tCities(`${cityConfig.slug}.inCity`);
  
  // 1. Build local business schema
  const businessSchema = buildLocalBusinessSchema(cityConfig, locale);
  
  const navPrefix = locale === "ru" ? "/ru" : "";

  // 2. Build breadcrumb schema
  const breadcrumbs = [
    { name: isUk ? "Головна" : "Главная", url: navPrefix || "/" },
    { name: cityName, url: `${navPrefix}/${cityConfig.slug}` }
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <>
      <SchemaScript schema={[businessSchema, breadcrumbSchema]} />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <img
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop"
            alt={isUk ? `Натяжні стелі ${cityName}` : `Натяжные потолки ${cityName}`}
            className={styles.heroImg}
            loading="eager"
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>
              ENGINEERING & AESTHETICS • {cityConfig.slug.toUpperCase()}
            </span>
            <h1 className={`${styles.heroTitle} text-glow`}>
              {isUk ? `Час створити ідеальну стелю ${cityInCity}` : `Потолок как Искусство ${cityInCity}`}
            </h1>
            <p className={styles.heroText}>
              {isUk
                ? "Ми не просто монтуємо полотна. Ми створюємо архітектурний простір, де кожна лінія має значення."
                : "Мы не просто монтируем полотна. Мы создаем архитектурное пространство, где каждая линия имеет значение."}
            </p>
            <div className={styles.heroActions}>
              <a href="#calculator">
                <Button variant="primary" size="lg">
                  {isUk ? "Розрахувати проект" : "Рассчитать проект"}
                </Button>
              </a>
              <Link href={`${navPrefix}/${cityConfig.slug}/contacts`}>
                <Button variant="outline" size="lg" className={styles.heroBtnOutline}>
                  {isUk ? "Зв'язатися з нами" : "Связаться с нами"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services in City */}
      <section className={styles.servicesSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            {isUk ? `Послуги та ціни ${cityInCity}` : `Услуги и цены ${cityInCity}`}
          </h2>
          <div className={styles.grid}>
            {services.slice(0, 8).map((service) => {
              const localPrice = Math.round(service.basePrice * cityConfig.priceModifier);
              return (
                <Card key={service.slug} variant="glow" className={styles.serviceCard}>
                  <Badge variant="gold" className={styles.priceBadge}>
                    {isUk ? "від" : "от"} {localPrice} грн/м²
                  </Badge>
                  <h4 className={styles.cardTitle}>{service[locale].title}</h4>
                  <p className={styles.cardDesc}>{service[locale].description}</p>
                  <Link href={`${navPrefix}/${cityConfig.slug}/${service.slug}`}>
                    <Button variant="secondary" size="sm" className={styles.cardBtn}>
                      {isUk ? "Ціни та деталі" : "Цены и детали"}
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className={styles.calculatorSection} id="calculator">
        <div className="container">
          <h2 className={styles.sectionTitle}>
            {isUk ? "Розрахунок вартості стелі" : "Расчет стоимости потолка"}
          </h2>
          <Calculator locale={locale} defaultCitySlug={cityConfig.slug} />
        </div>
      </section>

      {/* GEO Context (Landmarks / ЖК) */}
      <section className={styles.geoContext}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            {isUk ? `Працюємо в усіх районах та ЖК` : `Работаем во всех районах и ЖК`}
          </h2>
          <p className={styles.sectionSubtitle}>
            {isUk 
              ? `Виконуємо швидкий монтаж натяжних стель у нових житлових комплексах міста ${cityName}:`
              : `Выполняем быстрый монтаж натяжных потолков в новых жилых комплексах города ${cityName}:`}
          </p>
          <div className={styles.landmarksGrid}>
            {cityConfig.landmarks.map((lm, idx) => (
              <div key={idx} className={styles.landmarkItem}>
                🏢 {lm}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Contacts Section */}
      <section className={styles.contactsSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            {isUk ? `Контакти філії NOVA STELYA у м. ${cityName}` : `Контакты филиала NOVA STELYA в г. ${cityName}`}
          </h2>
          <div className={styles.contactsGrid}>
            <div className={styles.contactCard}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📍</span>
                <div>
                  <strong>{isUk ? "Адреса філії:" : "Адрес филиала:"}</strong>
                  <span>{isUk ? cityConfig.address : cityConfig.addressRu}</span>
                </div>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📞</span>
                <div>
                  <strong>{isUk ? "Телефон філії:" : "Телефон филиала:"}</strong>
                  <a href={`tel:${cityConfig.phone.replace(/\s+/g, "")}`}>{cityConfig.phone}</a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>⏱️</span>
                <div>
                  <strong>{isUk ? "Режим роботи:" : "Режим работы:"}</strong>
                  <span>{cityConfig.officeHours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
