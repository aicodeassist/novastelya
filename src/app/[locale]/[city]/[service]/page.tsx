import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { resolveRoute } from "@/lib/route-resolver";
import { generatePageMetadata } from "@/seo";
import { activeCities } from "@/config/geo-matrix";
import { services } from "@/config/services.config";

// Import all templates
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";
import { PricesPageTemplate } from "@/components/templates/PricesPageTemplate";
import { CalculatorPageTemplate } from "@/components/templates/CalculatorPageTemplate";
import { FaqPageTemplate } from "@/components/templates/FaqPageTemplate";
import { PortfolioPageTemplate } from "@/components/templates/PortfolioPageTemplate";

type Props = {
  params: Promise<{ locale: string; city: string; service: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city, service } = await params;
  const resolved = resolveRoute(locale, city, service);

  switch (resolved.type) {
    case "city-service":
      return generatePageMetadata({ page: resolved.service.slug, city: resolved.city, locale: resolved.locale });
    case "prices":
      return generatePageMetadata({ page: "prices", city: resolved.city || undefined, locale: resolved.locale });
    case "calculator":
      return generatePageMetadata({ page: "calculator", city: resolved.city || undefined, locale: resolved.locale });
    case "faq":
      return generatePageMetadata({ page: "faq", city: resolved.city || undefined, locale: resolved.locale });
    case "portfolio":
      return generatePageMetadata({ page: "portfolio", city: resolved.city || undefined, locale: resolved.locale });
    default:
      return {};
  }
}

export function generateStaticParams() {
  const params: Array<{ locale: string; city: string; service: string }> = [];

  // 1. /ru/[city]/[service] (Russian city services)
  activeCities.forEach((city) => {
    services.forEach((service) => {
      params.push({ locale: "ru", city: city.slug, service: service.slug });
    });
  });

  // 2. /ru/[city]/[static-page] (Russian city subpages: prices, calculator, portfolio, faq)
  const citySubPages = ["prices", "calculator", "portfolio", "faq"];
  activeCities.forEach((city) => {
    citySubPages.forEach((page) => {
      params.push({ locale: "ru", city: city.slug, service: page });
    });
  });

  return params;
}

export default async function CityServicePage({ params }: Props) {
  const { locale, city, service } = await params;
  const resolved = resolveRoute(locale, city, service);

  switch (resolved.type) {
    case "city-service":
      return (
        <ServicePageTemplate
          serviceSlug={resolved.service.slug}
          cityConfig={resolved.city}
          locale={resolved.locale}
        />
      );
    case "prices":
      return <PricesPageTemplate cityConfig={resolved.city} locale={resolved.locale} />;
    case "calculator":
      return <CalculatorPageTemplate params={params} />;
    case "faq":
      return <FaqPageTemplate cityConfig={resolved.city} locale={resolved.locale} />;
    case "portfolio":
      return <PortfolioPageTemplate cityConfig={resolved.city} locale={resolved.locale} />;
    default:
      notFound();
  }
}
