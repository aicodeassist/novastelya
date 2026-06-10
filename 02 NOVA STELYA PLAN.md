# NOVA STELYA — ПЛАН РЕАЛІЗАЦІЇ v4.0 FINAL

> Всі рішення затверджені. Файл є єдиним джерелом правди для порядку розробки.

-----

## ЗАТВЕРДЖЕНІ РІШЕННЯ

|Питання                |Рішення                                           |
|-----------------------|--------------------------------------------------|
|Framework              |**Next.js 16.2+** (остання стабільна)             |
|trailingSlash          |**false** — скрізь, без винятків (крім кореня `/`)|
|Мова за замовчуванням  |**uk** без префікса, **ru** = `/ru`               |
|hreflang формат        |**uk-UA / ru-UA / x-default** (НЕ uk/ru/ru-RU)    |
|SEO-структура          |**`platform/seo/`** — єдиний SEO Platform Layer   |
|CSS                    |**Vanilla CSS only** — ніякого Tailwind           |
|CMS                    |Власна кастомна адмінка — ніякого стороннього CMS |
|Database               |— зараз. Архітектура готова до PostgreSQL у Фазі 2|
|Зображення CDN         |**Cloudinary** — єдиний пайплайн                  |
|Кешування              |**`use cache`** directive (Next.js 16.2 native)   |
|Дизайн                 |Преміум мінімалізм, найкращий на ринку            |
|Сторінка “Про компанію”|**Так**                                           |
|Пошук на сайті         |**Ні**                                            |
|Cookie consent         |**Так**, з toggle в коді                          |
|Контент                |Реалістичний demo-контент                         |
|Тести                  |**Playwright** E2E + **Vitest** unit              |
|Admin Panel            |**Так** — власна адмін-панель з SEO Management    |

-----

## ФАЗА 0: ФУНДАМЕНТ

### Ініціалізація проєкту

- [ ] `next.config.ts` — trailingSlash: false, images, headers, redirects
- [ ] `tsconfig.json` — strict mode, paths aliases (`@/seo`, `@/config`, etc)
- [ ] `package.json` — всі залежності
- [ ] ESLint + Prettier конфіг
- [ ] `.env.example` — всі змінні середовища з коментарями
- [ ] Env validation (з `@t3-oss/env-nextjs`)

### Конфігурації

- [ ] `src/config/geo-matrix.ts` — з build-time валідацією reserved slugs
- [ ] `src/config/services.config.ts` — всі 17 послуг + SEO метадані
- [ ] `src/config/locales.config.ts` — uk/ru + hreflang mapping
- [ ] `src/config/seo.config.ts` — глобальні SEO дефолти
- [ ] `src/config/page-blocks.config.ts` — LEGO-блоки per тип сторінки
- [ ] `i18n.config.ts` — next-intl конфіг

### CSS Design System

- [ ] CSS custom properties (design tokens)
- [ ] Reset + `@layer` архітектура
- [ ] Spacing scale: `--space-2xs` → `--space-xl`
- [ ] Typography scale
- [ ] Color palette (premium dark + light)
- [ ] Component base styles

**Заборонено в CSS:**

```css
/* ❌ */
padding: 17px;
margin: 29px;
!important;
.card .box .item .text span { }  /* глибока вкладеність */

/* ✅ */
padding: var(--space-md);
.component-name__element { }
```

-----

## ФАЗА 1: ЯДРО

### SEO Platform Layer (`platform/seo/`)

> Детальна специфікація: `03_SEO_PLATFORM_LAYER.md`

```
platform/seo/
├── index.ts                    ← PUBLIC API (єдина точка імпорту)
├── types/                      ← TypeScript типи першими
├── constants/                  ← site.ts, locales.ts, seo-defaults.ts, routes.ts
├── urls/                       ← build-path.ts, build-canonical.ts
├── alternates/                 ← build-hreflang.ts (uk-UA/ru-UA/x-default)
├── metadata/
│   ├── core.ts                 ← buildTitle, buildDescription, buildOG, buildTwitter
│   ├── generate-page-metadata.ts
│   └── templates/              ← home, service, city, city-service, prices,
│                                  faq, blog-list, blog-post, portfolio, contacts
├── schema/
│   ├── builders/               ← organization, local-business, service, faq,
│   │                              breadcrumb, article, review, image-gallery
│   ├── page-schemas.ts         ← комбінує builders per тип сторінки
│   └── inject/jsonld.tsx       ← <JsonLd schema={...} />
├── sitemap/
│   ├── config.ts               ← priorities + changeFrequency
│   └── routes/                 ← static, service, city, city-service, blog, portfolio
├── robots/
├── geo/                        ← GeoMetaTags + local-seo helpers
├── content/
│   ├── city-copy.ts            ← city-aware H1, CTA, descriptions
│   ├── faq-rules.ts            ← універсальні FAQ без city-спаму
│   ├── forbidden-patterns.ts
│   └── title-rules.ts + description-rules.ts
└── audit/                      ← dev-only SEO валідація
```

