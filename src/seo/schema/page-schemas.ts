import { buildOrganization } from "./builders/organization";
import { buildLocalBusiness } from "./builders/local-business";
import { buildService } from "./builders/service";
import { buildBreadcrumb } from "./builders/breadcrumb";
import { buildFaq } from "./builders/faq";
import type { PageSchemaConfig } from "@/seo/types/schema.types";

export function getPageSchema(config: PageSchemaConfig): object[] {
  const { pageType, city, service, faqItems, breadcrumbs } = config;
  const schemas: object[] = [];

  if (pageType === "home") {
    schemas.push(buildOrganization());
  } else if (pageType === "service") {
    if (service) {
      schemas.push(buildService({ service, city, locale: "uk" }));
    }
    if (breadcrumbs) {
      schemas.push(buildBreadcrumb(breadcrumbs));
    }
    if (faqItems) {
      schemas.push(buildFaq(faqItems));
    }
  } else if (pageType === "city") {
    if (city) {
      schemas.push(buildLocalBusiness(city, "uk"));
    }
    if (breadcrumbs) {
      schemas.push(buildBreadcrumb(breadcrumbs));
    }
  } else if (pageType === "city-service") {
    if (city && service) {
      schemas.push(buildLocalBusiness(city, "uk"));
      schemas.push(buildService({ service, city, locale: "uk" }));
    }
    if (breadcrumbs) {
      schemas.push(buildBreadcrumb(breadcrumbs));
    }
    if (faqItems) {
      schemas.push(buildFaq(faqItems));
    }
  } else {
    // Other static/dynamic pages
    if (city) {
      schemas.push(buildLocalBusiness(city, "uk"));
    }
    if (faqItems) {
      schemas.push(buildFaq(faqItems));
    }
    if (breadcrumbs) {
      schemas.push(buildBreadcrumb(breadcrumbs));
    }
  }

  return schemas;
}
