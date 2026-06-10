import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render } from "@testing-library/react"; // If available, but we can do functional testing or simple object validation
import { replacePlaceholders } from "@/components/blocks/BlockRenderer";
import { getServiceBySlug } from "@/config/services.config";

// Mock Site Name and City Phrase
vi.mock("@/seo/content/city-copy", () => ({
  getCityPhrase: (slug: string, locale: string) => {
    return slug === "kyiv" ? (locale === "uk" ? "у Києві" : "в Киеве") : "";
  }
}));

vi.mock("@/seo/constants/site", () => ({
  SITE_NAME: "NOVA STELYA"
}));

describe("Dynamic Blocks Naming and Placeholders", () => {
  const mockCity = {
    slug: "kyiv",
    uk: "Київ",
    ru: "Киев",
    phone: "+380 44 000-00-00",
    address: "вул. Хрещатик, 1",
    region: "UA-30",
    active: true,
    coordinates: { lat: 50.45, lon: 30.52 },
    priceModifier: 1.0
  };

  it("should replace placeholders in templates correctly for UK locale", () => {
    const template = "Натяжні стелі {cityPhrase} від {siteName}. Телефон: {cityPhone}";
    const result = replacePlaceholders(template, "uk", mockCity);
    expect(result).toBe("Натяжні стелі у Києві від NOVA STELYA. Телефон: +380 44 000-00-00");
  });

  it("should replace placeholders in templates correctly for RU locale", () => {
    const template = "Натяжные потолки {cityPhrase} от {siteName}. Телефон: {cityPhone}";
    const result = replacePlaceholders(template, "ru", mockCity);
    expect(result).toBe("Натяжные потолки в Киеве от NOVA STELYA. Телефон: +380 44 000-00-00");
  });

  it("should fall back to general country phrase if city is null", () => {
    const template = "Монтаж натяжних стель {cityPhrase}";
    const result = replacePlaceholders(template, "uk", null);
    expect(result).toBe("Монтаж натяжних стель в Україні");
  });

  it("should resolve services and room service categories correctly", () => {
    const matte = getServiceBySlug("matte-ceilings");
    expect(matte).not.toBeNull();
    expect(matte?.category).toBe("materials");

    const kitchen = getServiceBySlug("kitchen-ceilings");
    expect(kitchen).not.toBeNull();
    expect(kitchen?.category).toBe("rooms");
  });
});
