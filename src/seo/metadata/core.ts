import { SEO_DEFAULTS, SITE } from "@/seo/constants";

export function buildTitle(title: string): string {
  const full = `${title} | ${SITE.name}`;
  return full.length > 60 ? title.substring(0, 57) + "..." : full;
}

export function buildDescription(desc: string): string {
  return desc.length > 155 ? desc.substring(0, 152) + "..." : desc;
}

export function buildOpenGraph({
  title,
  description,
  url,
  locale,
  imageSlug,
}: {
  title: string;
  description: string;
  url: string;
  locale: "uk" | "ru";
  imageSlug?: string;
}) {
  const ogImageUrl = `${SITE.url}/og/${imageSlug ?? "default"}.jpg`;
  return {
    title,
    description,
    url,
    siteName: SITE.name,
    locale: locale === "uk" ? "uk_UA" : "ru_UA",
    type: "website" as const,
    images: [
      {
        url: ogImageUrl,
        width: SEO_DEFAULTS.ogImageWidth,
        height: SEO_DEFAULTS.ogImageHeight,
        alt: title,
      },
    ],
  };
}

export function buildTwitterCard(title: string, description: string, imageSlug?: string) {
  const ogImageUrl = `${SITE.url}/og/${imageSlug ?? "default"}.jpg`;
  return {
    card: SEO_DEFAULTS.twitterCard,
    title,
    description,
    images: [ogImageUrl],
  };
}
