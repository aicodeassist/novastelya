// Types
export type { SeoContext, PageType } from "./types/seo.types";
export type { BreadcrumbItem, FAQItem, PageSchemaConfig } from "./types/schema.types";
export type { Locale } from "@/config/locales.config";

// Constants
export { SITE, SITE_URL, SITE_NAME } from "./constants/site";
export { LOCALES, DEFAULT_LOCALE, XDEFAULT_LOCALE } from "./constants/locales";
export { SEO_DEFAULTS } from "./constants/seo-defaults";

// Urls
export { buildPath } from "./urls/build-path";
export { buildCanonicalUrl, buildCanonical } from "./urls/build-canonical";

// Alternates
export { buildHreflangAlternates } from "./alternates/build-hreflang";

// Metadata
export { generatePageMetadata, generateMetadata } from "./metadata/generate-page-metadata";

// Schema
export {
  buildOrganization,
  buildLocalBusiness,
  buildLocalBusinessSchema,
  buildService,
  buildServiceSchema,
  buildFaq,
  buildFAQSchema,
  buildBreadcrumb,
  buildBreadcrumbSchema,
  buildArticle,
  buildArticleSchema,
  buildImageGallery,
  getPageSchema,
  JsonLd,
  SchemaScript,
} from "./schema";

// Sitemap
export { generateSitemap, generate } from "./sitemap/generate-sitemap";

// Robots
export { generateRobots, generate as generateRobotsObj } from "./robots/generate-robots";

// Geo
export { buildServiceArea, buildNationalServiceArea, GeoMetaTags, GeoTags, getLocalSeoMarker, getMarker } from "./geo";

// Content
export { CITY_PHRASES, getCityPhrase, buildCityServiceH1, buildCTAText, getServiceFAQ } from "./content";

// Audit
export { validateMetadata, validate, runDeepSeoAudit, calculateKeywordDensity } from "./audit";
