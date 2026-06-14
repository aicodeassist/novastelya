# MASTER.md — NOVA STELYA URL & ROUTING RESTRUCTURE

## PROJECT CONTEXT

Project: NOVA STELYA
Framework: Next.js 16 App Router
Primary locale: Ukrainian
Secondary locale: Russian

Current strategic decision:

NOVA STELYA is now treated as a local Dnipro-focused project.

The website must be simplified for maximum local SEO performance, minimum routing complexity, and clean UX.

Future city expansion must remain possible, but it must not be exposed in the current UI or routing unless explicitly enabled later.

---

# MAIN STRATEGY

## DNIPRO IS THE DEFAULT AND ONLY ACTIVE CITY

At the current stage:

```txt
Active city = dnipro
```

All default non-prefixed URLs belong to Dnipro.

Example:

```txt
/
= Натяжні стелі Дніпро

/matovi-steli
= Матові натяжні стелі у Дніпрі

/ciny
= Ціни на натяжні стелі у Дніпрі
```

Do not create public `/dnipro` routes at this stage.

Forbidden for now:

```txt
/dnipro
/dnipro/matovi-steli
/dnipro/ciny
```

---

# REMOVE CITY LOGIC FROM PUBLIC UI

Remove or disable all current visible city-related UX:

```txt
City switcher in Header
City dropdown
Choose city modal
City selector in Footer
"Our cities" blocks
Regional city cards
City landing links
Mega-menu city lists
Breadcrumb city selector
Any visible city context that implies multi-city operation
```

The website must visually behave as a single-city Dnipro business.

Do not show “we work in all Ukraine” or similar scaling language unless content explicitly supports it.

---

# KEEP FUTURE CITY EXPANSION INTERNALLY POSSIBLE

Important:

Do not delete the entire city data model if it is already useful.

Instead, simplify it.

Keep a minimal internal config:

```ts
export const defaultCity = 'dnipro'

export const cities = {
  dnipro: {
    slug: '',
    enabled: true,
    isDefault: true,
    nameUk: 'Дніпро',
    nameRu: 'Днепр',
  },

  // Future examples — disabled for now:
  kyiv: {
    slug: 'kyiv',
    enabled: false,
    isDefault: false,
    nameUk: 'Київ',
    nameRu: 'Киев',
  },

  odesa: {
    slug: 'odesa',
    enabled: false,
    isDefault: false,
    nameUk: 'Одеса',
    nameRu: 'Одесса',
  }
}
```

Rules:

```txt
Only enabled cities may generate public routes.
At this stage only dnipro is enabled.
Disabled cities must not appear in sitemap.
Disabled cities must not appear in navigation.
Disabled cities must not be internally linked.
Disabled cities must return 404 if accessed directly.
```

---

# ROUTING CONCEPT

## CURRENT STAGE ROUTING

Use simple flat routes for Dnipro.

UA:

```txt
/
 /matovi-steli
 /glyancevi-steli
 /satynovi-steli
 /tkanynni-steli

 /tinovi-steli
 /paryashchi-steli
 /nishevi-steli
 /dvorivnevi-steli

 /svitlovi-liniyi
 /trekove-svitlo
 /konturne-pidsvichuvannya
 /zoryane-nebo

 /kukhnya
 /vanna-kimnata
 /spalnya
 /vitalnya
 /dytyacha
 /ofis

 /ciny
 /portfolio
 /portfolio/[slug]
 /faq
 /blog
 /blog/[slug]
 /blog/category/[category]
 /kontakty
 /pro-kompaniyu
```

RU:

```txt
/ru
/ru/matovi-steli
/ru/glyancevi-steli
/ru/satynovi-steli
/ru/tkanynni-steli

/ru/tinovi-steli
/ru/paryashchi-steli
/ru/nishevi-steli
/ru/dvorivnevi-steli

/ru/svitlovi-liniyi
/ru/trekove-svitlo
/ru/konturne-pidsvichuvannya
/ru/zoryane-nebo

/ru/kukhnya
/ru/vanna-kimnata
/ru/spalnya
/ru/vitalnya
/ru/dytyacha
/ru/ofis

/ru/ciny
/ru/portfolio
/ru/portfolio/[slug]
/ru/faq
/ru/blog
/ru/blog/[slug]
/ru/blog/category/[category]
/ru/kontakty
/ru/pro-kompaniyu
```

Russian pages must use the same Ukrainian-latin slugs.

Only the `/ru` prefix changes the language.

---

# FUTURE CITY EXPANSION CONCEPT

The codebase must remain prepared for this future structure:

```txt
/[city]
/[city]/[service]
/[city]/ciny
/[city]/portfolio
/[city]/faq
/[city]/kontakty
```

But these routes must not be active now unless a city is enabled in config.

When a future city is enabled, it may generate:

```txt
/kyiv
/kyiv/matovi-steli
/kyiv/tinovi-steli
/kyiv/ciny
```

RU future equivalent:

