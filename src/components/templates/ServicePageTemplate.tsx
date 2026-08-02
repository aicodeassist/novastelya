import React from "react";
import { Metadata } from "next";
import { generatePageMetadata, SchemaScript, buildServiceSchema, buildFAQSchema, buildBreadcrumbSchema, buildPath } from "@/seo";
import { getCityBySlug, CityConfig } from "@/config/geo-matrix";
import { getServiceBySlug, ServiceSlug } from "@/config/services.config";
import { Button, Card, Badge } from "@/components/ui";
import styles from "./ServicePageTemplate.module.css";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getActiveCityFromParams, getActiveLocaleFromParams } from "@/lib/route-resolver";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { Calculator } from "@/components/sections/Calculator/Calculator";
import fs from "fs";
import path from "path";

function formatH1(h1: string, city: CityConfig | null, locale: "uk" | "ru", cityInCity: string): string {
  if (!city) return h1;
  const ukTarget = /в Україні/gi;
  const ruTarget = /в Украине/gi;
  
  if (ukTarget.test(h1)) {
    return h1.replace(ukTarget, cityInCity.trim());
  }
  if (ruTarget.test(h1)) {
    return h1.replace(ruTarget, cityInCity.trim());
  }
  return h1 + cityInCity;
}

type Props = {
  serviceSlug: ServiceSlug;
  cityConfig?: CityConfig | null;
  locale?: "uk" | "ru";
  params?: any;
};

export function getMetadataGenerator(serviceSlug: ServiceSlug) {
  return async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    const resolvedParams = await params;
    const city = getActiveCityFromParams(resolvedParams);
    const locale = getActiveLocaleFromParams(resolvedParams);
    return generatePageMetadata({
      page: serviceSlug,
      city: city,
      locale: locale,
    });
  };
}

function getCalculatorDefaults(serviceSlug: string) {
  let defaultRoom: string | null = null;
  let defaultMaterial: string | null = null;
  let defaultTech: string | null = null;
  let defaultLights: Record<string, number> | null = null;

  switch (serviceSlug) {
    // Rooms
    case "kukhnya":
      defaultRoom = "kitchen";
      break;
    case "vanna-kimnata":
      defaultRoom = "bathroom";
      defaultMaterial = "translucent";
      defaultTech = "shadow";
      break;
    case "spalnya":
      defaultRoom = "bedroom";
      break;
    case "vitalnya":
      defaultRoom = "living";
      break;
    case "dytyacha":
      defaultRoom = "kids";
      break;
    case "ofis":
      defaultRoom = "office";
      break;

    // Materials
    case "matovi-steli":
      defaultMaterial = "matte";
      break;
    case "satynovi-steli":
      defaultMaterial = "satin";
      break;
    case "glyancevi-steli":
      defaultMaterial = "glossy";
      break;
    case "tkanynni-steli":
      defaultMaterial = "fabric";
      break;

    // Designs / Tech
    case "tinovi-steli":
      defaultTech = "shadow";
      break;
    case "paryashchi-steli":
      defaultTech = "floating";
      break;
    case "nishevi-steli":
      defaultTech = "slotted";
      break;
    case "rizbleni-steli":
      defaultTech = "carved";
      break;
    case "dvorivnevi-steli":
      defaultTech = "double";
      break;

    // Lighting
    case "svitlovi-liniyi":
      defaultLights = { line: 5 };
      break;
    case "trekove-svitlo":
      defaultLights = { track: 4 };
      break;
    case "konturne-pidsvichuvannya":
      defaultLights = { backlight: 10 };
      break;
    case "zoryane-nebo":
      defaultRoom = "bedroom";
      defaultLights = { starry: 4 };
      break;

    default:
      break;
  }

  return { defaultRoom, defaultMaterial, defaultTech, defaultLights };
}