**Вимоги до SEO модуля:**

- [ ] `generatePageMetadata()` — одна функція для всіх типів сторінок
- [ ] hreflang ключі: `"uk-UA"`, `"ru-UA"`, `"x-default"` (строго)
- [ ] `buildPath()` враховує trailingSlash: false
- [ ] FAQ без city-спаму (місто тільки в ціні/телефоні)
- [ ] Override system: DB override > auto-generated
- [ ] `audit/` запускається тільки в dev mode

### i18n + Middleware

- [ ] `middleware.ts` — next-intl + city cookie + AI bot detection
- [ ] `src/messages/uk.json` — всі переклади
- [ ] `src/messages/ru.json` — всі переклади
- [ ] `src/lib/i18n.ts` — helpers
- [ ] `src/lib/routes.ts` — типізовані посилання

### Layout + UI компоненти

- [ ] Root layout (`app/layout.tsx`)
- [ ] Locale layout (`app/[locale]/layout.tsx`)
- [ ] City layout (`app/[locale]/[city]/layout.tsx`)
- [ ] `not-found.tsx` (global + locale)
- [ ] Header (Server Component + mobile nav Client)
- [ ] Footer
- [ ] Breadcrumb (з BreadcrumbList Schema)
- [ ] CityBanner (Server + Client dismiss)
- [ ] Button, Card, Badge, Input, Modal, Drawer

-----

## ФАЗА 2: СТОРІНКИ

### Статичні сторінки

- [ ] Головна `/` — Hero, CatalogGrid, Benefits, Portfolio preview, CTA
- [ ] Прайс `/prices`
- [ ] FAQ `/faq` — з FAQPage Schema
- [ ] Контакти `/contacts`
- [ ] Про компанію `/about`

### Сторінки послуг (17 штук — route groups)

```
(catalog):   matte-ceilings, glossy-ceilings, satin-ceilings, fabric-ceilings,
             shadow-ceilings, floating-ceilings, slotted-ceilings,
             carved-ceilings, double-level-ceilings
(lighting):  light-lines, track-lighting, backlight, starry-sky
(rooms):     kitchen-ceilings, bathroom-ceilings, bedroom-ceilings,
             living-room-ceilings
```

Кожна сторінка послуги:

- [ ] `generateMetadata` через `src/seo`
- [ ] `JsonLd` з Service + BreadcrumbList + FAQPage Schema
- [ ] LEGO-блоки з `page-blocks.config.ts`
- [ ] FAQ через `getServiceFAQ()`

### City System

- [ ] `app/[locale]/[city]/page.tsx` — City Hub
- [ ] `app/[locale]/[city]/[service]/page.tsx` — City × Service
- [ ] `app/[locale]/[city]/prices/page.tsx`
- [ ] `app/[locale]/[city]/portfolio/page.tsx`
- [ ] `app/[locale]/[city]/faq/page.tsx`
- [ ] `generateStaticParams` для всіх city routes

### Блог + Портфоліо (demo-контент)

- [ ] `/blog` — список статей
- [ ] `/blog/[slug]` — стаття з Article Schema
- [ ] `/blog/category/[category]`
- [ ] `/portfolio` — галерея
- [ ] `/portfolio/[slug]` — проект з ImageGallery Schema

-----

## ФАЗА 3: ІНТЕРАКТИВ + API

### Калькулятор

- [ ] Client Component (чистий React, без бібліотек)
- [ ] `useState` + `useCallback` тільки
- [ ] Валідація телефону: маска `+38 (0XX) XXX-XX-XX`
- [ ] Регіональні ціни через `city.priceModifier`

### API Routes

- [ ] `POST /api/contact` — заявка → Telegram · Zod · Rate limit
- [ ] `POST /api/revalidate` — Admin webhook → `revalidateTag()`
- [ ] `GET /api/geo` — визначення міста по IP (Edge Function)
- [ ] Rate limiting: Upstash (5 заявок / 10 хв per IP)
- [ ] Zod валідація на всіх POST routes
- [ ] Telegram token — тільки серверна env змінна

### Cookie Consent

- [ ] Banner компонент (toggle в коді: `COOKIE_CONSENT_ENABLED`)
- [ ] Зберігає вибір в cookie `cookie-consent`
- [ ] Якщо вимкнено — GA4 не ініціалізується

-----

## ФАЗА 4: ADMIN SEO PANEL

> Детальна специфікація у розділі 19 файлу `01_NOVA_STELYA_MASTER_SPEC.md`

### Захист + Auth

- [ ] JWT auth для адмін-маршрутів
- [ ] Route group `app/(admin)/`
- [ ] Middleware перевіряє `role: "seo_admin"`

