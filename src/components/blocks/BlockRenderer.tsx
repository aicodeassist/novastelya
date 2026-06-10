import React from "react";
import { CityConfig } from "@/config/geo-matrix";
import { getCityPhrase } from "@/seo/content/city-copy";
import { SITE_NAME } from "@/seo/constants/site";

// Import block components
import { HeroBlock } from "./HeroBlock";
import { BenefitsBlock } from "./BenefitsBlock";
import { FaqBlock } from "./FaqBlock";
import { CtaBlock } from "./CtaBlock";
import { RichTextBlock } from "./RichTextBlock";

/**
 * Replaces placeholders in dynamic CMS blocks.
 */
export function replacePlaceholders(text: string, locale: "uk" | "ru", city: CityConfig | null): string {
  if (!text) return "";
  const isUk = locale === "uk";
  let cityText = city ? (isUk ? city.uk : city.ru) : (isUk ? "в Україні" : "в Украине");
  let cityPhraseText = city ? getCityPhrase(city.slug, locale) : (isUk ? "в Україні" : "в Украине");
  let cityPhoneText = city ? city.phone : "0 800 000-000";

  return text
    .replace(/{city}/g, cityText)
    .replace(/{cityPhrase}/g, cityPhraseText)
    .replace(/{cityPhone}/g, cityPhoneText)
    .replace(/{siteName}/g, SITE_NAME);
}

type Props = {
  blocks: any[];
  locale: "uk" | "ru";
  city: CityConfig | null;
  defaultH1: string;
  defaultDesc: string;
  finalPrice: number;
  defaultBenefits: any[];
  defaultFaqs: any[];
};

export function BlockRenderer({
  blocks,
  locale,
  city,
  defaultH1,
  defaultDesc,
  finalPrice,
  defaultBenefits,
  defaultFaqs
}: Props) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block) => {
        if (!block || !block.id) return null;

        switch (block.type) {
          case "HeroBlock":
          case "HeroSection":
            return (
              <HeroBlock
                key={block.id}
                block={block}
                locale={locale}
                city={city}
                defaultH1={defaultH1}
                defaultDesc={defaultDesc}
                finalPrice={finalPrice}
              />
            );

          case "BenefitsBlock":
          case "BenefitsSection":
            return (
              <BenefitsBlock
                key={block.id}
                block={block}
                locale={locale}
                city={city}
                defaultBenefits={defaultBenefits}
              />
            );

          case "FaqBlock":
          case "FaqSection":
            return (
              <FaqBlock
                key={block.id}
                block={block}
                locale={locale}
                city={city}
                defaultFaqs={defaultFaqs}
              />
            );

          case "CtaBlock":
          case "CtaSection":
            return (
              <CtaBlock
                key={block.id}
                block={block}
                locale={locale}
                city={city}
              />
            );

          case "RichTextBlock":
          case "RichTextSection":
            return (
              <RichTextBlock
                key={block.id}
                block={block}
                locale={locale}
                city={city}
              />
            );

          default:
            console.warn(`Unknown block type: ${block.type}`);
            return null;
        }
      })}
    </>
  );
}
