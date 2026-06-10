# SEO PLATFORM LAYER — NOVA STELYA

## Специфікація v3.0 FINAL · Next.js 16.2+

> **Для AI-агента:** Це самостійний модуль `platform/seo/`.
> Читай цей файл повністю перед будь-яким кодом.
> Головний принцип: **жодного SEO-коду поза `platform/seo/`**.

-----

## ЗМІСТ

1. [Аудит пропозиції — що залишаємо, що змінюємо](#1-аудит)
1. [Фінальна архітектура](#2-фінальна-архітектура)
1. [Детальна специфікація кожного модуля](#3-специфікація-модулів)
1. [Public API — index.ts](#4-public-api)
1. [Правила використання в app/](#5-правила-використання)
1. [Типи TypeScript](#6-типи)
1. [Константи](#7-константи)
1. [Чеклист якості](#8-чеклист)

-----

## 1. АУДИТ

### Що в твоїй пропозиції — правильно ✅

|Рішення                              |Чому правильно                    |
|-------------------------------------|----------------------------------|
|`seo/` як окремий Platform Layer     |Єдина точка відповідальності      |
|`metadata/templates/` per page-type  |Кожен тип сторінки — свій шаблон  |
|`schema/builders/`                   |Фабрики незалежні, легко тестувати|
|`sitemap/routes/` розділений по типах|Масштабується без переписування   |
|`alternates/` як окремий модуль      |hreflang — критична SEO-логіка    |
|`urls/` як окремий модуль            |URL — фундамент всього SEO        |
|`types/`                             |TypeScript строгість обов’язкова  |
|`content/` з правилами               |SEO-копірайтинг system-driven     |

### Що змінюємо та чому ⚠️

|Пропозиція                                                                        |Проблема                           |Рішення                             |
|----------------------------------------------------------------------------------|-----------------------------------|------------------------------------|
|`builders/build-title.ts` окремий файл                                            |10 рядків не заслуговують файлу    |Частина `metadata/core.ts`          |
|`builders/build-twitter.ts`                                                       |3 рядки об’єкту                    |Частина `metadata/core.ts`          |
|`content/faq/` — директорія без файлів                                            |Незакінчена думка                  |`content/faq-rules.ts`              |
|`performance/` в seo/                                                             |Performance ≠ SEO layer            |Залишається в `src/lib/performance/`|
|`utils/slugify.ts`                                                                |Загальна утиліта, не SEO-специфічна|`src/lib/utils/`                    |
|`geo/service-area.ts` окремо                                                      |Частина `geo/local-seo.ts`         |Злити                               |
|`sitemap/change-frequency.ts` окремо                                              |10 рядків                          |Частина `sitemap/config.ts`         |
|Дублювання: `metadata/builders/build-hreflang.ts` + `alternates/build-hreflang.ts`|Дублювання логіки                  |Тільки в `alternates/`              |

### Що додаємо ➕

|Новий модуль            |Причина                                  |
|------------------------|-----------------------------------------|
|`schema/page-schemas.ts`|Комбінує builders для конкретних сторінок|
|`content/city-copy.ts`  |City-aware H1/CTA/descriptions           |
|`audit/`                |Runtime SEO audit в dev mode             |

-----

## 2. ФІНАЛЬНА АРХІТЕКТУРА

```
src/
└── platform/
    └── seo/                            ← ⭐ SEO PLATFORM LAYER
        │                                  Розташування всередині platform/
        │                                  бо SEO = server-only business logic
        │
        ├── index.ts                    ← PUBLIC API (тільки звідси імпортувати)
        │                                  import { ... } from "@/platform/seo"
        │
        ├── types/
        │   ├── metadata.types.ts
        │   ├── schema.types.ts
        │   ├── seo.types.ts
        │   └── index.ts
        │
        ├── constants/
        │   ├── site.ts                 ← SITE_URL, SITE_NAME, BRAND
        │   ├── locales.ts              ← uk-UA / ru-UA / x-default маппінг
        │   ├── seo-defaults.ts         ← fallback title/desc/OG
        │   ├── routes.ts               ← всі slug константи
        │   └── index.ts
        │
        ├── urls/
        │   ├── build-path.ts           ← buildPath(page, city?, locale)
        │   │                              trailingSlash: false aware
        │   ├── build-canonical.ts      ← buildCanonicalUrl(...)
        │   ├── route-map.ts            ← повна карта роутів
        │   ├── redirects.ts            ← 301 правила
        │   └── index.ts
        │
        ├── alternates/
        │   ├── build-hreflang.ts       ← uk-UA · ru-UA · x-default ТІЛЬКИ
        │   ├── locales-map.ts
        │   └── index.ts
        │
        ├── metadata/
        │   ├── core.ts                 ← buildTitle · buildDescription
        │   │                              buildOG · buildTwitter
        │   ├── generate-page-metadata.ts  ← головна функція + override check
        │   ├── templates/
        │   │   ├── home.ts
        │   │   ├── service.ts
        │   │   ├── city.ts
        │   │   ├── city-service.ts     ← ключовий: місто × послуга
        │   │   ├── prices.ts
        │   │   ├── faq.ts
        │   │   ├── blog-list.ts
        │   │   ├── blog-post.ts
        │   │   ├── portfolio.ts
        │   │   └── contacts.ts
        │   └── index.ts
        │
        ├── schema/
        │   ├── builders/               ← атомарні фабрики
        │   │   ├── organization.ts
        │   │   ├── local-business.ts
        │   │   ├── service.ts
        │   │   ├── faq.ts
        │   │   ├── breadcrumb.ts
        │   │   ├── article.ts
        │   │   ├── review.ts
        │   │   ├── aggregate-rating.ts
        │   │   └── image-gallery.ts
        │   ├── page-schemas.ts         ← комбінує builders per тип сторінки
        │   └── index.ts
        │   ← JsonLd.tsx → src/ui/JsonLd.tsx (React component, не логіка)
        │
        ├── sitemap/
        │   ├── config.ts               ← priorities + changeFrequency
        │   ├── generate-sitemap.ts     ← збирає всі routes
        │   ├── routes/
        │   │   ├── static-routes.ts
        │   │   ├── service-routes.ts
        │   │   ├── city-routes.ts
        │   │   ├── city-service-routes.ts  ← матриця місто × послуга
        │   │   ├── blog-routes.ts
        │   │   └── portfolio-routes.ts
        │   └── index.ts
        │
        ├── robots/
        │   ├── generate-robots.ts
        │   └── index.ts
        │
        ├── geo/
        │   ├── local-seo.ts            ← service-area + LocalBusiness helpers
        │   └── index.ts
        │   ← GeoMetaTags.tsx → src/ui/GeoMetaTags.tsx (React component)
        │
        ├── content/
        │   ├── city-copy.ts            ← city-aware H1, CTA, descriptions
        │   ├── faq-rules.ts            ← FAQ без city-спаму
        │   ├── seo-copy-rules.ts
        │   ├── title-rules.ts
        │   ├── description-rules.ts
        │   ├── forbidden-patterns.ts
        │   └── index.ts
        │
        └── audit/                      ← dev-only SEO audit
            ├── validate-metadata.ts
            ├── validate-schema.ts
            ├── audit-engine.ts         ← full site audit
            ├── seo-score.ts
            ├── report-generator.ts
            └── index.ts

src/ui/
├── JsonLd.tsx                          ← ⭐ Server Component · inject JSON-LD
│                                          import { getPageSchema } from "@/platform/seo"
│                                          renders <script type="application/ld+json">
├── GeoMetaTags.tsx                     ← ⭐ Server Component · geo meta tags
└── ...
```

-----

## 3. СПЕЦИФІКАЦІЯ МОДУЛІВ

### 3.1 `types/` — типи першими

```typescript
// types/seo.types.ts
import type { CityConfig } from "@/config/geo-matrix";

export type Locale = "uk" | "ru";
export type ServiceSlug = "matte-ceilings" | "glossy-ceilings" | "satin-ceilings"
  | "fabric-ceilings" | "shadow-ceilings" | "floating-ceilings"
  | "slotted-ceilings" | "carved-ceilings" | "double-level-ceilings"
  | "light-lines" | "track-lighting" | "backlight" | "starry-sky"
  | "kitchen-ceilings" | "bathroom-ceilings" | "bedroom-ceilings"
  | "living-room-ceilings";

export type PageType =
  | "home"
  | "service"
  | "city"
  | "city-service"      // ← ключова комбінація
  | "prices"
  | "faq"
  | "blog-list"
  | "blog-post"
  | "portfolio"
  | "contacts";

export type SeoContext = {
  pageType: PageType;
  locale: Locale;
  city?: CityConfig;
  serviceSlug?: ServiceSlug;
  blogSlug?: string;
  portfolioSlug?: string;
  basePrice?: number;
};
```

```typescript
// types/metadata.types.ts
export type TitleConfig = {
  pattern: string;         // "{service} у {city} — {brand}"
  maxLength: 60;
  minLength: 30;
};

export type DescriptionConfig = {
  pattern: string;
  maxLength: 155;
  minLength: 100;
  mustInclude: string[];   // обов'язкові слова
};
```

```typescript
// types/schema.types.ts
import type { Thing, WithContext } from "schema-dts";

export type SchemaGraph = {
  "@context": "https://schema.org";
  "@graph": Thing[];
};

export type PageSchemaConfig = {
  pageType: PageType;
  city?: CityConfig;
  service?: ServiceConfig;
  faqItems?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
};
```

-----

### 3.2 `constants/` — незмінні значення

```typescript
// constants/site.ts
export const SITE = {
  url: "https://novastelya.com",
  name: "NOVA STELYA",
  brand: "NOVA STELYA",
  defaultLocale: "uk",
  phone0800: "0 800 000-000",
  email: "info@novastelya.com",
  foundingYear: 2015,
} as const;
```

```typescript
// constants/locales.ts
export const LOCALES = {
  uk: {
    code: "uk",
    hreflang: "uk-UA",       // ✅ для <link rel="alternate">
    prefix: "",
    ogLocale: "uk_UA",       // для OpenGraph
    label: "Українська",
  },
  ru: {
    code: "ru",
    hreflang: "ru-UA",       // ✅ ru-UA не ru-UA (бізнес в Україні!)
    prefix: "/ru",
    ogLocale: "ru_UA",
    label: "Русский",
  },
} as const;

export const DEFAULT_LOCALE = "uk" as const;
// x-default завжди вказує на uk-UA версію
export const XDEFAULT_LOCALE = "uk" as const;
```

```typescript
// constants/seo-defaults.ts
// Fallback значення коли немає специфічних даних
export const SEO_DEFAULTS = {
  titleSuffix: "| NOVA STELYA",
  titleTemplate: "{page} | NOVA STELYA",
  ogImage: "/og/default.jpg",         // 1200×630
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: "summary_large_image" as const,
  robots: "index, follow",
  googlebot: "index, follow, max-image-preview:large",
} as const;
```

```typescript
// constants/routes.ts
// Всі slug як константи — ніякого хардкоду в app/
export const ROUTES = {
  home: "/",
  prices: "/prices/",
  faq: "/faq/",
  portfolio: "/portfolio/",
  blog: "/blog/",
  contacts: "/contacts/",
  services: {
    "matte-ceilings": "/matte-ceilings/",
    "glossy-ceilings": "/glossy-ceilings/",
    // ... всі 18 послуг
  },
} as const;
```

-----

### 3.3 `urls/` — фундамент побудови URL

```typescript
// urls/build-path.ts
import { LOCALES } from "@/platform/seo/constants";
import type { SeoContext } from "@/platform/seo/types";

/**
 * Єдина функція побудови шляху.
 * Всі URL сайту проходять через неї.
 */
export function buildPath({
  pageType,
  locale,
  city,
  serviceSlug,
  blogSlug,
  portfolioSlug,
}: SeoContext): string {
  const pfx = LOCALES[locale].prefix;

  switch (pageType) {
    case "home":         return `${pfx}/`;
    case "service":      return `${pfx}/${serviceSlug}/`;
    case "city":         return `${pfx}/${city!.slug}/`;
    case "city-service": return `${pfx}/${city!.slug}/${serviceSlug}/`;
    case "prices":       return `${pfx}/prices/`;
    case "faq":          return `${pfx}/faq/`;
    case "blog-list":    return `${pfx}/blog/`;
    case "blog-post":    return `${pfx}/blog/${blogSlug}/`;
    case "portfolio":    return `${pfx}/portfolio/`;
    case "contacts":     return `${pfx}/contacts/`;
    default:             return `${pfx}/`;
  }
}
```

```typescript
// urls/build-canonical.ts
import { SITE } from "@/platform/seo/constants";
import { buildPath } from "./build-path";
import type { SeoContext } from "@/platform/seo/types";

export function buildCanonicalUrl(ctx: SeoContext): string {
  return `${SITE.url}${buildPath(ctx)}`;
}
```

```typescript
// urls/redirects.ts
// 301 правила — всі в одному місці
export const REDIRECTS = [
  // Без trailing slash → зі слешем (обробляється next.config.ts)
  // Старі URL якщо були
  { source: "/ua/:path*", destination: "/:path*", permanent: true },
  { source: "/index.html", destination: "/", permanent: true },
] as const;
```

-----

### 3.4 `alternates/` — hreflang

```typescript
// alternates/build-hreflang.ts
import { SITE, LOCALES } from "@/platform/seo/constants";
import { buildPath } from "@/platform/seo/urls";
import type { SeoContext } from "@/platform/seo/types";

export type HreflangAlternates = {
  "x-default": string;
  "uk-UA": string;   // ✅ мова-РЕГІОН: Ukrainian + Ukraine
  "ru-UA": string;   // ✅ мова-РЕГІОН: Russian + Ukraine (НЕ ru-RU!)
};

// Генерує:
// <link rel="alternate" hreflang="uk-UA" href="...">
// <link rel="alternate" hreflang="ru-UA" href="...">
// <link rel="alternate" hreflang="x-default" href="...">
//
// ЧОМУ ru-UA а не ru-UA:
// Бізнес працює в Україні, контент для користувачів в Україні.
// ru-UA сигналізує Google що контент для Росії — SEO-катастрофа.

/**
 * Генерує hreflang для будь-якої сторінки.
 * x-default завжди = uk-UA версія.
 */
export function buildHreflangAlternates(
  ctx: Omit<SeoContext, "locale">
): HreflangAlternates {
  const ukPath = buildPath({ ...ctx, locale: "uk" });
  const ruPath = buildPath({ ...ctx, locale: "ru" });

  return {
    "x-default": `${SITE.url}${ukPath}`,
    "uk-UA":     `${SITE.url}${ukPath}`,
    "ru-UA":     `${SITE.url}${ruPath}`,
  };
}
```

-----

### 3.5 `metadata/` — Metadata API

```typescript
// metadata/core.ts
// Всі примітивні builders в одному файлі (вони малі)

import { SEO_DEFAULTS, SITE } from "@/platform/seo/constants";
import type { SeoContext } from "@/platform/seo/types";

export function buildTitle(title: string): string {
  // Обрізаємо до 60 символів, додаємо бренд
  const full = `${title} | ${SITE.name}`;
  return full.length > 60 ? title.substring(0, 57) + "..." : full;
}

export function buildDescription(desc: string): string {
  // Обрізаємо до 155 символів
  return desc.length > 155 ? desc.substring(0, 152) + "..." : desc;
}

export function buildOpenGraph({
  title, description, url, locale, imageSlug,
}: {
  title: string; description: string; url: string;
  locale: "uk" | "ru"; imageSlug?: string;
}) {
  return {
    title,
    description,
    url,
    siteName: SITE.name,
    locale: locale === "uk" ? "uk_UA" : "ru_UA",
    type: "website" as const,
    images: [{
      url: `${SITE.url}/og/${imageSlug ?? "default"}.jpg`,
      width: SEO_DEFAULTS.ogImageWidth,
      height: SEO_DEFAULTS.ogImageHeight,
      alt: title,
    }],
  };
}

export function buildTwitterCard(title: string, description: string) {
  return {
    card: SEO_DEFAULTS.twitterCard,
    title,
    description,
  };
}
```

```typescript
// metadata/generate-page-metadata.ts
import type { Metadata } from "next";
import type { SeoContext } from "@/platform/seo/types";
import { buildCanonicalUrl } from "@/platform/seo/urls";
import { buildHreflangAlternates } from "@/platform/seo/alternates";
import { buildOpenGraph, buildTwitterCard } from "./core";
import { getMetadataTemplate } from "./templates";
import { SEO_DEFAULTS } from "@/platform/seo/constants";

/**
 * ГОЛОВНА ФУНКЦІЯ SEO ПЛАТФОРМИ.
 * Єдина точка генерації Metadata для будь-якої сторінки.
 *
 * Використання в page.tsx:
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   return generatePageMetadata({
 *     pageType: "city-service",
 *     locale: params.locale,
 *     city: getCityBySlug(params.city),
 *     serviceSlug: params.service,
 *     basePrice: 280,
 *   });
 * }
 */
export function generatePageMetadata(ctx: SeoContext): Metadata {
  const template = getMetadataTemplate(ctx);
  const canonical = buildCanonicalUrl(ctx);
  const alternates = buildHreflangAlternates(ctx);

  return {
    title: template.title,
    description: template.description,
    alternates: {
      canonical,
      languages: alternates,
    },
    openGraph: buildOpenGraph({
      title: template.title,
      description: template.description,
      url: canonical,
      locale: ctx.locale,
      imageSlug: template.ogImageSlug,
    }),
    twitter: buildTwitterCard(template.title, template.description),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...template.overrides,
  };
}
```

```typescript
// metadata/templates/city-service.ts
// ← НАЙВАЖЛИВІШИЙ ШАБЛОН: місто × послуга

import { buildTitle, buildDescription } from "../core";
import type { SeoContext } from "@/platform/seo/types";

export function getCityServiceMetadata(ctx: SeoContext) {
  const { city, serviceSlug, locale, basePrice = 280 } = ctx;
  const cityName = city![locale];
  const price = Math.round(basePrice * city!.priceModifier);
  const phone = city!.phone;

  // Відмінкові форми
  const inCity: Record<string, Record<string, string>> = {
    kyiv:    { uk: "у Києві",   ru: "в Киеве" },
    dnipro:  { uk: "у Дніпрі", ru: "в Днепре" },
    kharkiv: { uk: "у Харкові", ru: "в Харькове" },
  };
  const cityPhrase = inCity[city!.slug]?.[locale] ?? `у ${cityName}`;

  if (locale === "uk") {
    return {
      title: buildTitle(
        `Натяжні стелі ${cityPhrase} — від ${price} грн/м²`
      ),
      description: buildDescription(
        `Натяжні стелі ${cityPhrase}. ✓ Від ${price} грн/м². `
        + `✓ Безкоштовний замір. ✓ Гарантія 10 років. `
        + `Телефон: ${phone}.`
      ),
      ogImageSlug: `city-service-${city!.slug}`,
    };
  }

  return {
    title: buildTitle(
      `Натяжные потолки ${cityPhrase} — от ${price} грн/м²`
    ),
    description: buildDescription(
      `Натяжные потолки ${cityPhrase}. ✓ От ${price} грн/м². `
      + `✓ Бесплатный замер. ✓ Гарантия 10 лет. `
      + `Телефон: ${phone}.`
    ),
    ogImageSlug: `city-service-${city!.slug}`,
  };
}
```

```typescript
// metadata/templates/index.ts — роутер шаблонів

import type { SeoContext } from "@/platform/seo/types";
import { getHomeMetadata }        from "./home";
import { getServiceMetadata }     from "./service";
import { getCityMetadata }        from "./city";
import { getCityServiceMetadata } from "./city-service";
import { getPricesMetadata }      from "./prices";
import { getFaqMetadata }         from "./faq";
import { getBlogListMetadata }    from "./blog-list";
import { getBlogPostMetadata }    from "./blog-post";
import { getPortfolioMetadata }   from "./portfolio";
import { getContactsMetadata }    from "./contacts";

export function getMetadataTemplate(ctx: SeoContext) {
  switch (ctx.pageType) {
    case "home":         return getHomeMetadata(ctx);
    case "service":      return getServiceMetadata(ctx);
    case "city":         return getCityMetadata(ctx);
    case "city-service": return getCityServiceMetadata(ctx);
    case "prices":       return getPricesMetadata(ctx);
    case "faq":          return getFaqMetadata(ctx);
    case "blog-list":    return getBlogListMetadata(ctx);
    case "blog-post":    return getBlogPostMetadata(ctx);
    case "portfolio":    return getPortfolioMetadata(ctx);
    case "contacts":     return getContactsMetadata(ctx);
  }
}
```

-----

### 3.6 `schema/` — Schema.org JSON-LD

```typescript
// schema/builders/local-business.ts

import { SITE } from "@/platform/seo/constants";
import type { CityConfig } from "@/config/geo-matrix";

export function buildLocalBusiness(city: CityConfig, locale: "uk" | "ru") {
  const address = locale === "uk" ? city.address : city.addressRu;

  return {
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE.url}/${city.slug}/#business`,
    "name": `${SITE.name} ${city[locale]}`,
    "url": `${SITE.url}/${city.slug}/`,
    "telephone": city.phone,
    "image": `${SITE.url}/og/office-${city.slug}.jpg`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address,
      "addressLocality": city[locale],
      "addressRegion": city.region,
      "addressCountry": "UA",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": city.coordinates.lat,
      "longitude": city.coordinates.lon,
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      "opens": "09:00",
      "closes": "20:00",
    },
    "areaServed": {
      "@type": "City",
      "name": city[locale],
      "containsPlace": city.landmarks.map(lm => ({
        "@type": "Residence",
        "name": lm,
      })),
    },
    "sameAs": city.sameAs ?? [],
  };
}
```

```typescript
// schema/page-schemas.ts
// Комбінує builders для конкретних типів сторінок

import { buildLocalBusiness } from "./builders/local-business";
import { buildService }       from "./builders/service";
import { buildBreadcrumb }    from "./builders/breadcrumb";
import { buildFaq }           from "./builders/faq";
import { buildOrganization }  from "./builders/organization";
import type { PageSchemaConfig } from "@/platform/seo/types";

/**
 * Повертає масив Schema об'єктів для конкретного типу сторінки.
 * Використовується в JsonLd компоненті.
 */
export function getPageSchema(config: PageSchemaConfig): object[] {
  const { pageType, city, service, faqItems, breadcrumbs } = config;

  switch (pageType) {
    case "home":
      return [buildOrganization(), buildWebSite()];

    case "service":
      return [
        buildService(service!),
        buildBreadcrumb(breadcrumbs!),
        ...(faqItems ? [buildFaq(faqItems)] : []),
      ];

    case "city":
      return [
        buildLocalBusiness(city!, "uk"),
        buildBreadcrumb(breadcrumbs!),
        buildItemList(services),  // всі послуги міста
      ];

    case "city-service":
      return [
        buildLocalBusiness(city!, "uk"),
        buildService(service!, city),
        buildBreadcrumb(breadcrumbs!),
        ...(faqItems ? [buildFaq(faqItems)] : []),
      ];

    case "blog-post":
      return [buildArticle(config), buildBreadcrumb(breadcrumbs!)];

    case "portfolio":
      return [buildImageGallery(config), buildBreadcrumb(breadcrumbs!)];

    case "faq":
      return [buildFaq(faqItems!), buildBreadcrumb(breadcrumbs!)];

    default:
      return [buildOrganization()];
  }
}
```

```typescript
// ui/JsonLd.tsx
// Єдиний компонент для інжекції JSON-LD

type JsonLdProps = {
  schema: object | object[];
};

export function JsonLd({ schema }: JsonLdProps) {
  const graph = Array.isArray(schema) ? schema : [schema];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graph,
        }),
      }}
    />
  );
}

