import { WithContext, FAQPage } from "schema-dts";
import { FAQItem } from "@/seo/types/schema.types";

export function buildFaq(faqs: FAQItem[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };
}
export { buildFaq as buildFAQSchema };
export type { FAQItem };
