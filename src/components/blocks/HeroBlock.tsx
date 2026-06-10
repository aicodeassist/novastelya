import React from "react";
import { CityConfig } from "@/config/geo-matrix";
import { Button, Badge } from "@/components/ui";
import Link from "next/link";
import styles from "@/components/templates/ServicePageTemplate.module.css";
import { replacePlaceholders } from "./BlockRenderer";

type Props = {
  block: {
    id: string;
    type: string;
    heroImage?: string;
    uk?: { title?: string; subtitle?: string; btnText?: string; heroImage?: string };
    ru?: { title?: string; subtitle?: string; btnText?: string; heroImage?: string };
  };
  locale: "uk" | "ru";
  city: CityConfig | null;
  defaultH1: string;
  defaultDesc: string;
  finalPrice: number;
};

export function HeroBlock({ block, locale, city, defaultH1, defaultDesc, finalPrice }: Props) {
  const isUk = locale === "uk";
  const content = block[locale] || {};

  const titleTemplate = content.title || defaultH1;
  const subtitleTemplate = content.subtitle || defaultDesc;
  const btnText = content.btnText || (isUk ? "Замовити замір" : "Заказать замер");
  const heroImage = content.heroImage || block.heroImage || "https://image.qwenlm.ai/public_source/3ceeaece-e030-47a5-8a9e-6e479ba5316d/1a0dfdf59-275e-4ba3-96ed-7874d667e36b.png";

  const title = replacePlaceholders(titleTemplate, locale, city);
  const subtitle = replacePlaceholders(subtitleTemplate, locale, city);

  const cityName = city ? city[locale] : "";
  const navPrefix = locale === "ru" ? "/ru" : "";

  return (
    <section className={`${styles.hero} c-hero`} id={block.id}>
      <div className={`${styles.heroBg} c-hero__bg`}>
        <img src={heroImage} alt={title} className={`${styles.heroImg} c-hero__img`} loading="eager" />
        <div className={`${styles.heroOverlay} c-hero__overlay`} />
      </div>
      <div className="c-hero__container container">
        <div className={`${styles.heroContent} c-hero__content`}>
          <span className={`${styles.heroBadge} c-hero__badge`}>
            ENGINEERING & AESTHETICS • {city ? city.slug.toUpperCase() : "KYIV"}
          </span>
          <h1 className={`${styles.title} c-hero__title text-glow`}>
            {title}
          </h1>
          <p className={`${styles.description} c-hero__description`}>{subtitle}</p>
          <div className={`${styles.heroActions} c-hero__actions`}>
            <Link href={`${navPrefix}/contacts`} className="c-hero__btn-link">
              <Button variant="primary" size="lg" className="c-hero__button">
                {btnText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
