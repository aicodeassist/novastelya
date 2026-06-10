import { buildCanonicalUrl } from "@/seo/urls/build-canonical";
import { blogArticles } from "@/config/blog.config";
import { SITEMAP_CONFIG } from "../config";

export function getBlogRoutes() {
  const locales = ["uk", "ru"] as const;
  const config = SITEMAP_CONFIG.blog;
  const postConfig = { priority: 0.7, changeFrequency: "weekly" as const };
  const now = new Date();

  return locales.flatMap((locale) =>
    blogArticles.map((article) => ({
      url: buildCanonicalUrl("blog", locale, undefined, article.slug),
      lastModified: now,
      changeFrequency: postConfig.changeFrequency,
      priority: postConfig.priority,
    }))
  );
}
