# ARCHITECTURAL INVARIANT — NOVA STELYA

## Swiss Watch Next.js 16.2 Runtime Philosophy

> **Файл:** `04_ARCHITECTURAL_INVARIANT.md`
> **Статус:** INVARIANT — не підлягає перегляду без технічного обґрунтування
> **Призначення:** Визначає фундаментальні архітектурні закони проекту.
> Будь-яке рішення що порушує цей документ є архітектурно невалідним.

-----

## КЛЮЧОВА ТЕЗА

```
Структура папок ≠ швидкість

Архітектурні boundaries = швидкість
```

Продуктивність Next.js 16.2 визначається:

```
rendering model          ← SSG/ISR/SSR/PPR
bundle graph             ← що потрапляє в JS bundle
dependency graph         ← import chain
route locality           ← де живе код відносно route
server/client boundaries ← де проходить гідратація
tree shaking             ← що видаляється при build
cache locality           ← де і як кешується
hydration boundaries     ← скільки JS виконується в браузері
```

**НЕ** визначається візуальною красою папок.

-----

## CORE INVARIANT

```
PERFORMANCE FIRST
    >
VISUAL FOLDER BEAUTY
    >
ENTERPRISE ABSTRACTION
    >
DEVELOPER PREFERENCE
```

Візуально красива архітектура що деградує runtime — **архітектурно невалідна**.

-----

## РЕАЛЬНА КАРТИНА ДЛЯ NOVA STELYA

### Чому чиста Route-Centric недостатня для цього проекту

Nova Stelya — не типовий Next.js проект.

```
17 послуг × N міст × 2 мови = 680+ унікальних сторінок
```

Якщо дублювати `_seo/` в кожному route:

```
app/[locale]/[city]/matte-ceilings/_seo/    ← копія
app/[locale]/[city]/glossy-ceilings/_seo/   ← копія
app/[locale]/[city]/satin-ceilings/_seo/    ← копія
... × 17 послуг × N міст
```

Результат — **не route locality, а route duplication**.
Це гірше ніж централізований Platform Layer.

### Правильна відповідь — Hybrid

```
platform/seo/              ← SEO Platform Layer
                         Логіка, типи, builders, constants
                         НЕ містить компоненти з JSX
                         НЕ barrel exports
                         Точкові imports

app/[locale]/
└── [city]/
    └── [service]/
        ├── page.tsx          ← composition root
        ├── _components/      ← route-specific UI
        └── (імпортує з platform/seo/ точково)
```

**Platform Layer** = shared logic без duplication
**Route locality** = UI компоненти живуть поруч з route

Вони не суперечать одне одному.

-----

## 9 ПРИНЦИПІВ — ТЕХНІЧНА СПЕЦИФІКАЦІЯ

-----

### ПРИНЦИП 1 — ROUTE LOCALITY

**Що це означає для Nova Stelya:**

```typescript
// ✅ Route-specific UI — живе поруч з route
app/[locale]/[city]/[service]/
├── page.tsx
├── loading.tsx
├── error.tsx
└── _components/
    ├── CityServiceHero.tsx      ← тільки для цього route
    ├── LocalPriceTable.tsx      ← тільки для цього route
    └── CityServiceGallery.tsx   ← тільки для цього route

// ✅ Shared logic — живе в Platform Layer
platform/seo/
├── metadata/generate-page-metadata.ts
├── schema/builders/local-business.ts
└── content/city-copy.ts

// ❌ ЗАБОРОНЕНО — shared UI компоненти для route-specific речей
src/components/CityServiceHero.tsx  ← якщо використовується тільки в [city]/[service]
```

**Правило:**

- Route-specific UI → `_components/` поруч з route
- Shared logic (SEO, schema, utils) → Platform Layer
- Shared UI primitives (Button, Card, Input) → `src/ui/`

-----

### ПРИНЦИП 2 — SERVER-FIRST BOUNDARIES

**Дефолт: Server Component.**
`"use client"` — виняток з обґрунтуванням.

```typescript
// ✅ Server за замовчуванням
// app/[locale]/[city]/[service]/page.tsx
export default async function CityServicePage({ params }) {
  const city = getCityBySlug(params.city);
  const faq = getServiceFAQ(params.service, params.locale, city);
  // Рендериться на сервері. Нуль JS в браузері.
  return (
    <>
      <JsonLd schema={getPageSchema(...)} />
      <CityServiceHero city={city} />        {/* Server */}
      <LocalPriceTable city={city} />        {/* Server */}
      <FAQSection items={faq} />             {/* Server */}
      <CalculatorIsland city={city} />       {/* Client island — виняток */}
    </>
  );
}

// ✅ Client тільки де потрібна інтерактивність
// app/[locale]/[city]/[service]/_components/CalculatorIsland.tsx
"use client";
// Ізольований Client island — не заражає subtree
```

