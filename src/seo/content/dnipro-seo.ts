import data from "./dnipro-seo-baseline.json";

export type DniproSeo = {
  title: string;
  description: string;
  h1: string;
};

type Locale = "uk" | "ru";
const pages = data.pages as Record<string, Record<Locale, DniproSeo>>;

/** Canonical metadata for the Dnipro market. Other cities retain their own templates. */
export function getDniproSeo(
  page: string,
  locale: Locale,
  citySlug: string | null | undefined,
  itemSlug?: string
): DniproSeo | null {
  if (citySlug !== "dnipro" || itemSlug) return null;
  return pages[page]?.[locale] ?? null;
}
