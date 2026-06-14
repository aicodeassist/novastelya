import type { PageType } from "@/seo/types/seo.types";
import type { Locale } from "@/config/locales.config";
import { LOCALES } from "@/seo/constants/locales";

const SLUG_MAP: Record<string, string> = {
  // Static pages
  "about": "pro-kompaniyu",
  "contacts": "kontakty",
  "prices": "ciny",
  // Services
  "matte-ceilings": "matovi-steli",
  "glossy-ceilings": "glyancevi-steli",
  "satin-ceilings": "satynovi-steli",
  "fabric-ceilings": "tkanynni-steli",
  "shadow-ceilings": "tinovi-steli",
  "floating-ceilings": "paryashchi-steli",
  "slotted-ceilings": "nishevi-steli",
  "carved-ceilings": "rizbleni-steli",
  "double-level-ceilings": "dvorivnevi-steli",
  "light-lines": "svitlovi-liniyi",
  "track-lighting": "trekove-svitlo",
  "backlight": "konturne-pidsvichuvannya",
  "starry-sky": "zoryane-nebo",
  "kitchen-ceilings": "kukhnya",
  "bathroom-ceilings": "vanna-kimnata",
  "bedroom-ceilings": "spalnya",
  "living-room-ceilings": "vitalnya",
  "childrens-room-ceilings": "dytyacha",
  "office-ceilings": "ofis",
};

export function buildPath(page: PageType, locale: Locale, citySlug?: string, slug?: string): string {
  const prefix = LOCALES[locale].prefix;
  let mainPath = "";

  const resolvedCity = (citySlug && citySlug !== "dnipro") ? citySlug : undefined;
  const resolvedPage = SLUG_MAP[page] || page;
  const resolvedSlug = slug ? (SLUG_MAP[slug] || slug) : undefined;

  if (resolvedPage === "home") {
    mainPath = resolvedCity ? `/${resolvedCity}` : "";
  } else if (resolvedPage === "contacts" || resolvedPage === "kontakty") {
    mainPath = resolvedCity ? `/${resolvedCity}/kontakty` : "/kontakty";
  } else if (resolvedPage === "about" || resolvedPage === "pro-kompaniyu") {
    mainPath = "/pro-kompaniyu";
  } else if (resolvedPage === "prices" || resolvedPage === "ciny") {
    mainPath = resolvedCity ? `/${resolvedCity}/ciny` : "/ciny";
  } else if (resolvedPage === "calculator") {
    mainPath = resolvedCity ? `/${resolvedCity}/calculator` : "/calculator";
  } else if (resolvedPage === "faq") {
    mainPath = resolvedCity ? `/${resolvedCity}/faq` : "/faq";
  } else if (resolvedPage === "portfolio") {
    if (resolvedSlug) {
      mainPath = `/portfolio/${resolvedSlug}`;
    } else {
      mainPath = resolvedCity ? `/${resolvedCity}/portfolio` : "/portfolio";
    }
  } else if (resolvedPage === "blog") {
    mainPath = resolvedSlug ? `/blog/${resolvedSlug}` : "/blog";
  } else {
    // page is a service slug
    const serviceSlug = resolvedPage as string;
    mainPath = resolvedCity ? `/${resolvedCity}/${serviceSlug}` : `/${serviceSlug}`;
  }

  const fullPath = `${prefix}${mainPath}`;
  
  // Clean trailing slash
  if (fullPath.endsWith("/") && fullPath.length > 1) {
    return fullPath.slice(0, -1);
  }
  return fullPath === "" ? "/" : fullPath;
}