// Використання в page.tsx:
// <JsonLd schema={getPageSchema({ pageType: "city-service", city, service })} />
```

-----

### 3.7 `sitemap/` — повна автогенерація

```typescript
// sitemap/config.ts
// priorities та changeFrequency разом (вони пов'язані)

export const SITEMAP_CONFIG = {
  home:         { priority: 1.0, changeFrequency: "weekly" as const },
  service:      { priority: 0.9, changeFrequency: "monthly" as const },
  city:         { priority: 0.85, changeFrequency: "weekly" as const },
  "city-service":{ priority: 0.8, changeFrequency: "monthly" as const },
  prices:       { priority: 0.8, changeFrequency: "monthly" as const },
  faq:          { priority: 0.7, changeFrequency: "monthly" as const },
  "blog-list":  { priority: 0.75, changeFrequency: "weekly" as const },
  "blog-post":  { priority: 0.7, changeFrequency: "weekly" as const },
  portfolio:    { priority: 0.75, changeFrequency: "weekly" as const },
  contacts:     { priority: 0.6, changeFrequency: "yearly" as const },
} as const;
```

```typescript
// sitemap/routes/city-service-routes.ts
// ← НАЙВАЖЛИВІШИЙ файл: матриця місто × послуга

import { activeCities } from "@/config/geo-matrix";
import { services } from "@/config/services.config";
import { buildCanonicalUrl } from "@/platform/seo/urls";
import { SITEMAP_CONFIG } from "../config";

