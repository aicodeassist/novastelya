import React from "react";
import { CityConfig } from "@/config/geo-matrix";
import { Card } from "@/components/ui";
import styles from "@/components/templates/ServicePageTemplate.module.css";
import { replacePlaceholders } from "./BlockRenderer";

type BenefitItem = {
  icon: string;
  uk: { title: string; description: string };
  ru: { title: string; description: string };
};

type Props = {
  block: {
    id: string;
    type: string;
    uk?: { title?: string };
    ru?: { title?: string };
    benefits?: BenefitItem[];
  };
  locale: "uk" | "ru";
  city: CityConfig | null;
  defaultBenefits: BenefitItem[];
};

export function BenefitsBlock({ block, locale, city, defaultBenefits }: Props) {
  const isUk = locale === "uk";
  const content = block[locale] || {};
  const sectionTitleTemplate = content.title || (isUk ? "Переваги рішення" : "Преимущества решения");
  const sectionTitle = replacePlaceholders(sectionTitleTemplate, locale, city);

  const activeBenefits = block.benefits || defaultBenefits;

  return (
    <section className={`${styles.benefits} c-benefits`} id={block.id}>
      <div className="c-benefits__container container">
        <h2 className={`${styles.sectionTitle} c-benefits__title`}>{sectionTitle}</h2>
        <div className={`${styles.benefitsGrid} c-benefits__grid`}>
          {activeBenefits.map((item, idx) => {
            const itemContent = item[locale] || {};
            const title = replacePlaceholders(itemContent.title || "", locale, city);
            const description = replacePlaceholders(itemContent.description || "", locale, city);

            return (
              <Card key={idx} variant="glow" className="c-benefits__card c-benefit-card">
                <span className={`${styles.benefitIcon} c-benefit-card__icon`}>{item.icon || "💎"}</span>
                <h4 className="c-benefit-card__title">{title}</h4>
                <p className="c-benefit-card__description">{description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
