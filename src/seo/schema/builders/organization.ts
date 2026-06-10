import type { WithContext, Organization } from "schema-dts";
import { SITE_URL, SITE_NAME } from "@/seo/constants/site";

export function buildOrganization(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    "name": SITE_NAME,
    "url": SITE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${SITE_URL}/logo.png`,
    },
    "sameAs": [
      "https://www.facebook.com/novastelya",
      "https://www.instagram.com/novastelya",
    ],
  };
}