export function getCityServiceRoutes() {
  const locales = ["uk", "ru"] as const;
  const config = SITEMAP_CONFIG["city-service"];

  return locales.flatMap(locale =>
    activeCities.flatMap(city =>
      services.map(service => ({
        url: buildCanonicalUrl({
          pageType: "city-service",
          locale,
          city,
          serviceSlug: service.slug,
        }),
        lastModified: new Date(),
        ...config,
        alternates: {
          languages: {
            "uk-UA": buildCanonicalUrl({ pageType: "city-service", locale: "uk", city, serviceSlug: service.slug }),
            "ru-UA": buildCanonicalUrl({ pageType: "city-service", locale: "ru", city, serviceSlug: service.slug }),
          }
        }
      }))
    )
  );
}
```

```typescript
// sitemap/generate-sitemap.ts
import type { MetadataRoute } from "next";
import { getStaticRoutes }      from "./routes/static-routes";
import { getServiceRoutes }     from "./routes/service-routes";
import { getCityRoutes }        from "./routes/city-routes";
import { getCityServiceRoutes } from "./routes/city-service-routes";
import { getBlogRoutes }        from "./routes/blog-routes";
import { getPortfolioRoutes }   from "./routes/portfolio-routes";

export async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogRoutes, portfolioRoutes] = await Promise.all([
    getBlogRoutes(),
    getPortfolioRoutes(),
  ]);

  return [
    ...getStaticRoutes(),
    ...getServiceRoutes(),
    ...getCityRoutes(),
    ...getCityServiceRoutes(),    // ← найбільший блок: N міст × M послуг × 2 локалі
    ...blogRoutes,
    ...portfolioRoutes,
  ];
}
```

-----

### 3.8 `geo/` — Local SEO

```typescript
// ui/GeoMetaTags.ts
// Server Component — рендериться на сервері, нема CLS

