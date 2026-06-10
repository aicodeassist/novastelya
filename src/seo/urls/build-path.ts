import type { PageType } from "@/seo/types/seo.types";
import type { Locale } from "@/config/locales.config";
import { LOCALES } from "@/seo/constants/locales";

export function buildPath(page: PageType, locale: Locale, citySlug?: string, slug?: string): string {
  const prefix = LOCALES[locale].prefix;
  let mainPath = "";

  if (page === "home") {
    mainPath = citySlug ? `/${citySlug}` : "";
  } else if (page === "contacts") {
    mainPath = citySlug ? `/${citySlug}/contacts` : "/contacts";
  } else if (page === "about") {
    mainPath = "/about";
  } else if (page === "prices") {
    mainPath = citySlug ? `/${citySlug}/prices` : "/prices";
  } else if (page === "calculator") {
    mainPath = citySlug ? `/${citySlug}/calculator` : "/calculator";
  } else if (page === "faq") {
    mainPath = citySlug ? `/${citySlug}/faq` : "/faq";
  } else if (page === "portfolio") {
    if (slug) {
      mainPath = `/portfolio/${slug}`;
    } else {
      mainPath = citySlug ? `/${citySlug}/portfolio` : "/portfolio";
    }
  } else if (page === "blog") {
    mainPath = slug ? `/blog/${slug}` : "/blog";
  } else {
    // page is a service slug
    const serviceSlug = page as string;
    mainPath = citySlug ? `/${citySlug}/${serviceSlug}` : `/${serviceSlug}`;
  }

  const fullPath = `${prefix}${mainPath}`;
  
  // Clean trailing slash
  if (fullPath.endsWith("/") && fullPath.length > 1) {
    return fullPath.slice(0, -1);
  }
  return fullPath === "" ? "/" : fullPath;
}
