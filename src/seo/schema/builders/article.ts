import { WithContext, Article } from "schema-dts";
import { SITE_URL } from "@/seo/constants/site";

type BuildArticleSchemaParams = {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
};

export function buildArticle({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  authorName,
}: BuildArticleSchemaParams): WithContext<Article> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
    },
    "headline": title,
    "description": description,
    "image": imageUrl,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": `${SITE_URL}/about`,
    },
    "publisher": {
      "@type": "Organization",
      "name": "NOVA STELYA",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`,
      },
    },
  };
}
export { buildArticle as buildArticleSchema };