import type { CityConfig } from "@/config/geo-matrix";

type GeoMetaTagsProps = {
  city: CityConfig;
};

export function GeoMetaTags({ city }: GeoMetaTagsProps) {
  return (
    <>
      <meta name="geo.region" content={city.region} />
      <meta name="geo.placename" content={city.uk} />
      <meta name="geo.position" content={`${city.coordinates.lat};${city.coordinates.lon}`} />
      <meta name="ICBM" content={`${city.coordinates.lat}, ${city.coordinates.lon}`} />
    </>
  );
}
```

```typescript
// geo/local-seo.ts
// Хелпери для Local SEO + service area

import type { CityConfig } from "@/config/geo-matrix";
import { activeCities } from "@/config/geo-matrix";

/**
 * Генерує service area для Schema.org
 * Включає місто + сусідні райони з geo-matrix
 */
export function buildServiceArea(city: CityConfig) {
  return [
    { "@type": "City", "name": city.uk },
    ...city.districts.map(d => ({ "@type": "AdministrativeArea", "name": d })),
    ...(city.nearbyCity ? [{ "@type": "City", "name": city.nearbyCity }] : []),
  ];
}

/**
 * Всі активні міста для Schema.org areaServed на головній
 */
export function buildNationalServiceArea() {
  return activeCities.map(city => ({
    "@type": "City",
    "name": city.uk,
    "addressRegion": city.region,
  }));
}
```

-----

### 3.9 `content/` — SEO-контент rules

```typescript
// content/faq-rules.ts
// Універсальні FAQ — БЕЗ city-спаму
// Місто вставляється тільки в ціну та телефон (одна строка)

