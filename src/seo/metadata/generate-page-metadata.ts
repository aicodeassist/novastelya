import type { Metadata } from "next";
import type { PageType } from "@/seo/types/seo.types";
import type { Locale } from "@/config/locales.config";
import type { CityConfig } from "@/config/geo-matrix";
import { buildCanonicalUrl } from "@/seo/urls/build-canonical";
import { buildHreflangAlternates } from "@/seo/alternates/build-hreflang";
import { buildOpenGraph, buildTwitterCard } from "./core";
import { getMetadataTemplate } from "./templates";
import { SITE_URL } from "@/seo/constants/site";
import fs from "fs";
import path from "path";

export type MetadataParams = {
  page: PageType;
  city?: CityConfig | null;
  locale: Locale;
  slug?: string;
  noindex?: boolean;
  overrides?: Partial<Metadata>;
};

let cachedOverrides: Record<string, { title?: string; description?: string }> | null = null;

function getMetadataOverrides(): Record<string, { title?: string; description?: string }> {
  if (process.env.NODE_ENV === "production" && cachedOverrides) {
    return cachedOverrides;
  }
  try {
    const filePath = path.join(process.cwd(), "src/seo/content/overrides.json");
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(data);
      if (process.env.NODE_ENV === "production") {
        cachedOverrides = parsed;
      }
      return parsed;
    }
  } catch (e) {
    // Ignore error in read-only environment
  }
  return {};
}

export async function generatePageMetadata({
  page,
  city,
  locale: rawLocale,
  slug,
  noindex,
  overrides,
}: MetadataParams): Promise<Metadata> {
  const locale: Locale = rawLocale === "ru" ? "ru" : "uk";
  
  const ctx = {
    pageType: page,
    locale,
    city,
    slug,
    noindex,
  };

  const template = getMetadataTemplate(ctx);
  
  // Apply overrides if present
  const overrideKey = `${locale}-${city?.slug || "national"}-${page}`;
  const allOverrides = getMetadataOverrides();
  const pageOverride = allOverrides[overrideKey];
  
  const title = pageOverride?.title || template.title;
  const description = pageOverride?.description || template.description;

  const canonical = buildCanonicalUrl(page, locale, city?.slug, slug);
  const alternates = buildHreflangAlternates(page, city?.slug, slug);

  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  const robotsConfig = (!allowIndexing || noindex || (overrides?.robots as any) === false || (overrides?.robots && typeof overrides.robots === 'object' && (overrides.robots as any).index === false))
    ? {
        index: false,
        follow: true,
        googleBot: {
          index: false,
          follow: true,
        },
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large" as const,
        },
      };

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
      languages: alternates,
    },
    openGraph: buildOpenGraph({
      title,
      description,
      url: canonical,
      locale,
      imageSlug: template.ogImageSlug,
    }),
    twitter: buildTwitterCard(title, description, template.ogImageSlug),
    ...overrides,
    robots: robotsConfig,
  };
}
export { generatePageMetadata as generateMetadata };

