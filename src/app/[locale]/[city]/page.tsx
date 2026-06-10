import React from "react";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { resolveRoute } from "@/lib/route-resolver";
import { generatePageMetadata } from "@/seo";
import { activeCities } from "@/config/geo-matrix";
import { services } from "@/config/services.config";

// Import all templates
import { CityHubPageTemplate } from "@/components/templates/CityHubPageTemplate";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";
import { PricesPageTemplate } from "@/components/templates/PricesPageTemplate";
import { CalculatorPageTemplate } from "@/components/templates/CalculatorPageTemplate";
import { FaqPageTemplate } from "@/components/templates/FaqPageTemplate";
import { PortfolioPageTemplate } from "@/components/templates/PortfolioPageTemplate";
import { ContactsPageTemplate } from "@/components/templates/ContactsPageTemplate";
import { AboutPageTemplate } from "@/components/templates/AboutPageTemplate";
import { BlogPageTemplate } from "@/components/templates/BlogPageTemplate";

type Props = {
  params: Promise<{ locale: string; city: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city } = await params;
  const resolved = resolveRoute(locale, city);

  switch (resolved.type) {
    case "city-hub":
      return generatePageMetadata({ page: "home", city: resolved.city, locale: resolved.locale });
    case "service":
      return generatePageMetadata({ page: resolved.service.slug, locale: resolved.locale });
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
    case "contacts":
      return generatePageMetadata({ page: "contacts", locale: resolved.locale });
    case "about":
      return generatePageMetadata({ page: "about", locale: resolved.locale });
    case "blog":
      return generatePageMetadata({ page: "blog", locale: resolved.locale });
    default:
      return {};
  }
}

export function generateStaticParams() {
  const params: Array<{ locale: string; city: string }> = [];

  // 1. /ru/[city] (Russian city hubs)
  activeCities.forEach((city) => {
    params.push({ locale: "ru", city: city.slug });
  });

  // 2. /ru/[service] (Russian general services)
  services.forEach((service) => {
    params.push({ locale: "ru", city: service.slug });
  });

  // 3. /ru/[static-page] (Russian static pages)
  const staticPages = ["prices", "calculator", "portfolio", "faq", "contacts", "about", "blog"];
  staticPages.forEach((page) => {
    params.push({ locale: "ru", city: page });
  });

  // 4. /[city]/[service] (Ukrainian city services)
  activeCities.forEach((city) => {
    services.forEach((service) => {
      params.push({ locale: city.slug, city: service.slug });
    });
  });

  // 5. /[city]/[static-page] (Ukrainian city subpages: prices, calculator, portfolio, faq, contacts)
  const citySubPages = ["prices", "calculator", "portfolio", "faq", "contacts"];
  activeCities.forEach((city) => {
    citySubPages.forEach((page) => {
      params.push({ locale: city.slug, city: page });
    });
  });

  // 6. /uk/[service] (Ukrainian general services fallback)
  services.forEach((service) => {
    params.push({ locale: "uk", city: service.slug });
  });

  return params;
}

export default async function CityPage({ params }: Props) {
  const { locale, city } = await params;
  const resolved = resolveRoute(locale, city);

  if (resolved.type === "redirect") {
    redirect(resolved.url);
  }

  switch (resolved.type) {
    case "city-hub":
      return <CityHubPageTemplate cityConfig={resolved.city} locale={resolved.locale} />;
    case "service":
      return (
        <ServicePageTemplate
          serviceSlug={resolved.service.slug}
          cityConfig={null}
          locale={resolved.locale}
        />
      );
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
    case "contacts":
      return <ContactsPageTemplate cityConfig={resolved.city} locale={resolved.locale} />;
    case "about":
      return <AboutPageTemplate locale={resolved.locale} />;
    case "blog":
      return <BlogPageTemplate locale={resolved.locale} />;
    default:
      notFound();
  }
}
