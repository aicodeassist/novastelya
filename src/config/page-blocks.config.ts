export const pageBlocks = {
  "service-page": [
    "HeroService",        // H1 + фото + CTA
    "ServiceBenefits",    // Переваги конкретної послуги
    "Gallery",            // Фотогалерея з Sanity
    "PriceTable",         // Таблиця цін (регіональна якщо є city)
    "Calculator",         // Розрахунок вартості
    "ServiceProcess",     // Як відбувається монтаж
    "Reviews",            // Відгуки клієнтів
    "FAQSection",         // FAQPage Schema
    "CTA",                // Заклик до дії
  ],
  "double-level-ceilings": [
    "HeroService",
    "3DShowcase",         // 3D-візуалізація дворівневих стель
    "Gallery",
    "PriceTable",
    "Calculator",
    "ServiceProcess",
    "Reviews",
    "FAQSection",
    "CTA",
  ],
  "city-hub": [
    "HeroCityHub",        // H1 з назвою міста + local фото
    "CityServices",       // Сітка всіх послуг з цінами
    "LocalAdvantages",    // Переваги для конкретного міста
    "LocalPortfolio",     // Роботи в цьому місті
    "LocalReviews",       // Відгуки з цього міста
    "Map",                // Google Maps з офісом
    "CTA",
  ]
} as const;

export type PageBlockType = keyof typeof pageBlocks;
