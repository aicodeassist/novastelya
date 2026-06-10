import { WithContext, BreadcrumbList } from "schema-dts";
import { BreadcrumbItem } from "@/seo/types/schema.types";

export function buildBreadcrumb(items: BreadcrumbItem[]): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}
export { buildBreadcrumb as buildBreadcrumbSchema };
export type { BreadcrumbItem };