```txt
/ru/kyiv
/ru/kyiv/matovi-steli
/ru/kyiv/tinovi-steli
/ru/kyiv/ciny
```

Dnipro must remain no-prefix forever.

Correct:

```txt
/matovi-steli
/ru/matovi-steli
```

Forbidden:

```txt
/dnipro/matovi-steli
/ru/dnipro/matovi-steli
```

---

# ROUTING CLEANUP REQUIREMENTS

The project must be refactored so there is no unnecessary active multi-city complexity.

Remove or disable:

```txt
Public city selector
City switcher logic in Header
City selection state
City cookie/localStorage logic
Auto-detect city logic
Geolocation city logic
City-specific URL redirects based on user location
City landing page loops for disabled cities
Mega-menu city blocks
Footer city lists
Dynamic city sitemap entries for disabled cities
Static params for disabled city routes
```

Keep only:

```txt
defaultCity config
cities config with enabled flag
helper for building URLs
helper for resolving city from URL
future-ready route generator
```

---

# URL HELPER REQUIREMENTS

Create or refactor centralized URL builder.

Example concept:

```ts
type Locale = 'uk' | 'ru'

type CitySlug = 'dnipro' | 'kyiv' | 'odesa'

type BuildUrlInput = {
  locale?: Locale
  city?: CitySlug
  slug?: string
}
```

Rules:

```txt
If locale = uk, do not add /uk.
If locale = ru, add /ru.
If city = dnipro, do not add city prefix.
If city is disabled, do not generate URL.
If city is enabled and not default, add city prefix.
```

Examples:

```txt
buildUrl({ locale: 'uk', city: 'dnipro', slug: 'matovi-steli' })
→ /matovi-steli

buildUrl({ locale: 'ru', city: 'dnipro', slug: 'matovi-steli' })
→ /ru/matovi-steli

buildUrl({ locale: 'uk', city: 'kyiv', slug: 'matovi-steli' })
→ /kyiv/matovi-steli

buildUrl({ locale: 'ru', city: 'kyiv', slug: 'matovi-steli' })
→ /ru/kyiv/matovi-steli
```

---

# SEO RULES

## Dnipro pages

All no-prefix pages must be optimized for Dnipro.

Metadata examples:

```txt
Title UK:
Натяжні стелі у Дніпрі — NOVA STELYA

Title RU:
Натяжные потолки в Днепре — NOVA STELYA
```

Service page example:

```txt
/matovi-steli
Title UK:
Матові натяжні стелі у Дніпрі — NOVA STELYA

/ru/matovi-steli
Title RU:
Матовые натяжные потолки в Днепре — NOVA STELYA
```

---

# SITEMAP RULES

Sitemap must include only active routes.

Current sitemap must include:

```txt
Dnipro no-prefix UA pages
Dnipro /ru pages
Active blog posts
Active portfolio items
```

Current sitemap must NOT include:

```txt
/dnipro
/dnipro/*
/kyiv
/kyiv/*
/odesa
/odesa/*
Any disabled city routes
```

---

# HEADER REQUIREMENTS

Header must be simplified.

Remove city switcher completely.

```

---

# FOOTER REQUIREMENTS

Remove public city list for now.

Footer may mention local business area naturally:

UK:

```txt
NOVA STELYA — натяжні стелі у Дніпрі та області.
```

RU:

```txt
NOVA STELYA — натяжные потолки в Днепре и области.
```

Do not add links to inactive cities.

---

# CONTENT RULES

Remove or rewrite blocks that imply national multi-city scale.

Remove:

```txt
Оберіть ваше місто
Працюємо по всій Україні
Наші міста
Регіональні представництва
Міста, де ми працюємо
```

Use instead:

UK:

```txt
Працюємо у Дніпрі та передмісті.
```

RU:

```txt
Работаем в Днепре и пригороде.
```

---

# REDIRECTS

Redirect никаких не делай потому что сайт новый трафика ещё нету
Нет
```

---


# ACCEPTANCE CRITERIA

The task is complete only if:

1. Website no longer shows city switcher.
2. Header has no city selector.
3. Footer has no city list.
4. No visible multi-city UX remains.
5. `/dnipro` and `/dnipro/*` are not public routes.
6. `/kyiv` and other disabled cities return 404.
7. Sitemap includes only Dnipro no-prefix routes and `/ru` routes.
8. All no-prefix URLs are optimized for Dnipro.
9. RU pages use `/ru` prefix with the same slugs.
10. URL builder supports future city expansion internally.
11. Disabled cities cannot accidentally generate links.
12. English old URLs redirect to new Ukrainian-latin URLs.
13. Canonical and hreflang are correct.
14. Breadcrumbs do not show Dnipro as separate level.
15. Project remains clean and extendable for future city expansion.


# план
Состав детальной план этой реализации с учётом нашего проекта нашей структуры архитектуры и кода в целом возможно ты знаю наш код будешь использовать какие-то чуть-чуть другие методы или способы на основании данного проекта. Главная цель и священная правила perfect Next architecture Runtime

```

---