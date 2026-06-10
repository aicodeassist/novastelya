import type { PageType } from "@/seo/types/seo.types";
import { SITE_URL } from "@/seo/constants/site";
import { buildPath } from "@/seo/urls/build-path";

export type HreflangAlternates = {
  "x-default": string;
  "uk-UA": string;
  "ru-UA": string;
};

export function buildHreflangAlternates(page: PageType, citySlug?: string, slug?: string): HreflangAlternates {
  const ukPath = buildPath(page, "uk", citySlug, slug);
  const ruPath = buildPath(page, "ru", citySlug, slug);

  return {
    "x-default": `${SITE_URL}${ukPath}`,
    "uk-UA": `${SITE_URL}${ukPath}`,
    "ru-UA": `${SITE_URL}${ruPath}`,
  };
}