import type { CityConfig } from "@/config/geo-matrix";
import type { Locale } from "@/platform/seo/types";

export type FAQItem = { question: string; answer: string };

export function getServiceFAQ(
  serviceSlug: string,
  locale: Locale,
  city?: CityConfig,
  basePrice = 280,
): FAQItem[] {
  const price = city ? Math.round(basePrice * city.priceModifier) : basePrice;
  const phone = city?.phone ?? "0 800 000-000";

  // Запитання — загальні (не прив'язані до міста)
  // Місто входить тільки в одну фразу ціни/телефону
  if (locale === "uk") {
    return [
      {
        question: "Яка різниця між матовою та сатиновою натяжною стелею?",
        answer: "Матова стеля поглинає світло і приховує нерівності. Сатинова — має легкий блиск і візуально збільшує простір. Для спалень рекомендуємо матову, для вітальні — сатинову.",
      },
      {
        question: "Скільки коштує натяжна стеля?",
        answer: `Вартість залежить від типу плівки та площі. Ціна від ${price} грн/м². Точний розрахунок — безкоштовний замір: ${phone}.`,
      },
      {
        question: "Скільки часу займає монтаж натяжної стелі?",
        answer: "Стандартна кімната площею 20–30 м² монтується за 1–3 години. Двокімнатна квартира — за 1 день.",
      },
      {
        question: "Яка гарантія на натяжні стелі?",
        answer: "NOVA STELYA надає гарантію 10 років на плівку та монтаж. Використовуємо матеріали Pongs та Lackmann (Німеччина).",
      },
      {
        question: "Чи можна встановити натяжну стелю у ванній кімнаті?",
        answer: "Так. Для ванної використовується вологостійка ПВХ-плівка. Вона витримує до 100 л води при протіканні від сусідів.",
      },
    ];
  }

  // ru версія — аналогічна структура
  return [
    {
      question: "В чём разница между матовым и сатиновым натяжным потолком?",
      answer: "Матовый потолок поглощает свет и скрывает неровности. Сатиновый — имеет лёгкий блеск и визуально увеличивает пространство.",
    },
    {
      question: "Сколько стоит натяжной потолок?",
      answer: `Стоимость зависит от типа плёнки и площади. Цена от ${price} грн/м². Точный расчёт — бесплатный замер: ${phone}.`,
    },
    {
      question: "Сколько времени занимает монтаж натяжного потолка?",
      answer: "Стандартная комната 20–30 м² монтируется за 1–3 часа. Двухкомнатная квартира — за 1 день.",
    },
    {
      question: "Какая гарантия на натяжные потолки?",
      answer: "NOVA STELYA даёт гарантию 10 лет на плёнку и монтаж.",
    },
    {
      question: "Можно ли устанавливать натяжной потолок в ванной?",
      answer: "Да. Используется влагостойкая ПВХ-плёнка, выдерживает до 100 л воды.",
    },
  ];
}
```

```typescript
// content/city-copy.ts
// City-aware H1, CTA, descriptions — центральне місце