**Заборонені патерни:**

```typescript
// ❌ "use client" на рівні page.tsx
"use client";
export default function CityServicePage() { ... }
// Весь subtree стає client → гідратація всього → INP деградує

// ❌ "use client" у layout.tsx
"use client";
export default function Layout({ children }) { ... }
// КРИТИЧНО: заражає всі дочірні routes
```

**Client дозволений ТІЛЬКИ для:**

```
Калькулятор
Форма заявки
Мобільне меню (toggle)
Модальні вікна
Cookie consent banner (dismiss)
City Banner (dismiss)
Карта (Google Maps)
Слайдери/галереї з touch
```

-----

### ПРИНЦИП 3 — HYDRATION ISLANDS

**Ціль:**

```
Critical JS на публічних сторінках < 50kb (gzip)
```

**Модель:**

```
Page (Server)
├── Header (Server)
│   └── MobileMenuToggle (Client Island — тільки toggle logic)
├── Hero (Server)
├── PriceTable (Server — дані з geo-matrix, рендер server-side)
├── FAQ (Server — static content, FAQPage Schema)
├── Calculator (Client Island — інтерактивний)
│   └── ContactForm (Client Island — форма + валідація)
└── Footer (Server)
```

**Анти-патерн:**

```typescript
// ❌ Giant client wrapper
"use client";
export default function PageWrapper({ children }) {
  const [city, setCity] = useState(null);
  // Весь subtree тепер client
  return <CityContext.Provider>{children}</CityContext.Provider>;
}
```

**Правильно — передавати дані через props, не через client context:**

```typescript
// ✅ Server передає дані вниз як props
// page.tsx (Server)
export default async function Page({ params }) {
  const city = getCityBySlug(params.city); // server-side
  return <CityServiceHero city={city} />;  // prop drilling — ok для Server Components
}
```

-----

### ПРИНЦИП 4 — STATIC-FIRST GRAPH

**Ієрархія рендерингу:**

```
SSG з use cache    ← завжди перший вибір
↓
ISR з revalidation ← якщо контент оновлюється
↓
Partial (PPR)      ← static shell + dynamic islands
↓
SSR               ← тільки якщо неминуче (auth-gated, real-time)
```

**Nova Stelya — рендеринг per тип:**

```typescript
// Сторінки послуг + міст + city×service → SSG з use cache
"use cache";
import { cacheTag, cacheLife } from "next/cache";

export default async function CityServicePage({ params }) {
  cacheLife({ revalidate: 3600 });
  cacheTag(`city-${params.city}`);
  cacheTag(`service-${params.service}`);
  // ...
}

// Блог/портфоліо → on-demand revalidation
export default async function BlogPost({ params }) {
  cacheLife("max");  // кеш до on-demand revalidation
  cacheTag(`blog-${params.slug}`);
  // Revalidate тригериться через /api/revalidate webhook від власної адмінки
}

// Прайс → коротший cache
export default async function PricesPage() {
  cacheLife({ revalidate: 900 }); // 15 хвилин
  cacheTag("prices");
}
```

**Заборонено:**

```typescript
// ❌ force-dynamic без причини
export const dynamic = "force-dynamic";

// ❌ SSR для статичного контенту
export const revalidate = 0;
```

-----

### ПРИНЦИП 5 — IMPORT GRAPH MINIMIZATION

**Правило barrel exports:**

```typescript
// ❌ ЗАБОРОНЕНО — barrel що реекспортує все
// platform/seo/index.ts
export * from "./metadata";
export * from "./schema";
export * from "./sitemap";
export * from "./geo";
export * from "./content";
export * from "./utils";
// Один import тягне весь seo/ модуль → bundle bloat

// ✅ ПРАВИЛЬНО — точковий public API
// platform/seo/index.ts — тільки те що реально потрібно в app/
export { generatePageMetadata } from "./metadata/generate-page-metadata";
export { getPageSchema }        from "./schema/page-schemas";
export { JsonLd }               from "@/ui/JsonLd";
export { generateSitemap }      from "./sitemap/generate-sitemap";
export { GeoMetaTags }          from "@/ui/GeoMetaTags";
export { getServiceFAQ }        from "./content/faq-rules";
export { buildCityServiceH1 }   from "./content/city-copy";
// Тільки 7 публічних exports — не 50
```

