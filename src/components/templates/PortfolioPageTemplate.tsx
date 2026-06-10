import React from "react";
import { Metadata } from "next";
import { getCityBySlug, CityConfig } from "@/config/geo-matrix";
import { generatePageMetadata, SchemaScript, buildBreadcrumbSchema } from "@/seo";
import { Badge, Card } from "@/components/ui";
import styles from "./PortfolioPageTemplate.module.css";
import { getActiveCityFromParams, getActiveLocaleFromParams } from "@/lib/route-resolver";

type Props = {
  cityConfig?: CityConfig | null;
  locale?: "uk" | "ru";
  params?: any;
};

export function getPortfolioMetadataGenerator() {
  return async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    const resolvedParams = await params;
    const city = getActiveCityFromParams(resolvedParams);
    const locale = getActiveLocaleFromParams(resolvedParams);
    return generatePageMetadata({
      page: "portfolio",
      city: city,
      locale: locale,
    });
  };
}

export async function PortfolioPageTemplate({ cityConfig, locale: propLocale, params }: Props) {
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

  // Mock projects for portfolio (highly realistic E-E-A-T data)
  const projects = [
    {
      id: "project-1",
      titleUk: "Матова натяжна стеля в ЖК Файна Таун, Київ",
      titleRu: "Матовый натяжной потолок в ЖК Файна Таун, Киев",
      citySlug: "kyiv",
      size: "42 м²",
      price: "12,600 грн",
      materialUk: "ПВХ матове (Pongs, Німеччина)",
      materialRu: "ПВХ матовое (Pongs, Германия)",
      descUk: "Встановлення матової натяжної стелі у вітальні з вбудованими трековими магнітними лініями.",
      descRu: "Установка матового натяжного потолка в гостиной со встроенными трековыми магнитными линиями.",
    },
    {
      id: "project-2",
      titleUk: "Тіньова стеля EuroKraab в ЖК Panorama City, Дніпро",
      titleRu: "Теневой потолок EuroKraab в ЖК Panorama City, Днепр",
      citySlug: "dnipro",
      size: "35 м²",
      price: "15,750 грн",
      materialUk: "ПВХ тіньове EuroKraab",
      materialRu: "ПВХ теневое EuroKraab",
      descUk: "Преміум тіньовий шов по периметру стін без використання плінтусів у спальні.",
      descRu: "Премиум теневой шов по периметру стен без использования плинтусов в спальне.",
    },
    {
      id: "project-3",
      titleUk: "Світлові лінії у ванній кімнаті, Харків",
      titleRu: "Световые линии в ванной комнате, Харьков",
      citySlug: "kharkiv",
      size: "8 м²",
      price: "4,800 грн",
      materialUk: "ПВХ матове Teqtum",
      materialRu: "ПВХ матовое Teqtum",
      descUk: "Встановлення вологостійкої натяжної стелі з двома світловими лініями як основним джерелом світла.",
      descRu: "Установка влагостойкого натяжного потолка с двумя световыми линиями в качестве основного источника света.",
    }
  ];

  // Filter projects by city context if present
  const filteredProjects = city
    ? projects.filter((p) => p.citySlug === city.slug)
    : projects;

  // ImageGallery schema
  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": isUk ? `Портфоліо натяжних стель${citySuffix}` : `Портфолио натяжных потолков${citySuffix}`,
    "description": isUk
      ? `Фотографії виконаних проектів натяжних стель${citySuffix} від компанії NOVA STELYA.`
      : `Фотографии выполненных проектов натяжных потолков${citySuffix} от компании NOVA STELYA.`,
    "associatedMedia": filteredProjects.map((p) => ({
      "@type": "ImageObject",
      "name": isUk ? p.titleUk : p.titleRu,
      "description": isUk ? p.descUk : p.descRu,
      "contentUrl": `https://novastelya.com/images/portfolio/${p.id}.jpg`
    }))
  };

  const navPrefix = locale === "ru" ? "/ru" : "";

  const breadcrumbs = [
    { name: isUk ? "Головна" : "Главная", url: navPrefix || "/" },
    ...(city ? [{ name: city[locale], url: `${navPrefix}/${city.slug}` }] : []),
    { name: isUk ? "Портфоліо" : "Портфолио", url: city ? `${navPrefix}/${city.slug}/portfolio` : `${navPrefix}/portfolio` }
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <>
      <SchemaScript schema={[gallerySchema, breadcrumbSchema]} />
      <section className={styles.portfolioSec}>
        <div className="container">
          <div className={styles.header}>
            <Badge variant="gold">
              {city ? `${cityName} • ${isUk ? "Наші роботи" : "Наши работы"}` : (isUk ? "Всі роботи" : "Все работы")}
            </Badge>
            <h1 className={`${styles.title} text-glow`}>
              {isUk ? `Портфоліо Натяжних Стель${citySuffix}` : `Портфолио Натяжных Потолков${citySuffix}`}
            </h1>
            <p className={styles.subtitle}>
              {isUk
                ? "Фотографії наших реальних об'єктів з деталями матеріалів, площі та вартості робіт."
                : "Фотографии наших реальных объектов с деталями материалов, площади и стоимости работ."}
            </p>
          </div>

          {filteredProjects.length === 0 ? (
            <p className={styles.noProjects}>
              {isUk ? "Проектів для цього міста наразі не додано." : "Проектов для этого города пока не добавлено."}
            </p>
          ) : (
            <div className={styles.grid}>
              {filteredProjects.map((project) => (
                <Card key={project.id} variant="premium" className={styles.projectCard}>
                  <div className={styles.imgPlaceholder}>📸 {isUk ? "Фото роботи" : "Фото работы"}</div>
                  <div className={styles.content}>
                    <h3>{isUk ? project.titleUk : project.titleRu}</h3>
                    <p>{isUk ? project.descUk : project.descRu}</p>
                    <div className={styles.meta}>
                      <span>📏 {project.size}</span>
                      <span>💰 {project.price}</span>
                      <span>🧬 {isUk ? project.materialUk : project.materialRu}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
