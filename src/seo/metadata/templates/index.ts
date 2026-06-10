import type { SeoContext } from "@/seo/types/seo.types";
import { getHomeMetadata } from "./home";
import { getServiceMetadata } from "./service";
import { getCityMetadata } from "./city";
import { getCityServiceMetadata } from "./city-service";
import { getPricesMetadata } from "./prices";
import { getFaqMetadata } from "./faq";
import { getBlogListMetadata } from "./blog-list";
import { getBlogPostMetadata } from "./blog-post";
import { getPortfolioMetadata } from "./portfolio";
import { getContactsMetadata } from "./contacts";
import { getCalculatorMetadata } from "./calculator";
import { getServiceBySlug } from "@/config/services.config";
import fs from "fs";
import path from "path";
import { applyTemplatePlaceholders } from "./parser";

let cachedTemplateOverrides: any = null;

function getTemplateOverrides() {
  if (process.env.NODE_ENV === "production" && cachedTemplateOverrides) {
    return cachedTemplateOverrides;
  }
  try {
    const filePath = path.join(process.cwd(), "src/seo/content/template-overrides.json");
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(data);
      if (process.env.NODE_ENV === "production") {
        cachedTemplateOverrides = parsed;
      }
      return parsed;
    }
  } catch (e) {
    // Ignore error in read-only environment
  }
  return {};
}

export function getMetadataTemplate(ctx: SeoContext) {
  const { pageType, locale } = ctx;
  
  const overrides = getTemplateOverrides();
  let templateKey: string = pageType;
  const service = getServiceBySlug(pageType);
  if (service) {
    if (!overrides[pageType]) {
      if (service.category === "rooms" && overrides["room"]) {
        templateKey = "room";
      } else {
        templateKey = "service";
      }
    }
  }

  const pageTemplate = overrides[templateKey]?.[locale];
  if (pageTemplate && (pageTemplate.title || pageTemplate.description)) {
    return {
      title: applyTemplatePlaceholders(pageTemplate.title, ctx),
      description: applyTemplatePlaceholders(pageTemplate.description, ctx),
      ogImageSlug: service ? `service-${pageType}` : pageType,
    };
  }

  if (pageType === "home") return getHomeMetadata(ctx);
  if (pageType === "prices") return getPricesMetadata(ctx);
  if (pageType === "calculator") return getCalculatorMetadata(ctx);
  if (pageType === "faq") return getFaqMetadata(ctx);
  if (pageType === "blog") {
    if (ctx.slug) return getBlogPostMetadata(ctx);
    return getBlogListMetadata(ctx);
  }
  if (pageType === "portfolio") return getPortfolioMetadata(ctx);
  if (pageType === "contacts") return getContactsMetadata(ctx);
  if (pageType === "about") {
    const isUk = locale === "uk";
    return {
      title: isUk
        ? "Про компанію NOVA STELYA — виробник натяжних стель з 2016 року"
        : "О компании NOVA STELYA — производитель натяжных потолков с 2016 года",
      description: isUk
        ? "Професійний монтаж натяжних стель з 2016 року. Сертифіковані матеріали, кваліфіковані майстри, сучасне обладнання. Дізнайтеся більше про наші цінності."
        : "Профессиональный монтаж натяжных потолков с 2016 года. Сертифицированные материалы, квалифицированные мастера, современное оборудование. Узнайте больше о нас.",
      ogImageSlug: "about",
    };
  }

  // It's either "service" or "city-service"
  if (service) {
    if (ctx.city) {
      return getCityServiceMetadata(ctx);
    }
    return getServiceMetadata(ctx);
  }

  // Fallback
  return {
    title: "NOVA STELYA",
    description: "",
    ogImageSlug: "default",
  };
}