**Правило imports в app/:**

```typescript
// ✅ Точковий import через public API
import { generatePageMetadata, getPageSchema } from "@/platform/seo";

// ❌ Прямий import внутрішнього файлу
import { buildTitle } from "@/seo/metadata/core";
import { SITE } from "@/seo/constants/site";
// Порушує encapsulation, ускладнює рефакторинг
```

**Правило локальних imports:**

```typescript
// ✅ Route-local компонент імпортує локально
// app/[locale]/[city]/[service]/page.tsx
import { CityServiceHero } from "./_components/CityServiceHero";
import { LocalPriceTable }  from "./_components/LocalPriceTable";
// Turbopack бачить локальний граф → кращий code splitting

// ❌ Глобальний import для route-specific компонента
import { CityServiceHero } from "@/components/city/CityServiceHero";
// Компонент потрапляє в shared bundle
```

-----

### ПРИНЦИП 6 — CACHE LOCALITY

**Next.js 16.2 `use cache` — правила:**

```typescript
// Кожна cache одиниця має свій tag
// Tag = одиниця інвалідації

// Сторінка міста
cacheTag(`city-${city.slug}`);
// При оновленні міста → revalidateTag(`city-kyiv`) → тільки Київ

// Сторінка послуги
cacheTag(`service-${serviceSlug}`);
// При оновленні послуги → тільки ця послуга

// City × Service
cacheTag(`city-${city.slug}`);
cacheTag(`service-${serviceSlug}`);
// Інвалідується при зміні БУДЬ-ЧОГО з міста або послуги

// Sitemap
cacheTag("sitemap");
// При додаванні міста → revalidateTag("sitemap")
```

**Cache granularity:**

```typescript
// ✅ Гранулярний cache per сутність
async function getCityData(slug: string) {
  "use cache";
  cacheTag(`city-${slug}`);
  cacheLife({ revalidate: 3600 });
  return db.cities.findBySlug(slug);
}

// ❌ Один великий cache на все
async function getAllData() {
  "use cache";
  cacheTag("all");  // revalidate "all" = весь сайт перебудовується
  return { cities, services, blog, portfolio };
}
```

-----

### ПРИНЦИП 7 — DYNAMIC IMPORT DISCIPLINE

**Важкі компоненти → lazy load:**

```typescript
// ✅ Admin bundle ніколи не потрапляє на публічні сторінки
import dynamic from "next/dynamic";

// Карта — важка, не потрібна при першому рендері
const CityMap = dynamic(
  () => import("./_components/CityMap"),
  {
    loading: () => <div className="map-skeleton" aria-label="Завантаження карти" />,
    ssr: false, // карта потребує window
  }
);

// Admin SEO Panel — повністю ізольований
// app/(admin)/admin/seo/ → окремий route group
// НІКОЛИ не завантажується на публічних routes
```

**Правило admin isolation:**

```typescript
// app/(admin)/ — route group
// Next.js автоматично code-split'ить route groups
// Публічні users ніколи не завантажують admin bundle

// Перевірка в middleware:
if (pathname.startsWith("/admin")) {
  const session = await verifyAdminToken(request);
  if (!session) return NextResponse.redirect(new URL("/", request.url));
}
```

-----

### ПРИНЦИП 8 — ADMIN ABSTRACTION LAYER

**Розділення:**

```
ПУБЛІЧНА АРХІТЕКТУРА          ADMIN АРХІТЕКТУРА
optimizes for:                optimizes for:
  runtime performance           human cognition
  bundle size                   logical grouping
  cache efficiency              easy navigation
  server boundaries             intuitive editing
```

**Що бачить людина в Admin UI:**

```
📁 Cities          → керування містами + SEO per місто
📁 Services        → 17 послуг + SEO per послуга
📁 SEO Audit       → перевірка всього сайту з score
📁 Metadata Editor → title/description/OG per сторінка
📁 Schema Viewer   → JSON-LD validator
📁 Sitemap         → всі URL + revalidation
📁 Analytics       → GSC + GA4 + CWV
📁 FAQ             → редагування FAQ
📁 Portfolio       → управління роботами
📁 Blog            → статті
📁 Redirects       → 301/302 правила
```

