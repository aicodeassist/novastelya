import type { SeoContext } from "@/seo/types/seo.types";
import { buildTitle, buildDescription } from "../core";
import { blogArticles } from "@/config/blog.config";

export function getBlogPostMetadata(ctx: SeoContext) {
  const { slug, locale } = ctx;
  const isUk = locale === "uk";
  
  if (slug) {
    const article = blogArticles.find((a) => a.slug === slug);
    if (article) {
      return {
        title: buildTitle(isUk ? article.titleUk : article.titleRu),
        description: buildDescription(isUk ? article.descUk : article.descRu),
        ogImageSlug: `blog-${slug}`,
      };
    }
  }

  return {
    title: buildTitle(isUk ? "Стаття про натяжні стелі" : "Статья о натяжных потолках"),
    description: buildDescription(""),
    ogImageSlug: "blog",
  };
}