import type { CityConfig } from "@/config/geo-matrix";
import type { Locale, ServiceSlug } from "@/platform/seo/types";

// Відмінкові форми — єдиний реєстр
export const CITY_PHRASES: Record<string, Record<Locale, string>> = {
  kyiv:    { uk: "у Києві",   ru: "в Киеве" },
  dnipro:  { uk: "у Дніпрі", ru: "в Днепре" },
  kharkiv: { uk: "у Харкові", ru: "в Харькове" },
  odesa:   { uk: "в Одесі",   ru: "в Одессе" },
  lviv:    { uk: "у Львові",  ru: "во Львове" },
  // При додаванні міста → додати тут
};

export function getCityPhrase(citySlug: string, locale: Locale): string {
  return CITY_PHRASES[citySlug]?.[locale] ?? "";
}

export function buildCityServiceH1(
  serviceTitle: string,
  city: CityConfig | null,
  locale: Locale,
  price: number,
): string {
  if (!city) {
    return locale === "uk"
      ? `${serviceTitle} — від ${price} грн/м²`
      : `${serviceTitle} — от ${price} грн/м²`;
  }

  const phrase = getCityPhrase(city.slug, locale);
  return locale === "uk"
    ? `${serviceTitle} ${phrase} — від ${price} грн/м²`
    : `${serviceTitle} ${phrase} — от ${price} грн/м²`;
}

