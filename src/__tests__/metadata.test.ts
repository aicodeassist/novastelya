import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMetadataTemplate } from "@/seo/metadata/templates";
import fs from "fs";

describe("SEO Metadata Templates", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should fallback to room template for a service in rooms category if overrides are present", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify({
      room: {
        uk: {
          title: "Натяжна стеля в кімнату {service} у місті {city}",
          description: "Опис кімнати {service}"
        }
      }
    }));

    const ctx = {
      pageType: "kitchen-ceilings", // category: "rooms"
      locale: "uk" as const,
      city: {
        slug: "odesa",
        uk: "Одеса",
        ru: "Одесса",
        phone: "+380 48 000-00-00",
        address: "вул. Дерибасівська, 1",
        region: "UA-51",
        active: true,
        coordinates: { lat: 46.48, lon: 30.72 },
        priceModifier: 1.05
      }
    };

    const meta = getMetadataTemplate(ctx);
    expect(meta.title).toContain("Натяжна стеля в кімнату Натяжні стелі на кухню у місті Одеса");
    expect(meta.description).toBe("Опис кімнати Натяжні стелі на кухню");
  });

  it("should fallback to service template for non-room services if room template is configured", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify({
      room: {
        uk: {
          title: "Шаблон кімнати {service}",
          description: "Опис"
        }
      },
      service: {
        uk: {
          title: "Шаблон послуги {service}",
          description: "Опис послуги"
        }
      }
    }));

    const ctx = {
      pageType: "matte-ceilings", // materials category
      locale: "uk" as const,
      city: null
    };

    const meta = getMetadataTemplate(ctx);
    expect(meta.title).toBe("Шаблон послуги Матові натяжні стелі");
  });
});
