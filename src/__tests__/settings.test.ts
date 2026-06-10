import { describe, it, expect } from "vitest";
import settings from "@/config/settings.json";
import { SITE, SITE_URL, SITE_NAME } from "@/seo/constants/site";

describe("CMS Settings Integrity", () => {
  it("should contain design theme tokens in settings.json", () => {
    expect(settings).toHaveProperty("theme");
    expect(settings.theme).toHaveProperty("colors");
    expect(settings.theme).toHaveProperty("fonts");
    expect(settings.theme).toHaveProperty("radius");
    
    expect(settings.theme.colors).toHaveProperty("gold");
    expect(settings.theme.colors.gold).toBe("#BFA05D");
    expect(settings.theme.fonts).toHaveProperty("sans");
    expect(settings.theme.radius).toHaveProperty("md");
  });

  it("should contain brand contact settings in settings.json", () => {
    expect(settings).toHaveProperty("contacts");
    expect(settings.contacts).toHaveProperty("brand");
    expect(settings.contacts.brand).toBe("NOVA STELYA");
    expect(settings.contacts).toHaveProperty("phone");
    expect(settings.contacts).toHaveProperty("email");
    expect(settings.contacts).toHaveProperty("socials");
    expect(settings.contacts.socials).toHaveProperty("instagram");
  });

  it("should propagate contacts to site.ts correctly", () => {
    expect(SITE.brand).toBe(settings.contacts.brand);
    expect(SITE.phone0800).toBe(settings.contacts.phone);
    expect(SITE.email).toBe(settings.contacts.email);
    expect(SITE_URL).toBe(settings.contacts.url);
    expect(SITE_NAME).toBe(settings.contacts.siteName);
  });
});
