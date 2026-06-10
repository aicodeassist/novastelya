import React from "react";
import { CityConfig } from "@/config/geo-matrix";
import styles from "@/components/templates/ServicePageTemplate.module.css";
import { SchemaScript } from "@/seo/schema/inject/jsonld";
import { buildFAQSchema } from "@/seo/schema/builders/faq";
import { replacePlaceholders } from "./BlockRenderer";

type FaqItem = {
  uk: { q: string; a: string };
  ru: { q: string; a: string };
};

type Props = {
  block: {
    id: string;
    type: string;
    uk?: { title?: string };
    ru?: { title?: string };
    faqs?: FaqItem[];
  };
  locale: "uk" | "ru";
  city: CityConfig | null;
  defaultFaqs: FaqItem[];
};

export function FaqBlock({ block, locale, city, defaultFaqs }: Props) {
  const isUk = locale === "uk";
  const content = block[locale] || {};
  const sectionTitleTemplate = content.title || "FAQ";
  const sectionTitle = replacePlaceholders(sectionTitleTemplate, locale, city);

  const activeFaqs = block.faqs || defaultFaqs;

  // Build FAQ schema items
  const schemaFaqs = activeFaqs.map((faq) => {
    const itemContent = faq[locale] || {};
    return {
      q: replacePlaceholders(itemContent.q || "", locale, city),
      a: replacePlaceholders(itemContent.a || "", locale, city),
    };
  });

  const faqSchema = buildFAQSchema(schemaFaqs);

  return (
    <>
      <SchemaScript schema={[faqSchema]} />
      <section className={`${styles.faq} c-faq`} id={block.id}>
        <div className="c-faq__container container">
          <h2 className={`${styles.sectionTitle} c-faq__title`}>{sectionTitle}</h2>
          <div className={`${styles.faqList} c-faq__list`}>
            {schemaFaqs.map((faq, idx) => (
              <details key={idx} className={`${styles.faqDetails} c-faq__item`}>
                <summary className={`${styles.faqSummary} c-faq__summary`}>{faq.q}</summary>
                <div className={`${styles.faqAnswer} c-faq__answer`}>{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