export async function ServicePageTemplate({ serviceSlug, cityConfig, locale: propLocale, params }: Props) {
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

  const service = getServiceBySlug(serviceSlug);
  const isUk = locale === "uk";

  if (!service) return <div>Service not found</div>;

  const cityName = city ? city[locale] : "";
  const tCities = await getTranslations({ locale, namespace: "cities" });
  const cityInCity = city ? ` ${tCities(`${city.slug}.inCity`)}` : "";
  const serviceName = service[locale].title;
  const basePrice = service.basePrice;
  const finalPrice = city ? Math.round(basePrice * city.priceModifier) : basePrice;
  const finalH1 = formatH1(service[locale].h1, city, locale, cityInCity);

  // 1. Build Schemas
  const serviceSchema = buildServiceSchema({ service, city, locale });
  
  const faqs = [
    {
      q: isUk 
        ? `Яка ціна на ${serviceName.toLowerCase()} ${city ? city.uk : "в Україні"}?` 
        : `Какая цена на ${serviceName.toLowerCase()} ${city ? city.ru : "в Украине"}?`,
      a: isUk
        ? `Вартість становить від ${finalPrice} грн за м² з урахуванням матеріалів та монтажних робіт.`
        : `Стоимость составляет от ${finalPrice} грн за м² с учетом материалов и монтажных работ.`,
    },
    {
      q: isUk 
        ? `Чи надається гарантія на ${serviceName.toLowerCase()}?` 
        : `Предоставляется ли гарантия на ${serviceName.toLowerCase()}?`,
      a: isUk
        ? "Так, ми надаємо офіційну гарантію 10 років на полотно та виконаний монтаж."
        : "Да, мы предоставляем официальную гарантию 10 лет на полотно и выполненный монтаж.",
    }
  ];
  const faqSchema = buildFAQSchema(faqs);

  const navPrefix = locale === "ru" ? "/ru" : "";

  const breadcrumbs = [
    { name: isUk ? "Головна" : "Главная", url: buildPath("home", locale) },
    ...(city && city.slug !== "dnipro" ? [{ name: city[locale], url: buildPath("home", locale, city.slug) }] : []),
    { name: service[locale].breadcrumb, url: buildPath(service.slug, locale, city?.slug) }
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  let pageBlocks: any[] = [];
  try {
    const filePath = path.join(process.cwd(), `src/seo/content/pages/${serviceSlug}.json`);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      pageBlocks = JSON.parse(fileContent).blocks || [];
    }
  } catch (e) {
    // Ignore error
  }

  const calculatorDefaults = getCalculatorDefaults(serviceSlug);

  return (
    <>
      <SchemaScript schema={[serviceSchema, breadcrumbSchema]} />

      {pageBlocks.length > 0 ? (
        <>
          <BlockRenderer
            blocks={pageBlocks}
            locale={locale}
            city={city}
            defaultH1={finalH1}
            defaultDesc={service[locale].description}
            finalPrice={finalPrice}
            defaultBenefits={[
              {
                icon: "💎",
                uk: { title: "Естетика та стиль", description: "Ідеальний зовнішній вигляд, який підкреслює дизайн будь-якого інтер'єру." },
                ru: { title: "Эстетика и стиль", description: "Идеальный внешний вид, подчеркивающий дизайн любого интерьера." }
              },
              {
                icon: "🛡️",
                uk: { title: "Надійність", description: "Захист від протікання води зверху. Полотно витримує до 100 літрів води на м²." },
                ru: { title: "Надежность", description: "Защита от протечек воды сверху. Полотно выдерживает до 100 литров воды на м²." }
              },
              {
                icon: "⏱️",
                uk: { title: "Термін служби", description: "Стелі не вицвітають, не провисають і служать понад 15 років без втрати якості." },
                ru: { title: "Срок службы", description: "Потолки не выцветают, не провисают и служат более 15 лет без потери качества." }
              }
            ]}
            defaultFaqs={faqs}
          />
          <section className={styles.calculatorSection}>
            <div className="container">
              <h2 className={styles.sectionTitle}>
                {isUk ? "Розрахунок вартості стелі" : "Расчет стоимости потолка"}
              </h2>
              <Calculator
                locale={locale}
                defaultCitySlug={city ? city.slug : null}
                {...calculatorDefaults}
              />
            </div>
          </section>
        </>
      ) : (
        <>
          <SchemaScript schema={[faqSchema]} />

          {/* Hero Service Section */}
          <section className={styles.hero}>
            <div className={styles.heroBg}>
              <img
                src="/hero.avif"
                alt={service[locale].h1}
                className={styles.heroImg}
                loading="eager"
              />
              <div className={styles.heroOverlay} />
            </div>
            <div className="container">
              <div className={styles.heroContent}>
                <span className={styles.heroBadge}>
                  ENGINEERING & AESTHETICS • {city ? city.slug.toUpperCase() : "DNIPRO"}
                </span>
                <h1 className={`${styles.title} text-glow`}>
                  {finalH1}
                </h1>
                <p className={styles.description}>{service[locale as "uk" | "ru"].description}</p>
                <div className={styles.heroActions}>
                  <Link href={`${navPrefix}/contacts`}>
                    <Button variant="primary" size="lg">
                      {isUk ? "Замовити замір" : "Заказать замер"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Service Benefits Section */}
          <section className={styles.benefits}>
            <div className="container">
              <h2 className={styles.sectionTitle}>
                {isUk ? `Переваги рішення` : `Преимущества решения`}
              </h2>
              <div className={styles.benefitsGrid}>
                <Card variant="glow">
                  <span className={styles.benefitIcon}>💎</span>
                  <h4>{isUk ? "Естетика та стиль" : "Эстетика и стиль"}</h4>
                  <p>
                    {isUk
                      ? "Ідеальний зовнішній вигляд, який підкреслює дизайн будь-якого інтер'єру."
                      : "Идеальный внешний вид, подчеркивающий дизайн любого интерьера."}
                  </p>
                </Card>
                <Card variant="glow">
                  <span className={styles.benefitIcon}>🛡️</span>
                  <h4>{isUk ? "Надійність" : "Надежность"}</h4>
                  <p>
                    {isUk
                      ? "Захист від протікання води зверху. Полотно витримує до 100 літрів води на м²."
                      : "Защита от протечек воды сверху. Полотно выдерживает до 100 литров воды на м²."}
                  </p>
                </Card>
                <Card variant="glow">
                  <span className={styles.benefitIcon}>⏱️</span>
                  <h4>{isUk ? "Термін служби" : "Срок службы"}</h4>
                  <p>
                    {isUk
                      ? "Стелі не вицвітають, не провисають і служать понад 15 років без втрати якості."
                      : "Потолки не выцветают, не провисают и служат более 15 лет без потери качества."}
                  </p>
                </Card>
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

          {/* Calculator Section */}
          <section className={styles.calculatorSection}>
            <div className="container">
              <h2 className={styles.sectionTitle}>
                {isUk ? "Розрахунок вартості стелі" : "Расчет стоимости потолка"}
              </h2>
              <Calculator
                locale={locale}
                defaultCitySlug={city ? city.slug : null}
                {...calculatorDefaults}
              />
            </div>
          </section>
        </>
      )}
    </>
  );
}
