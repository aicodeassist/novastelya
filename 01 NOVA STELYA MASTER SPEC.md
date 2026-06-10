# NOVA STELYA — MASTER SPECIFICATION

## Website Operating System · Next.js 16.2+ · Gold Standard 2026

> **Версія:** 5.0 FINAL COMPLETE
> **Статус:** ARCHITECTURAL LAW
> **Для AI-агента:** Прочитай цей файл ПОВНІСТЮ перед будь-яким кодом.
> Читай в порядку: 00 → 01 → 02 → 03 → 04 → 05

-----

## ЗМІСТ

1. [Core Philosophy — Website Operating System](#1-core-philosophy)
1. [4 Ізольованих шари](#2-чотири-шари)
1. [Технологічний стек](#3-технологічний-стек)
1. [Архітектурні інваріанти](#4-архітектурні-інваріанти)
1. [Повна файлова структура](#5-повна-файлова-структура)
1. [Runtime Layer](#6-runtime-layer)
1. [Platform Layer](#7-platform-layer)
1. [SEO Platform Layer](#8-seo-platform-layer)
1. [Data Architecture — PostgreSQL Schema](#9-data-architecture)
1. [Admin Layer](#10-admin-layer)
1. [Visual Builder](#11-visual-builder)
1. [AI Automation Layer](#12-ai-automation-layer)
1. [Revalidation Pipeline](#13-revalidation-pipeline)
1. [Design System](#14-design-system)
1. [URL Architecture](#15-url-architecture)
1. [City-in-a-Box System](#16-city-in-a-box-system)
1. [Performance Targets](#17-performance-targets)
1. [Acceptance Criteria](#18-acceptance-criteria)

-----

## 1. CORE PHILOSOPHY

### Nova Stelya — Website Operating System

```
Nova Stelya НЕ є:    website + admin panel
Nova Stelya Є:       Website Operating System
```

### Головний закон

```
Human edits intent.
Machine executes optimized implementation.
```

Людина через адмінку: змінює контент, SEO, ціни, FAQ, налаштування міст,
вибирає block variants, затверджує AI-рекомендації.

Машина: рендерить оптимізований HTML, зберігає performance + SEO,
виконує granular cache revalidation.

**Людина НІКОЛИ не торкається runtime structure.**

### Золоте правило

```
Admin flexibility  MUST NEVER  degrade runtime performance.
```

Навіть якщо адмінка стає величезною, AI стає автономним —
public runtime залишається static-first · server-first · minimal-js ·
cache-friendly · predictable · SEO-safe · ultra-fast.

-----

## 2. ЧОТИРИ ШАРИ

```
┌─────────────────────────────────────────────────────────┐
│                    AI LAYER                             │
│  recommend · audit · suggest · generate (з approval)   │
├─────────────────────────────────────────────────────────┤
│                   ADMIN LAYER                           │
│  human editing · visual builder · analytics · SEO mgmt │
├─────────────────────────────────────────────────────────┤
│                 PLATFORM LAYER                          │
│  data · builders · db · cache · seo · config           │
├─────────────────────────────────────────────────────────┤
│                  RUNTIME LAYER                          │
│  Next.js · RSC · SSG · use cache · Edge delivery       │
└─────────────────────────────────────────────────────────┘
```

|Шар     |Оптимізує для               |НЕ містить                  |
|--------|----------------------------|----------------------------|
|Runtime |Performance · SEO · CWV     |Admin логіку · drag-and-drop|
|Platform|Data access · Business logic|UI · Admin компоненти       |
|Admin   |Human cognition · Workflow  |Runtime internals · Next.js |
|AI      |Automation · Recommendations|Прямі мутації runtime       |

-----

## 3. ТЕХНОЛОГІЧНИЙ СТЕК

```
Framework:     Next.js 16.2+ (App Router · RSC · Turbopack · PPR stable)
Language:      TypeScript 5.5+ (strict mode · no any)
Styling:       Vanilla CSS only · CSS Modules · @layer architecture
               oklch() · CSS nesting · container queries · clamp()
               НЕ Tailwind · НЕ Bootstrap · НЕ будь-який CSS framework
Fonts:         Self-hosted variable fonts (woff2) · next/font
i18n:          next-intl 3.x
Database:      — (Фаза 2: підключається органічно коли потрібна динаміка)
Cache:         use cache directive (Next.js 16.2 native) · Upstash Redis
CMS:           — (власна кастомна адмінка · ніякого стороннього CMS)
Images:        next/image · Cloudinary (WebP/AVIF)
Deployment:    Vercel Edge · Cloudflare CDN + WAF + R2
Analytics:     GA4 server-side · Vercel Speed Insights · GSC API
Monitoring:    Sentry · Vercel Analytics
Testing:       Playwright E2E · Vitest unit
```

**Заборонено:**

```
Tailwind / Bootstrap / будь-які CSS frameworks
pages/ router · getServerSideProps · getStaticProps
jQuery · localStorage для міста
catch-all [...slug] як основний патерн
any в TypeScript · !important в CSS
magic numbers в CSS (тільки var(--*))
barrel exports що тягнуть весь модуль
"use client" без чіткого обґрунтування
```

-----

## 4. АРХІТЕКТУРНІ ІНВАРІАНТИ

### Інваріант 1 — Runtime є священним

Runtime містить ТІЛЬКИ: Next.js App Router + RSC + SSG + ISR + PPR,
Server Components (default), мінімальні Client Islands.

Runtime НЕ містить: Admin логіку · drag-and-drop · visual editor ·
Analytics dashboards · AI orchestration · CMS builders.

### Інваріант 2 — Server-First

```typescript
// Default: Server Component
// "use client": виняток з обґрунтуванням

// Client ТІЛЬКИ для:
// Калькулятор · Форма · Мобільне меню · Модали
// Cookie consent · City banner dismiss · Карта · Галерея touch

// ❌ КРИТИЧНО — НІКОЛИ:
// app/[locale]/layout.tsx
"use client"; // Заражає весь subtree → гідратація всього → INP деградує
```

### Інваріант 3 — Static-First

```
SSG з use cache  →  ISR  →  PPR  →  SSR (тільки крайній випадок)
SSR дозволений: authenticated admin · real-time dashboard · secure ops
Публічні SEO сторінки: ТІЛЬКИ SSG
```

### Інваріант 4 — Hydration Islands

```
Critical JS на публічних сторінках: < 50kb (gzip)

Page (Server)
├── Header (Server)
│   └── MobileMenuToggle (Client Island)
├── Hero (Server)
├── PriceTable (Server)
├── FAQ (Server)
├── Calculator (Client Island)
└── Footer (Server)
```

### Інваріант 5 — Route Locality

```
Route-specific UI  →  _components/ поруч з route
Shared logic       →  platform/ або platform/seo/
Shared UI primitives  →  ui/
```

### Інваріант 6 — Import Graph

```typescript
// ✅ Точковий public API
import { generatePageMetadata, getPageSchema } from "@/platform/seo";

// ❌ Barrel що тягне весь модуль
export * from "./metadata"; // Знищує tree-shaking
```

### Інваріант 7 — Granular Cache

```typescript
cacheTag(`city-${city.slug}`);     // тільки місто
cacheTag(`service-${serviceSlug}`); // тільки послуга
// ❌ cacheTag("all"); — ЗАБОРОНЕНО
```

### Інваріант 8 — Hybrid Data Source

```
geo-matrix.ts   ← STATIC структура (slug, region, coordinates)
                   Build-time safe · generateStaticParams()

PostgreSQL DB   ← DYNAMIC контент (phone, prices, SEO overrides,
                   FAQ, portfolio, addresses)
                   Керується через адмінку · Runtime safe
```

Чому не повністю в DB: `generateStaticParams()` викликається під час
Vercel BUILD без доступу до runtime DB.

-----

## 5. ПОВНА ФАЙЛОВА СТРУКТУРА

```
nova-stelya/
│
├── app/
│   ├── layout.tsx                   ← Root (Server) · hreflang · OG global
│   ├── not-found.tsx
│   ├── sitemap.ts                   ← auto-generated всі URL × локалі × міста
│   ├── robots.ts                    ← dynamic per env
│   ├── manifest.ts
│   │
│   └── [locale]/                    ← "uk" (/) | "ru" (/ru)
│       ├── layout.tsx               ← Locale layout (Server)
│       ├── page.tsx                 ← Головна (SSG)
│       ├── not-found.tsx
│       │
│       ├── (catalog)/               ← Route group — не впливає на URL
│       │   ├── matte-ceilings/
│       │   │   ├── page.tsx
│       │   │   └── _components/    ← ⭐ Route-local UI
│       │   ├── glossy-ceilings/
│       │   ├── satin-ceilings/
│       │   ├── fabric-ceilings/
│       │   ├── shadow-ceilings/
│       │   ├── floating-ceilings/
│       │   ├── slotted-ceilings/
│       │   ├── carved-ceilings/
│       │   └── double-level-ceilings/
│       │
│       ├── (lighting)/
│       │   ├── light-lines/
│       │   ├── track-lighting/
│       │   ├── backlight/
│       │   └── starry-sky/
│       │
│       ├── (rooms)/
│       │   ├── kitchen-ceilings/
│       │   ├── bathroom-ceilings/
│       │   ├── bedroom-ceilings/
│       │   └── living-room-ceilings/
│       │
│       ├── prices/page.tsx
│       ├── faq/page.tsx
│       ├── contacts/page.tsx
│       ├── about/page.tsx
│       │
│       ├── blog/
│       │   ├── page.tsx
│       │   ├── [slug]/page.tsx
│       │   └── category/[category]/page.tsx
│       │
│       ├── portfolio/
│       │   ├── page.tsx
│       │   └── [slug]/page.tsx
│       │
│       └── [city]/                  ← generateStaticParams від geo-matrix
│           ├── layout.tsx           ← GeoMetaTags · LocalBusiness Schema
│           ├── page.tsx             ← City Hub · SSG · use cache
│           ├── _components/        ← ⭐ Route-local: тільки для [city]
│           │   ├── CityHero.tsx     ← Server
│           │   ├── CityServices.tsx ← Server
│           │   ├── CityReviews.tsx  ← Server
│           │   └── LocalMap.tsx     ← dynamic import · Client Island
│           ├── prices/page.tsx
│           ├── portfolio/page.tsx
│           ├── faq/page.tsx
│           └── [service]/          ← generateStaticParams × all services
│               ├── page.tsx         ← Server · use cache
│               └── _components/    ← ⭐ Route-local: city × service
│                   ├── CityServiceHero.tsx  ← Server
│                   ├── LocalPriceTable.tsx  ← Server
│                   ├── ServiceGallery.tsx   ← Server
│                   └── CalculatorIsland.tsx ← "use client" Island
│
├── app/api/
│   ├── contact/route.ts            ← Telegram · Zod валідація · Rate limit (Upstash)
│   ├── revalidate/route.ts         ← Webhook → revalidateTag()
│   └── geo/route.ts                ← IP → city · Edge Function
│
└── app/(admin)/                    ← ⭐ Route group · повна ізоляція
    └── admin/
        ├── layout.tsx              ← JWT auth guard
        ├── page.tsx                ← Dashboard
        ├── cities/
        │   ├── page.tsx
        │   └── [slug]/page.tsx
        ├── services/page.tsx
        ├── seo/
        │   ├── page.tsx
        │   ├── audit/page.tsx
        │   ├── pages/page.tsx
        │   ├── schema/page.tsx
        │   ├── sitemap/page.tsx
        │   ├── redirects/page.tsx
        │   └── analytics/page.tsx
        ├── design/page.tsx
        ├── content/
        │   ├── faq/page.tsx
        │   ├── blog/page.tsx
        │   └── portfolio/page.tsx
        ├── media/page.tsx
        └── ai/page.tsx

src/
│
├── platform/                        ← ⭐ PLATFORM LAYER (server-only)
│   │
│   ├── data/                        ← Data access (читання тільки)
│   │   ├── cities/
│   │   │   ├── get-city.ts          ← getCityBySlug(): config → Фаза 2: DB
│   │   │   ├── get-cities.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   ├── seo/
│   │   │   └── get-seo-override.ts  ← SEO override lookup
│   │   ├── faq/
│   │   ├── portfolio/
│   │   └── pricing/
│   │
│   ├── builders/                    ← Business logic
│   │   ├── pricing/
│   │   │   └── calculate-price.ts
│   │   ├── content/
│   │   │   ├── build-city-copy.ts
│   │   │   └── build-faq.ts
│   │   └── blocks/
│   │       └── resolve-blocks.ts
│   │
│   ├── cache/
│   │   ├── tags.ts                  ← всі cache tag константи
│   │   ├── policies.ts              ← cacheLife конфіги per тип
│   │   └── revalidate.ts            ← revalidateTag wrappers
│   │
│   ├── config/                      ← Build-time static config
│   │   ├── geo-matrix.ts            ← ⭐ STATIC структура міст (build-time)
│   │   ├── services.config.ts       ← 17 послуг + slugs
│   │   ├── locales.config.ts
│   │   ├── page-blocks.config.ts    ← LEGO blocks per page type
│   │   ├── design-tokens.ts         ← ⭐ ЄДИНЕ ДЖЕРЕЛО дизайн токенів
│   │   └── generate-css-tokens.ts  ← скрипт → src/styles/tokens.css
│   │
│   ├── db/                          ← (Фаза 2: PostgreSQL + Prisma)
│   │   └── .gitkeep                 ← структура готова, підключається пізніше
│   │
│   └── seo/                         ← ⭐ SEO PLATFORM LAYER
│       ├── index.ts                 ← PUBLIC API
│       │                               import { ... } from "@/platform/seo"
│       ├── types/
│       │   ├── metadata.types.ts
│       │   ├── schema.types.ts
│       │   └── seo.types.ts
│       ├── constants/
│       │   ├── site.ts
│       │   ├── locales.ts           ← uk-UA / ru-UA / x-default
│       │   ├── seo-defaults.ts
│       │   └── routes.ts
│       ├── urls/
│       │   ├── build-path.ts        ← trailingSlash: false aware
│       │   └── build-canonical.ts
│       ├── alternates/
│       │   └── build-hreflang.ts    ← uk-UA · ru-UA · x-default ТІЛЬКИ
│       ├── metadata/
│       │   ├── core.ts
│       │   ├── generate-page-metadata.ts
│       │   └── templates/
│       │       ├── home.ts
│       │       ├── service.ts
│       │       ├── city.ts
│       │       ├── city-service.ts  ← ключовий шаблон
│       │       ├── prices.ts
│       │       ├── faq.ts
│       │       ├── blog-list.ts
│       │       ├── blog-post.ts
│       │       ├── portfolio.ts
│       │       └── contacts.ts
│       ├── schema/
│       │   ├── builders/
│       │   │   ├── organization.ts
│       │   │   ├── local-business.ts
│       │   │   ├── service.ts
│       │   │   ├── faq.ts
│       │   │   ├── breadcrumb.ts
│       │   │   ├── article.ts
│       │   │   ├── review.ts
│       │   │   ├── aggregate-rating.ts
│       │   │   └── image-gallery.ts
│       │   └── page-schemas.ts
│       ├── sitemap/
│       │   ├── config.ts
│       │   ├── generate-sitemap.ts
│       │   └── routes/
│       │       ├── static-routes.ts
│       │       ├── service-routes.ts
│       │       ├── city-routes.ts
│       │       ├── city-service-routes.ts
│       │       ├── blog-routes.ts
│       │       └── portfolio-routes.ts
│       ├── robots/
│       │   └── generate-robots.ts
│       ├── geo/
│       │   └── local-seo.ts         ← service-area helpers (логіка, не UI)
│       ├── content/
│       │   ├── city-copy.ts
│       │   ├── faq-rules.ts         ← FAQ без city-спаму
│       │   ├── forbidden-patterns.ts
│       │   └── title-rules.ts
│       └── audit/
│           ├── audit-engine.ts
│           ├── seo-score.ts
│           └── report-generator.ts
│
├── ui/                              ← Shared UI + Server Components
│   ├── JsonLd.tsx                   ← ⭐ Server Component · inject JSON-LD
│   ├── GeoMetaTags.tsx              ← ⭐ Server Component · geo meta tags
│   ├── Button/
│   ├── Card/
│   ├── Input/
│   ├── Modal/
│   ├── Badge/
│   └── index.ts
│
├── admin/                           ← Admin business logic modules
│   ├── cities/
│   ├── seo/
│   ├── analytics/
│   ├── design/
│   └── ai/
│
├── messages/
│   ├── uk.json
│   └── ru.json
│
├── styles/
│   ├── layers.css                  ← @layer order
│   ├── reset.css
│   ├── tokens.css                  ← CSS custom properties
│   ├── typography.css
│   ├── layout.css
│   └── utilities.css
│
└── types/
    ├── city.types.ts
    ├── service.types.ts
    └── global.d.ts

middleware.ts                        ← next-intl + city cookie + bot detect
next.config.ts                       ← trailingSlash: false
i18n.config.ts
```

-----

## 6. RUNTIME LAYER

### use cache — Next.js 16.2

```typescript
// app/[locale]/[city]/[service]/page.tsx
"use cache";
import { cacheTag, cacheLife } from "next/cache";

export default async function CityServicePage({ params }) {
  cacheLife({ revalidate: 3600 });
  cacheTag(`city-${params.city}`);
  cacheTag(`service-${params.service}`);

  const city = await getCityBySlug(params.city);
  const faq  = await getFAQ(params.service, city.slug);

  return (
    <>
      <JsonLd schema={getPageSchema({ pageType: "city-service", city })} />
      <CityServiceHero city={city} />      {/* Server */}
      <LocalPriceTable city={city} />      {/* Server */}
      <FAQSection items={faq} />           {/* Server */}
      <CalculatorIsland city={city} />     {/* Client Island */}
    </>
  );
}

export function generateStaticParams() {
  const locales = ["uk", "ru"] as const;
  return locales.flatMap(locale =>
    activeCities.flatMap(city =>
      services.map(service => ({
        locale, city: city.slug, service: service.slug
      }))
    )
  );
}
```

### Rendering таблиця

|Тип            |Rendering        |Cache                                |
|---------------|-----------------|-------------------------------------|
|Головна        |SSG + `use cache`|`cacheTag("homepage")`               |
|Послуга        |SSG + `use cache`|`cacheTag("service-{slug}")`         |
|Місто-хаб      |SSG + `use cache`|`cacheTag("city-{slug}")`            |
|Місто × Послуга|SSG + `use cache`|`city-{slug}` + `service-{slug}`     |
|Прайс          |SSG + `use cache`|`cacheTag("pricing")` · 900s         |
|FAQ            |SSG + `use cache`|`cacheTag("faq")`                    |
|Блог (список)  |SSG + `use cache`|`cacheTag("blog")`                   |
|Блог (стаття)  |SSG + `use cache`|`cacheTag("blog-{slug}")` · on-demand|
|Портфоліо      |SSG + `use cache`|on-demand revalidation               |
|Admin          |SSR              |no cache                             |

-----

## 7. PLATFORM LAYER

### Data Model — Config-First, DB-Ready

```typescript
// platform/data/cities/get-city.ts
// Фаза 1: читає з TypeScript config (geo-matrix.ts)
// Фаза 2: swap на DB — інтерфейс getCityBySlug() не змінюється

import { activeCities } from "@/platform/config/geo-matrix";
import type { CityFull } from "@/types/city.types";

export function getCityBySlug(slug: string): CityFull | null {
  return activeCities.find(c => c.slug === slug) ?? null;
}

export function getActiveCities(): CityFull[] {
  return activeCities;
}

// Всі дані міста зараз — в geo-matrix.ts:
// slug, uk, ru, region, coordinates, landmarks,
// phone, address, officeHours, priceModifier
// Коли адмінка потребує динаміки → тільки ця функція змінюється
```

### Cache Tags

```typescript
// platform/cache/tags.ts
export const CACHE_TAGS = {
  city:      (slug: string) => `city-${slug}`,
  service:   (slug: string) => `service-${slug}`,
  portfolio: (slug: string) => `portfolio-${slug}`,
  blogPost:  (slug: string) => `blog-${slug}`,
  blog:      "blog",
  faq:       "faq",
  pricing:   "pricing",
  homepage:  "homepage",
  sitemap:   "sitemap",
  design:    "design-tokens",
} as const;
```

-----

## 8. SEO PLATFORM LAYER

```typescript
// platform/seo/index.ts — Public API
// ТІЛЬКИ звідси імпортувати в app/

export { generatePageMetadata } from "./metadata/generate-page-metadata";
export { getPageSchema }        from "./schema/page-schemas";
export { JsonLd }               from "@/ui/JsonLd";
export { generateSitemap }      from "./sitemap/generate-sitemap";
export { GeoMetaTags }          from "@/ui/GeoMetaTags";
export { getServiceFAQ }        from "./content/faq-rules";
export { buildCityServiceH1 }   from "./content/city-copy";
export type { SeoContext, PageType } from "./types";
```

### hreflang — суворий формат

```typescript
export function buildHreflangAlternates(ctx) {
  return {
    "x-default": `${SITE.url}${buildPath({ ...ctx, locale: "uk" })}`,
    "uk-UA":     `${SITE.url}${buildPath({ ...ctx, locale: "uk" })}`,
    "ru-UA":     `${SITE.url}${buildPath({ ...ctx, locale: "ru" })}`,
    // НЕ "uk" · НЕ "ru" · НЕ "ru-RU"
  };
}
```

### Override system

```typescript
// generatePageMetadata: DB override > auto-generated
export async function generatePageMetadata(ctx: SeoContext): Promise<Metadata> {
  const canonical = buildCanonicalUrl(ctx);
  const override  = await getSeoOverride(canonical); // з DB
  const auto      = getMetadataTemplate(ctx);        // auto-gen

  if (override) {
    return {
      ...buildBaseMetadata(auto, canonical, ctx),
      ...(override.title       && { title: override.title }),
      ...(override.description && { description: override.description }),
      ...(override.noindex     && { robots: { index: false, follow: false } }),
    };
  }
  return buildBaseMetadata(auto, canonical, ctx);
}
```

-----

## 9. DATA ARCHITECTURE

### Data Schema (Фаза 2 — підключається органічно)

**Зараз (Фаза 1):** всі дані живуть у TypeScript config файлах.
Архітектура написана так, що `getCityBySlug()`, `getFAQ()`, `getSeoOverride()`
є абстракцією — вони не знають звідки беруть дані.

**Фаза 2 (коли потрібна динаміка через адмінку):**
Підключається PostgreSQL + Prisma без переписування жодного компонента.
Тільки змінюється реалізація data functions у `platform/data/`.

```typescript
// platform/data/cities/get-city.ts
// Зараз: читає з config
// Фаза 2: читає з DB — ІНТЕРФЕЙС НЕ ЗМІНЮЄТЬСЯ

// Фаза 1:
export async function getCityBySlug(slug: string): Promise<CityFull | null> {
  return getCityConfig(slug) ?? null; // з geo-matrix.ts
}

// Фаза 2 (swap без переписування app/):
export async function getCityBySlug(slug: string): Promise<CityFull | null> {
  const config  = getCityConfig(slug);
  const dynamic = await db.cityData.findUnique({ where: { citySlug: slug } });
  return config ? { ...config, ...dynamic } : null;
}
```

**Сутності що підуть в DB у Фазі 2:**

- `CityData` — phone, address, priceModifier, officeHours
- `SeoOverride` — title, description, ogImage, noindex per URL
- `FAQ` — питання/відповіді керовані через адмінку
- `Redirect` — 301/302 правила
- `DesignToken` — CSS variables з адмінки
- `SeoAuditRun` — історія аудитів
- `AuditLog` — лог змін в адмінці

-----

## 10. ADMIN LAYER

### Модулі

```
Dashboard      ← SEO Health Score · CWV · traffic · AI suggestions · issues
Cities         ← phone · address · prices · SEO · activate/deactivate
Services       ← enable/disable · FAQ templates · SEO defaults · gallery
SEO            ← metadata editor · SERP preview · OG preview · audit · GSC
Design         ← tokens · theme · component variants · block variants
Content        ← FAQ · blog · portfolio
Media          ← Cloudinary manager
AI Assistant   ← SEO AI · Design AI · Dev AI recommendations
Settings       ← global settings · integrations · users · API keys
```

### Що людина бачить vs що runtime робить

```
Людина бачить:              Runtime виконує:
📁 Міста                    getCityBySlug() → hybrid config+DB
📁 Послуги                  generateStaticParams() → SSG
📁 SEO                      generatePageMetadata() → Metadata API
📁 Дизайн                   CSS variables з DB → @layer tokens
📁 Контент                  DB queries → Server Components
📁 AI Асистент              recommendation → approval → revalidateTag()

Людина НЕ бачить:
cache tags · rendering strategy · Next.js internals
component tree · hydration boundaries · bundle graph
```

-----

## 11. VISUAL BUILDER

### Schema-Driven — НЕ freeform Elementor

```typescript
// platform/config/page-blocks.config.ts
export const PAGE_BLOCKS = {
  "city-service": [
    { id: "hero",        variants: ["A", "B", "C"],           required: true },
    { id: "benefits",    variants: ["grid", "list"],           required: false },
    { id: "price-table", variants: ["simple", "detailed"],     required: true },
    { id: "gallery",     variants: ["grid", "masonry"],        required: false },
    { id: "calculator",  variants: ["full", "compact"],        required: true },
    { id: "reviews",     variants: ["cards", "list"],          required: false },
    { id: "faq",         variants: ["accordion", "simple"],    required: true },
    { id: "cta",         variants: ["banner", "minimal"],      required: true },
  ],
} as const;
```

**Адмін може:**
enable/disable block · змінити порядок · вибрати variant ·
редагувати текст/CTA/медіа · toggle опції

**Адмін НЕ може:**
custom div · manual CSS · custom DOM · inline HTML spaghetti

```
Human edits: composition intent
Machine renders: optimized React implementation
```

-----

## 12. AI AUTOMATION LAYER

```
AI MAY:     recommend · audit · suggest · generate
AI MUST NOT: mutate runtime · deploy code · bypass approval
```

**Pipeline:**

```
AI suggestion → Human review → Approval → DB update → revalidateTag() → SSG rebuild
```

**SEO AI:** thin content · metadata · CTR · FAQ generation · keyword gaps
**Design AI:** layout variants · UX · conversion · CTA
**Dev AI:** bundle audit · hydration · anti-patterns · architecture review

-----

## 13. REVALIDATION PIPELINE

```
Admin: Київ phone змінено
    ↓
revalidateCity("kyiv")
    ↓
revalidateTag("city-kyiv") + revalidateTag("sitemap")
    ↓
rebuild ТІЛЬКИ: /kyiv/* + /ru/kyiv/*
    ↓
CDN refresh тільки цих сторінок
```

```typescript
// app/api/revalidate/route.ts
export async function POST(request: Request) {
  const { type, slug, secret } = await request.json();
  if (secret !== process.env.REVALIDATE_SECRET)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  switch (type) {
    case "city":    await revalidateCity(slug);    break;
    case "service": await revalidateService(slug); break;
    case "blog":    revalidateTag(CACHE_TAGS.blogPost(slug)); break;
    case "design":  revalidateTag(CACHE_TAGS.design); break;
    case "sitemap": revalidateTag(CACHE_TAGS.sitemap); break;
  }

  return Response.json({ revalidated: true, type, slug });
}
```

-----

## 14. DESIGN SYSTEM

### @layer Architecture

```css
/* src/styles/layers.css */
@layer reset, base, tokens, typography, layout, components, utilities, overrides;
```

### Design Tokens — Single Source of Truth

```
platform/config/design-tokens.ts  ← ⭐ ЄДИНЕ ДЖЕРЕЛО
         ↓ (скрипт генерує автоматично)
src/styles/tokens.css             ← CSS custom properties
         ↓
компоненти використовують var(--)
         ↓
AI агент читає design-tokens.ts → точно знає що використовувати
Ніяких "придумай колір" — тільки токени з файлу
```

```typescript
// platform/config/design-tokens.ts
// Змінюєш тут → скрипт → оновлює tokens.css автоматично

export const tokens = {
  color: {
    bg:            "oklch(98% 0.005 85)",
    surface:       "oklch(96% 0.008 85)",
    border:        "oklch(88% 0.010 85)",
    accent:        "oklch(62% 0.120 55)",
    accentHover:   "oklch(58% 0.130 55)",
    textPrimary:   "oklch(18% 0.008 85)",
    textSecondary: "oklch(45% 0.010 85)",
    textMuted:     "oklch(62% 0.008 85)",
  },
  space: {
    "2xs": "clamp(0.25rem, 0.5vw, 0.375rem)",
    xs:    "clamp(0.5rem, 1vw, 0.75rem)",
    sm:    "clamp(0.75rem, 1.5vw, 1rem)",
    md:    "clamp(1rem, 2vw, 1.5rem)",
    lg:    "clamp(1.5rem, 3vw, 2.5rem)",
    xl:    "clamp(2.5rem, 5vw, 4rem)",
    "2xl": "clamp(4rem, 8vw, 7rem)",
  },
  radius: {
    sm: "4px", md: "8px", lg: "16px", xl: "24px", full: "9999px",
  },
  duration: {
    fast: "150ms", normal: "300ms", slow: "500ms",
  },
  ease: {
    premium: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
} as const;

export type DesignTokens = typeof tokens;
export type ColorToken   = keyof typeof tokens.color;
export type SpaceToken   = keyof typeof tokens.space;
```

```typescript
// platform/config/generate-css-tokens.ts
// npx tsx generate-css-tokens.ts → src/styles/tokens.css

import { tokens } from "./design-tokens";
import fs from "fs";

function toCSS(obj: object, prefix = "--"): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === "object"
      ? toCSS(v, `${prefix}-${k}`)
      : [`  ${prefix}-${k}: ${v};`]
  );
}

const css = `:root {
${toCSS(tokens, "--").join("
")}
}
`;
fs.writeFileSync("src/styles/tokens.css", css);
console.log("✅ tokens.css generated");
```

**Результат — src/styles/tokens.css генерується автоматично:**

```css
/* src/styles/tokens.css */
:root {
  /* Colors — oklch() НЕ #ffffff/#000000 */
  --color-bg:        oklch(98% 0.005 85);     /* теплий архітектурний білий */
  --color-surface:   oklch(96% 0.008 85);
  --color-border:    oklch(88% 0.010 85);
  --color-accent:    oklch(62% 0.120 55);     /* преміум бронза */
  --color-accent-hover: oklch(58% 0.130 55);
  --text-primary:    oklch(18% 0.008 85);     /* глибокий графіт */
  --text-secondary:  oklch(45% 0.010 85);
  --text-muted:      oklch(62% 0.008 85);

  /* Spacing — fluid */
  --space-2xs:  clamp(0.25rem, 0.5vw,  0.375rem);
  --space-xs:   clamp(0.5rem,  1vw,    0.75rem);
  --space-sm:   clamp(0.75rem, 1.5vw,  1rem);
  --space-md:   clamp(1rem,    2vw,    1.5rem);
  --space-lg:   clamp(1.5rem,  3vw,    2.5rem);
  --space-xl:   clamp(2.5rem,  5vw,    4rem);
  --space-2xl:  clamp(4rem,    8vw,    7rem);
  --space-hero: clamp(5rem,    10vw,   9rem);

  /* Typography */
  --text-xs:   clamp(0.75rem,  1.5vw, 0.875rem);
  --text-sm:   clamp(0.875rem, 1.8vw, 1rem);
  --text-md:   clamp(1rem,     2vw,   1.125rem);
  --text-lg:   clamp(1.125rem, 2.5vw, 1.375rem);
  --text-xl:   clamp(1.375rem, 3vw,   1.75rem);
  --text-2xl:  clamp(1.75rem,  4vw,   2.5rem);
  --text-3xl:  clamp(2.5rem,   6vw,   4rem);
  --text-hero: clamp(3rem,     8vw,   6rem);
  --leading-tight:  1.1;
  --leading-normal: 1.5;
  --tracking-tight: -0.04em;

  /* Motion */
  --ease-premium:    cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast:   150ms;
  --duration-normal: 300ms;

  /* Shadows — soft, not cheap */
  --shadow-sm: 0 1px 3px oklch(18% 0 0 / 0.06);
  --shadow-md: 0 4px 16px oklch(18% 0 0 / 0.08);
  --shadow-lg: 0 12px 40px oklch(18% 0 0 / 0.10);
}
```

### Design Laws

```
❌ #ffffff / #000000    → Pure white/black = cheap. oklch architectural tones.
❌ !important           → Architecture failed.
❌ magic numbers        → padding: 32px; → padding: var(--space-lg);
❌ heavy shadows        → subtle only
❌ cheap gradients      → purposeful or none
❌ layout animation     → opacity + transform ТІЛЬКИ

✅ Typography > Decoration
✅ White space > Effects
✅ Mobile-first (не responsive-first)
✅ Motion: cubic-bezier(0.16,1,0.3,1) · opacity + transform
✅ WCAG 2.2 AA · focus-visible · keyboard nav
✅ oklch() для всіх кольорів
```

-----

## 15. URL ARCHITECTURE

```
trailingSlash: false  — завжди
При вході зі слешем → 301 redirect → без слеша
uk = без префікса  ·  ru = /ru

/                        Головна (uk)
/matte-ceilings          Послуга (uk)
/kyiv                    Місто-хаб (uk)
/kyiv/matte-ceilings     Місто × Послуга (uk)
/prices                  Прайс
/faq                     FAQ
/blog/[slug]             Стаття
/portfolio               Портфоліо
/contacts                Контакти
/about                   Про компанію

/ru                      Головна (ru)
/ru/matte-ceilings       Послуга (ru)
/ru/kyiv/matte-ceilings  Місто × Послуга (ru)

/admin/seo               SEO Admin (захищений · noindex)
/sitemap.xml             auto-generated
/robots.txt              dynamic per env
```

-----

## 16. CITY-IN-A-BOX SYSTEM

### 2 кроки = нове місто

```typescript
// Крок 1: platform/config/geo-matrix.ts
{
  slug: "lviv", uk: "Львів", ru: "Львов",
  region: "UA-46", active: true,
  coordinates: { lat: 49.8397, lon: 24.0297 },
  landmarks: ["ЖК Пасічний", "ЖК Синергія Сіті"],
  // phone, address, priceModifier → в DB через адмінку
}

// Крок 2: src/messages/uk.json + ru.json
"cities": { "lviv": { "inCity": "у Львові", "fromCity": "зі Львова" } }
```

### Автоматично з’являється

```
/lviv  ·  /lviv/matte-ceilings  ·  /lviv/prices  ·  /lviv/faq
/ru/lviv  ·  /ru/lviv/matte-ceilings  ·  ...

+ всі 17 послуг × 2 локалі
+ sitemap entries
+ LocalBusiness Schema з coordinates
+ hreflang uk-UA ↔ ru-UA ↔ x-default
+ GeoMetaTags (geo.region · ICBM)
+ canonical URLs
+ Регіональні ціни через DB priceModifier
```

-----

## 17. PERFORMANCE TARGETS

```
LCP:          < 1.2s    (mobile)
INP:          < 50ms
CLS:          0.00
TTFB:         < 50ms    (Vercel Edge + Cloudflare)
FCP:          < 0.8s
Critical JS:  < 50kb    (gzip · публічні сторінки)
Lighthouse:   98–100    (mobile + desktop)
```

### AI Integration Points — конкретні точки входу

Архітектура готова до підключення будь-якого AI API **без зміни runtime**:

```
AI API підключається ТІЛЬКИ через:
  platform/data/     ← читає дані для аналізу
  app/api/admin/ai/  ← отримує рекомендації
  DB / JSON config   ← записує затверджені зміни
  revalidateTag()    ← тригерить rebuild

AI НІКОЛИ не торкається:
  app/[locale]/      ← runtime routes
  src/platform/seo/  ← SEO logic
  _components/       ← UI компоненти
```

**Готові AI integration points:**

|AI задача           |Точка входу                          |Що змінює                                    |
|--------------------|-------------------------------------|---------------------------------------------|
|SEO аналіз          |`GET /api/admin/ai/seo-audit`        |Читає всі metadata → повертає рекомендації   |
|Генерація title/desc|`POST /api/admin/ai/suggest-metadata`|Пропонує → людина затверджує → JSON override |
|UX аналіз           |GA4 API → AI → `/api/admin/ai/ux`    |Рекомендує block variants                    |
|A/B тести           |`POST /api/admin/ai/ab-test`         |Змінює block variant в config → revalidate   |
|Генерація FAQ       |`POST /api/admin/ai/generate-faq`    |Створює FAQ items → людина редагує → зберігає|
|Пошук помилок       |`GET /api/admin/ai/dev-audit`        |Аналізує bundle, hydration, Schema           |
|Рефакторинг data    |`GET /api/admin/ai/data-audit`       |Аналізує config → пропонує структурні зміни  |

**Принцип незмінний:**

```
AI suggestion → Human review → Approval → Config/JSON update → revalidateTag() → SSG
```

Жодна AI рекомендація не деплоїться автоматично.
Жоден AI не мутує runtime код.
Архітектура залишається immutable.

-----

## 18. ACCEPTANCE CRITERIA

### Performance

- [ ] Lighthouse Mobile ≥ 98 на всіх публічних сторінках
- [ ] LCP < 1.2s · INP < 50ms · CLS = 0.00 · TTFB < 50ms
- [ ] Critical JS < 50kb gzip
- [ ] Admin bundle НЕ завантажується на публічних сторінках

### SEO Технічне

- [ ] `trailingSlash: false` + 301 для URLs зі слешем
- [ ] Canonical URL на кожній сторінці
- [ ] hreflang `uk-UA` ↔ `ru-UA` ↔ `x-default` на кожній сторінці
- [ ] sitemap.xml = 100% активних URL з alternates.languages
- [ ] robots.txt: allow `/` · disallow `/api/ /_next/ /admin/`
- [ ] Унікальні title (30–60 chars) · description (100–155 chars)
- [ ] Всі images: alt + width + height
- [ ] JSON-LD Schema на кожній сторінці

### Schema.org

- [ ] LocalBusiness + coordinates per місто
- [ ] FAQPage де є FAQ
- [ ] BreadcrumbList скрізь
- [ ] Article Schema на статтях

### CSS / Design

- [ ] Жодного `!important`
- [ ] Жодних magic numbers
- [ ] `@layer` архітектура дотримана
- [ ] oklch() для всіх кольорів
- [ ] Mobile-first скрізь
- [ ] WCAG 2.2 AA

### Architecture

- [ ] Жодного `"use client"` у layout.tsx
- [ ] Жодних barrel `export *`
- [ ] Admin bundle динамічно імпортований (не на публіці)
- [ ] Всі SEO imports через `@/seo`
- [ ] Route-specific UI в `_components/`
- [ ] TypeScript strict · no any

### Data & Admin

- [ ] DB override пріоритет над geo-matrix config
- [ ] Granular revalidation (не full rebuild)
- [ ] Design tokens з DB → CSS variables
- [ ] SEO Audit з score per сторінка
- [ ] Metadata override через адмінку працює

### Тести

- [ ] `npm run build` — нуль TypeScript помилок
- [ ] Playwright E2E: форма · навігація · city switch · мова switch
- [ ] Vitest unit: всі `platform/seo/` функції

-----

*NOVA STELYA Master Specification v5.0 FINAL COMPLETE*
*Website Operating System · Next.js 16.2+ · Swiss Watch Engineering · Gold Standard 2026*