### SEO Dashboard

- [ ] SEO Health Score (0–100) по всьому сайту
- [ ] CWV summary (LCP / INP / CLS)
- [ ] Топ-10 сторінок за трафіком

### SEO Audit Engine

- [ ] `platform/seo/admin/audit-engine.ts`
- [ ] Перевірка КОЖНОЇ сторінки: title, description, canonical, hreflang, Schema, H1, alt
- [ ] SEO Score per сторінка (0–100)
- [ ] Таблиця з фільтрами + сортуванням
- [ ] Export: CSV / PDF

### Metadata Editor

- [ ] Перегляд / редагування title, description, OG image per сторінка
- [ ] SERP snippet preview (як виглядає в Google)
- [ ] OG card preview (як виглядає при шерінгу)
- [ ] SEO Metadata overrides зберігаються і мають пріоритет

### Schema Validator

- [ ] JSON-LD viewer per сторінка
- [ ] Валідація через Google Rich Results API
- [ ] Статус: Valid / Warnings / Errors

### Sitemap Manager

- [ ] Перегляд всіх URL в sitemap
- [ ] Ручна revalidation кнопка
- [ ] Статистика по типах URL

### SEO Аналітика

- [ ] Google Search Console API інтеграція
- [ ] GA4 API — трафік, CTR, позиції
- [ ] Core Web Vitals з Google CrUX API

### DB таблиці

- [ ] `seo_overrides` — override metadata
- [ ] `seo_audit_runs` — історія аудитів
- [ ] `seo_audit_log` — лог змін

-----

## ФАЗА 5: ФІНАЛІЗАЦІЯ

### Performance

- [ ] Lighthouse Mobile ≥ 98 на всіх сторінках
- [ ] LCP < 1.2s, INP < 50ms, CLS = 0.00
- [ ] TTFB < 50ms (Vercel Edge)
- [ ] Zero unused CSS (CSS Modules + critical inline)

### Тести

- [ ] Playwright E2E: критичні потоки (форма, навігація, city switch)
- [ ] Vitest unit: всі `platform/seo/` функції
- [ ] `npm run build` — TypeScript strict, без помилок

### SEO Фінальний аудит

- [ ] Rich Results Test — всі Schema валідні
- [ ] hreflang checker — uk-UA/ru-UA/x-default скрізь
- [ ] Sitemap валідація — 100% URL
- [ ] Canonical URL на кожній сторінці

### Моніторинг

- [ ] Sentry (error tracking)
- [ ] Vercel Speed Insights
- [ ] Vercel Analytics
- [ ] GSC + GA4 підключені

-----

## ACCEPTANCE CRITERIA — ФІНАЛЬНИЙ ЧЕКЛИСТ

### Performance

- [ ] Lighthouse Mobile Performance ≥ 98
- [ ] LCP < 1.2s на мобільному
- [ ] INP < 50ms
- [ ] CLS = 0.00
- [ ] TTFB < 100ms

### SEO Технічне

- [ ] `trailingSlash: false` + 301 redirect зі слешем → без слеша
- [ ] Canonical URL на кожній сторінці
- [ ] hreflang `uk-UA` ↔ `ru-UA` ↔ `x-default` на кожній сторінці
- [ ] sitemap.xml = 100% активних URL
- [ ] robots.txt: дозволяє `/`, блокує `/api/ /_next/ /admin/`
- [ ] Унікальні title + description на кожній сторінці
- [ ] Всі зображення: `alt` + `width` + `height`

### Schema.org

- [ ] JSON-LD на кожній сторінці
- [ ] LocalBusiness + координати для кожного міста
- [ ] FAQPage на FAQ сторінках
- [ ] BreadcrumbList на всіх сторінках
- [ ] Article Schema на статтях блогу

### Функціональність

- [ ] Форма → Telegram працює
- [ ] on-demand revalidation від власної адмінки працює
- [ ] City Banner показується при першому відвідуванні
- [ ] Cookie зберігає вибране місто (30 днів)
- [ ] Cookie Consent toggle працює

### City System

- [ ] Нове місто = 2 кроки (geo-matrix + messages)
- [ ] Нове місто автоматично отримує всі сторінки
- [ ] Регіональні ціни через `priceModifier`
- [ ] Всі internal links з city-префіксом

### Admin SEO Panel

- [ ] Auth захист (JWT + role)
- [ ] SEO Audit запускається і повертає результати
- [ ] Metadata override зберігається і має пріоритет
- [ ] Export CSV/PDF працює

### Мультимовність

- [ ] uk сторінки без префікса
- [ ] ru сторінки з `/ru` префіксом
- [ ] Перемикач мови на кожній сторінці
- [ ] Всі тексти через next-intl (нема хардкоду)

-----

*NOVA STELYA · План реалізації v4.0 FINAL · Next.js 16.2+ · Gold Standard 2026*