**Що відбувається в runtime:**

```
city page
  → generateStaticParams від geo-matrix
  → generatePageMetadata від platform/seo/
  → getPageSchema від platform/seo/
  → use cache з city tag
  → static HTML на Cloudflare CDN
```

Людина бачить логічну адмінку.
Машина виконує оптимізований runtime.
Вони не заважають одне одному.

-----

### ПРИНЦИП 9 — PERFORMANCE > VISUAL ORDER

**Фільтр для будь-якого рішення:**

```
Питання перед кожним архітектурним рішенням:

1. Чи збільшує це bundle size?
2. Чи додає це клієнтський JS там де не потрібно?
3. Чи порушує це route locality для UI компонентів?
4. Чи створює це barrel export що тягне зайве?
5. Чи переміщує це Server Component до Client без причини?
6. Чи погіршує це cache granularity?

Якщо відповідь на будь-яке питання "Так" —
рішення потребує технічного обґрунтування.
Якщо обґрунтування немає — рішення відхиляється.
```

-----

## ФІНАЛЬНА АРХІТЕКТУРНА СТРУКТУРА

```
nova-stelya/
│
├── app/                              ← Next.js App Router
│   ├── layout.tsx                    ← Root (Server)
│   ├── not-found.tsx
│   ├── sitemap.ts                    ← auto-generated
│   ├── robots.ts
│   ├── manifest.ts
│   │
│   └── [locale]/                     ← uk (/) | ru (/ru)
│       ├── layout.tsx                ← Locale layout (Server)
│       ├── page.tsx                  ← Головна (SSG)
│       │
│       ├── (catalog)/                ← Route group, не впливає на URL
│       │   └── matte-ceilings/
│       │       ├── page.tsx          ← Server Component
│       │       └── _components/      ← Route-local UI
│       │           └── ServiceHero.tsx
│       │
│       ├── (lighting)/               ← Route group
│       ├── (rooms)/                  ← Route group
│       │
│       ├── prices/
│       ├── faq/
│       ├── blog/
│       │   └── [slug]/
│       ├── portfolio/
│       │   └── [slug]/
│       ├── contacts/
│       ├── about/
│       │
│       └── [city]/                   ← Динамічний: generateStaticParams
│           ├── layout.tsx            ← GeoMetaTags (Server)
│           ├── page.tsx              ← City Hub (Server + use cache)
│           │
│           ├── _components/          ← ⭐ Route-local: тільки для [city]
│           │   ├── CityHero.tsx      ← Server
│           │   ├── CityServices.tsx  ← Server
│           │   ├── LocalMap.tsx      ← dynamic import (Client island)
│           │   └── CityReviews.tsx   ← Server
│           │
│           ├── prices/
│           ├── portfolio/
│           ├── faq/
│           │
│           └── [service]/            ← generateStaticParams × all services
│               ├── page.tsx          ← Server Component + use cache
│               │
│               └── _components/      ← ⭐ Route-local: тільки для city×service
│                   ├── CityServiceHero.tsx    ← Server
│                   ├── LocalPriceTable.tsx    ← Server
│                   ├── CityServiceGallery.tsx ← Server
│                   └── CalculatorIsland.tsx   ← "use client" Island
│
├── app/api/                          ← API Routes (Edge Functions)
│   ├── contact/route.ts
│   ├── revalidate/route.ts
│   └── geo/route.ts
│
├── app/(admin)/                      ← ⭐ Route group: повна ізоляція
│   └── admin/
│       ├── layout.tsx                ← Auth guard
│       ├── page.tsx                  ← Dashboard
│       └── seo/
│           ├── page.tsx
│           ├── audit/
│           ├── pages/
│           ├── schema/
│           ├── sitemap/
│           └── analytics/
│
├── src/
│   │
│   ├── seo/                          ← ⭐ SEO PLATFORM LAYER
│   │   ├── index.ts                  ← Public API (7 точних exports)
│   │   ├── types/
│   │   ├── constants/
│   │   ├── urls/
│   │   ├── alternates/               ← hreflang: uk-UA / ru-UA / x-default
│   │   ├── metadata/
│   │   │   ├── core.ts
│   │   │   ├── generate-page-metadata.ts  ← + DB override check
│   │   │   └── templates/            ← home, service, city, city-service...
│   │   ├── schema/
│   │   │   ├── builders/
│   │   │   ├── page-schemas.ts
│   │   │   └── inject/jsonld.tsx
│   │   ├── sitemap/
│   │   ├── robots/
│   │   ├── geo/
│   │   ├── content/
│   │   │   ├── city-copy.ts
│   │   │   ├── faq-rules.ts          ← FAQ без city-спаму
│   │   │   └── forbidden-patterns.ts
│   │   └── admin/                    ← Audit engine
│   │       ├── audit-engine.ts
│   │       ├── seo-score.ts
│   │       └── report-generator.ts
│   │
│   ├── config/                       ← Data layer
│   │   ├── geo-matrix.ts             ← Єдине джерело правди: міста
│   │   ├── services.config.ts        ← 17 послуг
│   │   ├── locales.config.ts
│   │   └── page-blocks.config.ts
│   │
│   ├── ui/                           ← Shared UI primitives
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Badge/
│   │   ← НЕ містить business-specific компоненти
│   │   ← Тільки design system primitives
│   │
│   ├── lib/
│   │   ├── i18n.ts
│   │   ├── admin-client.ts        ← Admin API client
│   │   ├── db/
│   │   │   └── seo-overrides.ts      ← overrides (JSON/memory · Фаза 2: DB)
│   │   └── auth.ts
│   │
│   ├── messages/
│   │   ├── uk.json
│   │   └── ru.json
│   │
│   └── styles/
│       ├── tokens.css                ← CSS custom properties
│       ├── reset.css
│       ├── typography.css
│       └── layers.css                ← @layer architecture
│
├── middleware.ts                     ← next-intl + city cookie + bot detect
├── next.config.ts                    ← trailingSlash: false
└── i18n.config.ts
```

