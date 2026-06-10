import React from "react";
import Link from "next/link";
import { SchemaScript } from "@/seo";
import { Button, Card, Badge } from "@/components/ui";
import { services } from "@/config/services.config";
import { Calculator } from "@/components/sections/Calculator/Calculator";
import styles from "./HomeTemplate.module.css";

type HomeProps = {
  locale: "uk" | "ru";
};

export function HomeTemplate({ locale }: HomeProps) {
  const isUk = locale === "uk";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://novastelya.com/#website",
    "url": "https://novastelya.com",
    "name": "NOVA STELYA",
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://novastelya.com/#organization",
    "name": "NOVA STELYA",
    "url": "https://novastelya.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://novastelya.com/logo.png",
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+380-800-000-000",
      "contactType": "customer service",
      "availableLanguage": ["Ukrainian", "Russian"],
    },
  };

  const faqs = [
    {
      q: isUk ? "Скільки часу займає монтаж?" : "Сколько времени занимает монтаж?",
      a: isUk
        ? "Встановлення простої стелі триває близько 2-4 годин залежно від складності та освітлення."
        : "Установка простого потолка занимает около 2-4 часов в зависимости от сложности и освещения.",
    },
    {
      q: isUk ? "Чи є гарантія на стелі?" : "Есть ли гарантия на потолки?",
      a: isUk
        ? "Так, ми надаємо офіційну гарантію 10 років на полотно та монтажні роботи."
        : "Да, мы предоставляем официальную гарантию 10 лет на полотно и монтажные работы.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  // Categorize services
  const categories = {
    materials: services.filter((s) => s.category === "materials").slice(0, 4),
    designs: services.filter((s) => s.category === "designs").slice(0, 4),
    lighting: services.filter((s) => s.category === "lighting").slice(0, 4),
    rooms: services.filter((s) => s.category === "rooms").slice(0, 4),
  };

  const navPrefix = locale === "ru" ? "/ru" : "";

  return (
    <>
      <SchemaScript schema={[websiteSchema, orgSchema, faqSchema]} />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <img
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop"
            alt={isUk ? "Сучасні Натяжні Стелі" : "Современные Натяжные Потолки"}
            className={styles.heroImg}
            loading="eager"
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>
              ENGINEERING & AESTHETICS • KYIV
            </span>
            <h1 className={`${styles.heroTitle} text-glow`}>
              {isUk ? "Сучасні Натяжні Стелі" : "Современные Натяжные Потолки"}
            </h1>
            <p className={styles.heroText}>
              {isUk
                ? "Професійний монтаж без пилу за 3 години. Ідеально рівна поверхня з гарантією 10 років."
                : "Профессиональный монтаж без пыли за 3 часа. Идеально ровная поверхность с гарантией 10 лет."}
            </p>
            <div className={styles.heroActions}>
              <Link href={`${navPrefix}/prices`}>
                <Button variant="primary" size="lg">
                  {isUk ? "Розрахувати вартість" : "Рассчитать стоимость"}
                </Button>
              </Link>
              <Link href={`${navPrefix}/contacts`}>
                <Button variant="outline" size="lg" className={styles.heroBtnOutline}>
                  {isUk ? "Зв'язатися з нами" : "Связаться с нами"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Grid Section */}
      <section className={styles.catalog}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            {isUk ? "Каталог Рішень" : "Каталог Решений"}
          </h2>
          <p className={styles.sectionSubtitle}>
            {isUk
              ? "Оберіть ідеальний варіант для вашого інтер'єру з нашого широкого асортименту."
              : "Выберите идеальный вариант для вашего интерьера из нашего широкого ассортимента."}
          </p>

          <div className={styles.catalogTabs}>
            {/* Materials Category */}
            <div className={styles.categoryBlock}>
              <h3 className={styles.categoryTitle}>{isUk ? "Матеріали" : "Материалы"}</h3>
              <div className={styles.grid}>
                {categories.materials.map((service) => (
                  <Card key={service.slug} variant="default" className={styles.serviceCard}>
                    <Badge variant="gold" className={styles.priceBadge}>
                      {isUk ? "від" : "от"} {service.basePrice} {isUk ? "грн/м²" : "грн/м²"}
                    </Badge>
                    <h4 className={styles.cardTitle}>{service[locale].title}</h4>
                    <p className={styles.cardDesc}>{service[locale].description}</p>
                    <Link href={`${navPrefix}/${service.slug}`}>
                      <Button variant="secondary" size="sm" className={styles.cardBtn}>
                        {isUk ? "Детальніше" : "Подробнее"}
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>

            {/* Designs Category */}
            <div className={styles.categoryBlock}>
              <h3 className={styles.categoryTitle}>{isUk ? "Конструкції" : "Конструкции"}</h3>
              <div className={styles.grid}>
                {categories.designs.map((service) => (
                  <Card key={service.slug} variant="premium" className={styles.serviceCard}>
                    <Badge variant="gold" className={styles.priceBadge}>
                      {isUk ? "від" : "от"} {service.basePrice} {isUk ? "грн/м²" : "грн/м²"}
                    </Badge>
                    <h4 className={styles.cardTitle}>{service[locale].title}</h4>
                    <p className={styles.cardDesc}>{service[locale].description}</p>
                    <Link href={`${navPrefix}/${service.slug}`}>
                      <Button variant="secondary" size="sm" className={styles.cardBtn}>
                        {isUk ? "Детальніше" : "Подробнее"}
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className={styles.calculatorSection}>
        <div className="container">
          <Calculator locale={locale} />
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            {isUk ? "Чому Обирають NOVA STELYA" : "Почему Выбирают NOVA STELYA"}
          </h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🛡️</div>
              <h4>{isUk ? "Гарантія 10 років" : "Гарантия 10 лет"}</h4>
              <p>
                {isUk
                  ? "Ми впевнені в якості наших матеріалів та роботи, тому надаємо тривалу офіційну гарантію."
                  : "Мы уверены в качестве наших материалов и работы, поэтому предоставляем длительную официальную гарантию."}
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>⚡</div>
              <h4>{isUk ? "Швидкий монтаж" : "Быстрый монтаж"}</h4>
              <p>
                {isUk
                  ? "Встановлення стелі в одній кімнаті займає всього кілька годин без бруду та пилу."
                  : "Установка потолка в одной комнате занимает всего несколько часов без грязи и пыли."}
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🌱</div>
              <h4>{isUk ? "Екологічні матеріали" : "Экологичные материалы"}</h4>
              <p>
                {isUk
                  ? "Використовуємо лише сертифіковані європейські полотна без запаху та шкідливих виділень."
                  : "Используем только сертифицированные европейские полотна без запаха и вредных выделений."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className="container">
          <h2 className={styles.sectionTitle}>FAQ</h2>
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
