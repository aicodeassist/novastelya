import settings from "@/config/settings.json";

export const SITE = {
  url: settings.contacts.url || "https://novastelya.com",
  name: settings.contacts.siteName || "NOVA STELYA",
  brand: settings.contacts.brand || "NOVA STELYA",
  defaultLocale: "uk",
  phone0800: settings.contacts.phone || "0 800 000-000",
  email: settings.contacts.email || "info@novastelya.com",
  foundingYear: settings.contacts.foundingYear || 2015,
} as const;

export const SITE_URL = SITE.url;
export const SITE_NAME = SITE.name;

