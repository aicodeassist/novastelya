import type { PageType } from "@/seo/types/seo.types";
import type { Locale } from "@/config/locales.config";
import { SITE_URL } from "@/seo/constants/site";
import { buildPath } from "./build-path";

export function buildCanonicalUrl(page: PageType, locale: Locale, citySlug?: string, slug?: string): string {
  return `${SITE_URL}${buildPath(page, locale, citySlug, slug)}`;
}
export { buildCanonicalUrl as buildCanonical };
