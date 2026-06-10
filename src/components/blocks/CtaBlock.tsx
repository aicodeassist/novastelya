import React from "react";
import { CityConfig } from "@/config/geo-matrix";
import { Button } from "@/components/ui";
import Link from "next/link";
import { replacePlaceholders } from "./BlockRenderer";

type Props = {
  block: {
    id: string;
    type: string;
    uk?: { title?: string; subtitle?: string; btnText?: string };
    ru?: { title?: string; subtitle?: string; btnText?: string };
  };
  locale: "uk" | "ru";
  city: CityConfig | null;
};

export function CtaBlock({ block, locale, city }: Props) {
  const isUk = locale === "uk";
  const content = block[locale] || {};

  const titleTemplate = content.title || (isUk ? "Потрібна консультація фахівця?" : "Нужна консультация специалиста?");
  const subtitleTemplate = content.subtitle || (isUk ? "Залиште заявку на безкоштовний замір та отримайте детальну консультацію вже сьогодні!" : "Оставьте заявку на бесплатный замер и получите детальную консультацию уже сегодня!");
  const btnText = content.btnText || (isUk ? "Замовити замір" : "Заказать замер");

  const title = replacePlaceholders(titleTemplate, locale, city);
  const subtitle = replacePlaceholders(subtitleTemplate, locale, city);

  const navPrefix = locale === "ru" ? "/ru" : "";

  return (
    <section 
      id={block.id} 
      className="c-cta"
      style={{
        padding: "var(--space-3xl) 0",
        background: "linear-gradient(135deg, rgba(20, 22, 30, 0.9) 0%, rgba(10, 12, 18, 0.9) 100%)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        textAlign: "center"
      }}
    >
      <div className="c-cta__container container" style={{ maxWidth: "800px", margin: "0 auto", padding: "0 var(--space-md)" }}>
        <h2 
          className="c-cta__title text-glow" 
          style={{ 
            fontSize: "var(--text-2xl)", 
            fontWeight: "var(--font-weight-bold)", 
            color: "var(--color-text)",
            marginBottom: "var(--space-sm)"
          }}
        >
          {title}
        </h2>
        <p 
          className="c-cta__subtitle"
          style={{ 
            fontSize: "var(--text-base)", 
            color: "var(--color-text-secondary)", 
            lineHeight: "var(--line-height-relaxed)",
            marginBottom: "var(--space-lg)"
          }}
        >
          {subtitle}
        </p>
        <Link href={`${navPrefix}/contacts`} className="c-cta__btn-link">
          <Button variant="primary" size="lg" className="c-cta__button">
            {btnText}
          </Button>
        </Link>
      </div>
    </section>
  );
}
