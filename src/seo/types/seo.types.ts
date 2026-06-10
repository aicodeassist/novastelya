import type { CityConfig } from "@/config/geo-matrix";
import type { ServiceSlug } from "@/config/services.config";
import type { Locale } from "@/config/locales.config";

export type PageType =
  | "home"
  | "prices"
  | "faq"
  | "portfolio"
  | "blog"
  | "contacts"
  | "about"
  | "calculator"
  | ServiceSlug;

export type SeoContext = {
  pageType: PageType;
  locale: Locale;
  city?: CityConfig | null;
  slug?: string; // для blog/portfolio
  noindex?: boolean;
};
