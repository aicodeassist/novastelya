import { describe, expect, it } from "vitest";
import { getCityBySlug } from "@/config/geo-matrix";
import { getCityPhrase } from "@/seo/content/city-copy";
import { getHomeMetadata } from "@/seo/metadata/templates/home";
import { getCityServiceMetadata } from "@/seo/metadata/templates/city-service";
import { getPricesMetadata } from "@/seo/metadata/templates/prices";
import { getServiceFAQ } from "@/seo/content/faq-rules";

describe("Dnipro Ukrainian phrasing", () => {
  const city = getCityBySlug("dnipro");
  if (!city) throw new Error("Dnipro missing from city config");

  it("uses a single preferred city phrase in both locales", () => {
    expect(getCityPhrase("dnipro", "uk")).toBe("в Дніпрі");
    expect(getCityPhrase("dnipro", "ru")).toBe("в Днепре");
  });

  it("uses the phrase in the Ukrainian homepage SEO title and description", () => {
    const meta = getHomeMetadata({ pageType: "home", city, locale: "uk" });
    expect(meta.title).toBe("Натяжні стелі в Дніпрі за 1 день | NOVA STELYA");
    expect(meta.description).toContain("в Дніпрі");
  });

  it("uses the phrase in service and price metadata", () => {
    const service = getCityServiceMetadata({ pageType: "matovi-steli", city, locale: "uk" });
    const prices = getPricesMetadata({ pageType: "prices", city, locale: "uk" });
    expect(service.title).toContain("в Дніпрі");
    expect(service.description).toContain("в Дніпрі");
    expect(prices.title).toContain("в Дніпрі");
  });

  it("uses the shared phrase in FAQs in both languages", () => {
    const ukFAQ = getServiceFAQ("Матові натяжні стелі", "uk", city);
    const ruFAQ = getServiceFAQ("Матовые натяжные потолки", "ru", city);
    expect(ukFAQ.some((item) => item.q.includes("в Дніпрі"))).toBe(true);
    expect(ruFAQ.some((item) => item.q.includes("в Днепре"))).toBe(true);
  });
});