-----

## МЕЖА МІЖ ROUTE-LOCAL ТА PLATFORM LAYER

```
Питання: де повинен жити цей код?

                    ┌─────────────────────────────────┐
                    │ Використовується тільки в        │
                    │ одному route?                    │
                    └──────────────┬──────────────────┘
                                   │
                    YES             │              NO
                     ↓             │              ↓
          ┌──────────────────┐     │    ┌──────────────────────┐
          │ _components/     │     │    │ Використовується в   │
          │ поруч з route    │     │    │ 2+ routes?           │
          └──────────────────┘     │    └──────────┬───────────┘
                                   │               │
                                   │   UI primitive?  Logic/data?
                                   │       ↓              ↓
                                   │   src/ui/       platform/seo/ або
                                   │                 src/lib/
```

-----

## PERFORMANCE TARGETS

```
LCP:          < 1.2s    (mobile)
INP:          < 50ms
CLS:          0.00
TTFB:         < 50ms    (Vercel Edge)
FCP:          < 0.8s
Critical JS:  < 50kb    (gzip, публічні сторінки)
Lighthouse:   98–100    (mobile + desktop)
```

-----

## INVARIANT VIOLATIONS — ПРИКЛАДИ

|Дія                                        |Порушення|Наслідок                 |
|-------------------------------------------|---------|-------------------------|
|`"use client"` у layout.tsx                |Принцип 2|Весь сайт client-side    |
|`export * from "@/platform/seo"`           |Принцип 5|Bundle bloat             |
|SSR для static сторінок міст               |Принцип 4|TTFB деградує            |
|City-specific компонент в `src/components/`|Принцип 1|Shared bundle росте      |
|Admin bundle без dynamic import            |Принцип 7|Admin JS на публіці      |
|Один `cacheTag("all")`                     |Принцип 6|Весь сайт revalidates    |
|Giant Client Context Provider              |Принцип 3|Вся сторінка гідратується|

-----

## ФІНАЛЬНИЙ ЗАКОН

```
Swiss Watch Engineering для Next.js =

minimal          ← мінімум JS в браузері
predictable      ← зрозумілий rendering model
fast             ← SSG + Edge CDN + use cache
isolated         ← route-local UI, platform-level logic
cache-friendly   ← гранулярні cache tags
route-optimized  ← code splitting per route
server-first     ← RSC за замовчуванням
static-first     ← SSG перший вибір
hydration-minimal ← Client тільки острівці
```

```
Архітектура оптимізована під те,
як Next.js насправді виконує код —
а не під те, як папки виглядають візуально.
```

-----

*NOVA STELYA · Architectural Invariant v1.0 FINAL*
*Next.js 16.2+ · Swiss Watch Runtime Philosophy · Gold Standard 2026*