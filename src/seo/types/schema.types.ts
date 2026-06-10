import type { Thing } from "schema-dts";
import type { CityConfig } from "@/config/geo-matrix";
import type { ServiceConfig } from "@/config/services.config";

export type SchemaGraph = {
  "@context": "https://schema.org";
  "@graph": Thing[];
};

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export type FAQItem = {
  q: string;
  a: string;
};

export type PageSchemaConfig = {
  pageType: string;
  city?: CityConfig | null;
  service?: ServiceConfig | null;
  faqItems?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
};