export function buildCTAText(city: CityConfig | null, locale: Locale): string {
  if (!city) {
    return locale === "uk" ? "Замовити безкоштовний замір" : "Заказать бесплатный замер";
  }
  const phrase = getCityPhrase(city.slug, locale);
  return locale === "uk"
    ? `Замовити замір ${phrase}`
    : `Заказать замер ${phrase}`;
}
```

```typescript
// content/forbidden-patterns.ts
// Що НІКОЛИ не писати в SEO-текстах

export const FORBIDDEN_PATTERNS = [
  // Переспам ключових слів
  /натяжні стелі.{0,20}натяжні стелі/i,
  // Занадто довгий title
  // (перевіряється в audit/)

  // Заборонені фрази
  "дешево",
  "дешевле всех",
  "самые низкие цены",
  "№1 в мире",
] as const;

export const TITLE_RULES = {
  maxLength: 60,
  minLength: 30,
  mustEndWith: "NOVA STELYA",
  mustNotStartWith: ["the", "a ", "і ", "та "],
} as const;

export const DESCRIPTION_RULES = {
  maxLength: 155,
  minLength: 100,
  mustInclude: ["грн/м²", "замір"],
  mustNotInclude: ["!!!", "???"],
} as const;
```

-----

### 3.10 `audit/` — dev-only перевірки

```typescript
// audit/validate-metadata.ts
// Запускається тільки в development — не потрапляє в bundle

import { TITLE_RULES, DESCRIPTION_RULES } from "@/platform/seo/content";

export function validateMetadata(metadata: {
  title?: string;
  description?: string;
  canonical?: string;
}): string[] {
  if (process.env.NODE_ENV !== "development") return [];

  const errors: string[] = [];

  if (metadata.title) {
    if (metadata.title.length > TITLE_RULES.maxLength)
      errors.push(`Title занадто довгий: ${metadata.title.length} > ${TITLE_RULES.maxLength}`);
    if (metadata.title.length < TITLE_RULES.minLength)
      errors.push(`Title занадто короткий: ${metadata.title.length} < ${TITLE_RULES.minLength}`);
  }

  if (metadata.description) {
    if (metadata.description.length > DESCRIPTION_RULES.maxLength)
      errors.push(`Description занадто довгий`);
  }

  if (!metadata.canonical)
    errors.push("Відсутній canonical URL");

  return errors;
}
```

-----

## 4. PUBLIC API — index.ts

```typescript
// platform/seo/index.ts
// ← ЄДИНА ТОЧКА ІМПОРТУ ДЛЯ ВСЬОГО ПРОЕКТУ
// В app/ використовувати тільки: import { ... } from "@/platform/seo"

// Metadata
export { generatePageMetadata } from "./metadata/generate-page-metadata";

// Schema
export { getPageSchema } from "./schema/page-schemas";
export { JsonLd } from "./ui/JsonLd";

// Sitemap
export { generateSitemap } from "./sitemap/generate-sitemap";

// Robots
export { generateRobots } from "./robots/generate-robots";

// Geo
export { GeoMetaTags } from "./ui/GeoMetaTags";
export { buildServiceArea } from "./geo/local-seo";

// Content
export { getServiceFAQ } from "./content/faq-rules";
export { buildCityServiceH1, buildCTAText, getCityPhrase } from "./content/city-copy";

// Types (реекспорт для зручності)
export type { SeoContext, PageType, Locale, ServiceSlug } from "./types";
```

-----

## 5. ПРАВИЛА ВИКОРИСТАННЯ В app/

### Правило №1: Тільки через Public API

```typescript
// ✅ ПРАВИЛЬНО
import { generatePageMetadata, getPageSchema, JsonLd } from "@/platform/seo";

// ❌ ЗАБОРОНЕНО — прямий імпорт внутрішніх файлів
import { buildTitle } from "@/platform/seo/metadata/core";
import { buildHreflangAlternates } from "@/platform/seo/alternates/build-hreflang";
```

### Правило №2: generateMetadata в кожному page.tsx

```typescript
// app/[locale]/[city]/[service]/page.tsx

import { generatePageMetadata, getPageSchema, JsonLd, getServiceFAQ } from "@/platform/seo";
import { getCityBySlug } from "@/config/geo-matrix";

export async function generateMetadata({ params }): Promise<Metadata> {
  return generatePageMetadata({
    pageType: "city-service",
    locale: params.locale,
    city: getCityBySlug(params.city),
    serviceSlug: params.service,
    basePrice: 280,
  });
}

export default function CityServicePage({ params }) {
  const city = getCityBySlug(params.city);
  const faq = getServiceFAQ(params.service, params.locale, city, 280);
  const schema = getPageSchema({
    pageType: "city-service",
    city,
    breadcrumbs: [...],
    faqItems: faq,
  });

  return (
    <>
      <JsonLd schema={schema} />
      {/* сторінка */}
    </>
  );
}
```

### Правило №3: Ніякого SEO-коду поза platform/seo/

```
❌ Заборонено:
app/page.tsx           — SEO логіка
components/SeoHead.tsx — SEO компонент
lib/metadata.ts        — SEO функція
utils/canonical.ts     — SEO утиліта

