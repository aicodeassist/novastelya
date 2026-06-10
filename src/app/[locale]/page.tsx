import React from "react";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { generatePageMetadata } from "@/seo";
import { resolveRoute } from "@/lib/route-resolver";

// Import all templates
import { HomeTemplate } from "@/components/templates/HomeTemplate";
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
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const resolved = resolveRoute(locale);

  switch (resolved.type) {
    case "home":
      return generatePageMetadata({ page: "home", locale: resolved.locale });
    case "city-hub":
      return generatePageMetadata({ page: "home", city: resolved.city, locale: resolved.locale });
    case "service":
      return generatePageMetadata({ page: resolved.service.slug, locale: resolved.locale });
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

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const resolved = resolveRoute(locale);

  if (resolved.type === "redirect") {
    redirect(resolved.url);
  }

  switch (resolved.type) {
    case "home":
      return <HomeTemplate locale={resolved.locale} />;
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
