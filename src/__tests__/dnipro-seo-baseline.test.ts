import { describe, expect, it } from "vitest";
import baseline from "@/seo/content/dnipro-seo-baseline.json";
import { getDniproSeo } from "@/seo/content/dnipro-seo";
import { services } from "@/config/services.config";
import { buildTitle, buildDescription } from "@/seo/metadata/core";

describe("portable Dnipro SEO baseline", () => {
  it("covers all current services and core pages in both languages", () => {
    for (const page of ["home", "prices", "portfolio", "faq", "contacts", "about", "blog", "calculator", ...services.map((x) => x.slug)]) {
      for (const locale of ["uk", "ru"] as const) {
        const meta = getDniproSeo(page, locale, "dnipro");
        expect(meta, page + "/" + locale).not.toBeNull();
        expect(meta?.title).toBeTruthy();
        expect(meta?.description).toBeTruthy();
        expect(meta?.h1).toBeTruthy();
        expect(meta?.title).not.toContain("...");
        expect(meta?.description).not.toContain("...");
        expect(meta?.title).not.toMatch(/в Україні|в Украине/);
        expect(meta?.h1).not.toMatch(/в Україні|в Украине/);
      }
    }
    expect(Object.keys(baseline.pages)).toHaveLength(services.length + 8);
  });

  it("does not apply Dnipro titles to other cities or individual blog posts", () => {
    expect(getDniproSeo("home", "uk", "kyiv")).toBeNull();
    expect(getDniproSeo("blog", "uk", "dnipro", "some-post")).toBeNull();
  });

  it("keeps the selected homepage title and useful service H1", () => {
    expect(getDniproSeo("home", "uk", "dnipro")?.title).toBe("Натяжні стелі в Дніпрі за 1 день | NOVA STELYA");
    expect(getDniproSeo("matovi-steli", "uk", "dnipro")?.h1).toBe("Матові натяжні стелі в Дніпрі");
  });

  it("does not hard-truncate fallback titles or descriptions", () => {
    const title = "Довгий, але змістовний заголовок послуги для конкретного міста та умов монтажу";
    const desc = "Опис сторінки. ".repeat(20);
    expect(buildTitle(title)).toBe(title + " | NOVA STELYA");
    expect(buildDescription(desc)).toBe(desc);
  });
});
