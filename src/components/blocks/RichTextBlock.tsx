import React from "react";
import { CityConfig } from "@/config/geo-matrix";
import { replacePlaceholders } from "./BlockRenderer";

type Props = {
  block: {
    id: string;
    type: string;
    uk?: { content?: string };
    ru?: { content?: string };
  };
  locale: "uk" | "ru";
  city: CityConfig | null;
};

export function RichTextBlock({ block, locale, city }: Props) {
  const content = block[locale] || {};
  const htmlTemplate = content.content || "";
  const html = replacePlaceholders(htmlTemplate, locale, city);

  if (!html) return null;

  return (
    <section 
      id={block.id} 
      className="rich-text-section c-rich-text"
      style={{
        padding: "var(--space-3xl) 0",
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
        lineHeight: "var(--line-height-relaxed)"
      }}
    >
      <div 
        className="c-rich-text__container container" 
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "0 var(--space-md)",
          fontSize: "var(--text-base)"
        }}
      />
    </section>
  );
}