✅ Дозволено:
platform/seo/               — ВСЕ SEO тут
```

-----

## 6. ТИПИ

Всі типи в `platform/seo/types/`.
TypeScript strict mode — обов’язково.
Ніяких `any`.

-----

## 7. КОНСТАНТИ

Ієрархія:

```
SITE_URL     → constants/site.ts
LOCALES      → constants/locales.ts
SEO_DEFAULTS → constants/seo-defaults.ts
ROUTES       → constants/routes.ts
```

Ніяких хардкодованих URL або рядків поза `constants/`.

-----

## 8. ЧЕКЛИСТ ЯКОСТІ SEO ПЛАТФОРМИ

**Архітектура:**

- [ ] Весь SEO-код знаходиться в `platform/seo/`
- [ ] Імпорти тільки через `platform/seo/index.ts`
- [ ] Ніяких прямих імпортів внутрішніх файлів
- [ ] Всі типи типізовані (strict, no any)

**Metadata:**

- [ ] `generatePageMetadata()` викликається в кожному `page.tsx`
- [ ] Кожна сторінка має унікальні title та description
- [ ] Title: 30–60 символів
- [ ] Description: 100–155 символів
- [ ] Canonical URL на кожній сторінці
- [ ] hreflang **uk-UA** ↔ **ru-UA** ↔ x-default на кожній сторінці

**Schema:**

- [ ] JSON-LD присутній на кожній сторінці
- [ ] `@graph` формат (не окремі скрипти)
- [ ] LocalBusiness для кожного міста з координатами
- [ ] FAQPage де є FAQ
- [ ] BreadcrumbList на всіх сторінках

**Sitemap:**

- [ ] 100% активних URL включено
- [ ] `city-service-routes.ts` покриває всі комбінації
- [ ] alternates.languages в кожному записі
- [ ] priority та changeFrequency виставлені правильно

**Content:**

- [ ] FAQ без city-спаму (місто тільки в ціні/телефоні)
- [ ] H1 унікальний per місто через `city-copy.ts`
- [ ] Forbidden patterns не використовуються
- [ ] Відмінкові форми міст у `CITY_PHRASES`

-----

-----

## 9. ІНТЕГРАЦІЯ З ADMIN SEO PANEL

### Override system — metadata з БД має пріоритет

```typescript
// platform/seo/metadata/generate-page-metadata.ts
// Розширена версія з підтримкою admin overrides

import { getSeoOverride } from "@/lib/db/seo-overrides";

export async function generatePageMetadata(ctx: SeoContext): Promise<Metadata> {
  const canonical = buildCanonicalUrl(ctx);

  // 1. Перевіряємо admin override (seo-overrides.json · Фаза 2: DB)
  const override = await getSeoOverride(canonical);

  // 2. Авто-генерація через templates
  const auto = getAutoMetadata(ctx);

  // 3. Override має повний пріоритет над auto
  if (override) {
    return {
      ...auto,
      ...(override.title       && { title: override.title }),
      ...(override.description && { description: override.description }),
      ...(override.noindex     && { robots: { index: false, follow: false } }),
      ...(override.ogImage     && {
        openGraph: { ...auto.openGraph, images: [{ url: override.ogImage }] }
      }),
    };
  }

  return auto;
}
```

### Audit Engine — використовує platform/seo/ для перевірки

```typescript
// platform/seo/admin/audit-engine.ts
import { generatePageMetadata } from "@/platform/seo/metadata/generate-page-metadata";
import { getPageSchema }        from "@/platform/seo/schema/page-schemas";
import { TITLE_RULES, DESCRIPTION_RULES } from "@/platform/seo/content/forbidden-patterns";

export async function auditPage(ctx: SeoContext): Promise<PageAuditResult> {
  const metadata = await generatePageMetadata(ctx);
  const schema = getPageSchema({ pageType: ctx.pageType, city: ctx.city });

  const title = metadata.title as string ?? "";
  const desc  = metadata.description as string ?? "";

  return {
    url: buildCanonicalUrl(ctx),
    title: {
      value:  title,
      length: title.length,
      status: title.length >= TITLE_RULES.minLength && title.length <= TITLE_RULES.maxLength
              ? "ok" : title.length > TITLE_RULES.maxLength ? "too_long" : "too_short",
    },
    description: {
      value:  desc,
      length: desc.length,
      status: desc.length >= DESCRIPTION_RULES.minLength && desc.length <= DESCRIPTION_RULES.maxLength
              ? "ok" : "too_long",
    },
    hasSchema: Array.isArray(schema) && schema.length > 0,
    schemaTypes: Array.isArray(schema) ? schema.map((s: any) => s["@type"]) : [],
    seoScore: calculateSeoScore({ title, desc, schema }),
    issues: collectIssues({ title, desc, schema }),
  };
}
```

### Public API — доповнення для admin

```typescript
// platform/seo/index.ts — додаткові експорти для admin
export { auditPage, runFullSiteAudit } from "./admin/audit-engine";
export { calculateSeoScore }           from "./admin/seo-score";
export { generateReport }              from "./admin/report-generator";
```

-----

*SEO Platform Layer v3.0 FINAL*
*NOVA STELYA · Next.js 16.2+ · Gold Standard 2026 · з Admin Integration*