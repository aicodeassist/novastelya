export const SITEMAP_CONFIG = {
  home: { priority: 1.0, changeFrequency: "weekly" as const },
  service: { priority: 0.9, changeFrequency: "monthly" as const },
  city: { priority: 0.85, changeFrequency: "weekly" as const },
  "city-service": { priority: 0.8, changeFrequency: "monthly" as const },
  prices: { priority: 0.8, changeFrequency: "weekly" as const },
  faq: { priority: 0.75, changeFrequency: "monthly" as const },
  blog: { priority: 0.8, changeFrequency: "weekly" as const },
  portfolio: { priority: 0.8, changeFrequency: "weekly" as const },
  contacts: { priority: 0.8, changeFrequency: "monthly" as const },
  about: { priority: 0.7, changeFrequency: "monthly" as const },
} as const;
