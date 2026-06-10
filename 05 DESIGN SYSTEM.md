# NOVA STELYA — DESIGN SYSTEM

## CSS Runtime & Design Engineering Invariant

### Swiss Watch Frontend Philosophy · Next.js 16.2+ · Gold Standard 2026

> **Статус:** ARCHITECTURAL INVARIANT · NON-NEGOTIABLE
> **Ціль:** Maximum performance + premium aesthetics + perfect maintainability

-----

## CORE LAW

```
VISUAL BEAUTY  without  RUNTIME QUALITY  =  FAKE PREMIUM

Nova Stelya MUST be:  Ferrari outside  +  Ferrari inside
```

Кожне дизайн-рішення проходить фільтр:

```
1. Is it premium?          6. Does it feel expensive?
2. Is it accessible?       7. Is there a simpler version?
3. Is it fast?
4. Is it SEO-safe?
5. Is it maintainable?
```

Якщо хоч одне “ні” → рішення невалідне.
Якщо simpler works → **choose simpler**.

-----

## DESIGN PHILOSOPHY

```
Luxury Minimalism  +  Architectural Precision  +  Premium Trust
```

**Інтерфейс ПОВИНЕН відчуватись:**

```
expensive · calm · confident · spacious · precise · timeless
```

**Інтерфейс НЕ ПОВИНЕН відчуватись:**

```
cheap · overdecorated · template-like · aggressive
flashy · gamified · startup-generic · dark-patterned
```

-----

## VISUAL LAWS

### Law 1 — White Space > Decoration

```
Air creates premium feeling. Not effects.
```

Preferred: spacing · rhythm · typography · precision · alignment
Avoid: heavy shadows · cheap gradients · visual noise · overanimations

### Law 2 — Typography > Decoration

```
Typography
↓ Spacing
↓ Layout
↓ Motion
↓ Effects
```

### Law 3 — Premium Color System

```
❌ #ffffff → Pure white = cheap. Use oklch(98% 0.005 85).
❌ #000000 → Pure black = cheap. Use oklch(18% 0.008 85).

Color ratio:
95% neutral architectural tones
5%  accent (guides attention, never dominates)
```

### Law 4 — Mobile-First (не “responsive”)

```
Mobile is primary. Desktop is enhancement.
If mobile feels premium → desktop will be premium.
```

-----

## CSS PHILOSOPHY

### No CSS Frameworks — ABSOLUTE

```
❌ Tailwind
❌ Bootstrap
❌ Bulma · Foundation · Material UI CSS

✅ Native CSS only
```

### Modern CSS Stack

```css
@layer                ← cascade control
oklch()               ← perceptually uniform colors
CSS nesting           ← component scoping
container queries     ← component-based breakpoints
clamp()               ← fluid typography + spacing
logical properties    ← writing-mode safe
:has()                ← parent selector
@starting-style       ← entry animations
view-transition-api   ← page transitions
```

-----

## CSS ARCHITECTURE — @layer

```css
/* src/styles/layers.css — ПЕРШИЙ ФАЙЛ що завантажується */
@layer
  reset,
  base,
  tokens,
  typography,
  layout,
  components,
  utilities,
  overrides;
```

**Значення шарів:**

|Layer       |Призначення                            |
|------------|---------------------------------------|
|`reset`     |Browser defaults neutralization        |
|`base`      |Global HTML element rules              |
|`tokens`    |CSS custom properties (design tokens)  |
|`typography`|Type scale · font rules                |
|`layout`    |Grid · container · section spacing     |
|`components`|UI component styles                    |
|`utilities` |Single-purpose helpers                 |
|`overrides` |Rare context overrides (NOT !important)|

**Абсолютно заборонено:**

```css
.component { color: red !important; }
/* !important = архітектура зламана */
```

-----

## DESIGN TOKENS

### Повна система токенів

```css
/* src/styles/tokens.css */
:root {

  /* ─── COLORS (oklch) ─────────────────────────────── */

  /* Backgrounds */
  --color-bg:           oklch(98%   0.005 85);  /* warm architectural white */
  --color-surface:      oklch(96%   0.008 85);  /* cards, sections */
  --color-surface-2:    oklch(93%   0.010 85);  /* elevated surface */
  --color-overlay:      oklch(18%   0.008 85 / 0.6);

  /* Borders */
  --color-border:       oklch(88%   0.010 85);  /* soft border */
  --color-border-strong: oklch(78%  0.012 85);

  /* Accent — premium bronze */
  --color-accent:       oklch(62%   0.120 55);
  --color-accent-hover: oklch(58%   0.130 55);
  --color-accent-muted: oklch(62%   0.060 55);
  --color-accent-bg:    oklch(96%   0.020 55);  /* tinted background */

  /* Text */
  --text-primary:       oklch(18%   0.008 85);  /* deep graphite */
  --text-secondary:     oklch(35%   0.010 85);
  --text-muted:         oklch(55%   0.008 85);
  --text-disabled:      oklch(72%   0.006 85);
  --text-inverse:       oklch(98%   0.005 85);
  --text-accent:        oklch(55%   0.120 55);

  /* Semantic */
  --color-success:      oklch(65%   0.180 142);
  --color-warning:      oklch(75%   0.180 75);
  --color-error:        oklch(60%   0.200 25);
  --color-info:         oklch(60%   0.150 240);

  /* Dark mode overrides (prefers-color-scheme: dark) */


  /* ─── SPACING (fluid clamp) ──────────────────────── */

  --space-2xs:  clamp(0.25rem,  0.5vw,  0.375rem);  /* 4–6px */
  --space-xs:   clamp(0.5rem,   1vw,    0.75rem);   /* 8–12px */
  --space-sm:   clamp(0.75rem,  1.5vw,  1rem);      /* 12–16px */
  --space-md:   clamp(1rem,     2vw,    1.5rem);    /* 16–24px */
  --space-lg:   clamp(1.5rem,   3vw,    2.5rem);    /* 24–40px */
  --space-xl:   clamp(2.5rem,   5vw,    4rem);      /* 40–64px */
  --space-2xl:  clamp(4rem,     8vw,    7rem);      /* 64–112px */
  --space-3xl:  clamp(6rem,     12vw,   10rem);     /* 96–160px */
  --space-hero: clamp(5rem,     10vw,   9rem);      /* 80–144px */
  --space-section: clamp(4rem,  8vw,    8rem);


  /* ─── TYPOGRAPHY ─────────────────────────────────── */

  /* Size scale */
  --text-xs:   clamp(0.688rem, 1.4vw, 0.813rem);   /* 11–13px */
  --text-sm:   clamp(0.813rem, 1.6vw, 0.938rem);   /* 13–15px */
  --text-base: clamp(1rem,     2vw,   1.063rem);   /* 16–17px */
  --text-md:   clamp(1.063rem, 2.2vw, 1.188rem);   /* 17–19px */
  --text-lg:   clamp(1.188rem, 2.5vw, 1.375rem);   /* 19–22px */
  --text-xl:   clamp(1.375rem, 3vw,   1.75rem);    /* 22–28px */
  --text-2xl:  clamp(1.75rem,  4vw,   2.5rem);     /* 28–40px */
  --text-3xl:  clamp(2.5rem,   5.5vw, 3.75rem);    /* 40–60px */
  --text-4xl:  clamp(3.5rem,   7vw,   5.5rem);     /* 56–88px */
  --text-hero: clamp(4rem,     9vw,   7rem);        /* 64–112px */

  /* Leading */
  --leading-none:    1;
  --leading-tight:   1.1;
  --leading-snug:    1.3;
  --leading-normal:  1.5;
  --leading-relaxed: 1.7;
  --leading-loose:   1.9;

  /* Tracking */
  --tracking-tightest: -0.06em;
  --tracking-tight:    -0.04em;
  --tracking-snug:     -0.02em;
  --tracking-normal:    0;
  --tracking-wide:      0.04em;
  --tracking-wider:     0.08em;
  --tracking-caps:      0.12em;

  /* Font families */
  --font-display: "YourDisplayFont", system-ui, sans-serif;
  --font-body:    "YourBodyFont", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", monospace;

  /* Font weights */
  --weight-light:    300;
  --weight-normal:   400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;
  --weight-black:    900;


  /* ─── BORDER RADIUS ──────────────────────────────── */

  --radius-xs:   2px;
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-2xl:  32px;
  --radius-full: 9999px;


  /* ─── SHADOWS ────────────────────────────────────── */

  --shadow-xs: 0 1px 2px  oklch(18% 0 0 / 0.04);
  --shadow-sm: 0 1px 4px  oklch(18% 0 0 / 0.06);
  --shadow-md: 0 4px 16px oklch(18% 0 0 / 0.08);
  --shadow-lg: 0 12px 40px oklch(18% 0 0 / 0.10);
  --shadow-xl: 0 24px 64px oklch(18% 0 0 / 0.12);

  /* Accent glow */
  --shadow-accent: 0 4px 24px oklch(62% 0.120 55 / 0.25);


  /* ─── TRANSITIONS ────────────────────────────────── */

  --ease-premium:   cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in:        cubic-bezier(0.4, 0, 1, 1);
  --ease-out:       cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out:    cubic-bezier(0.4, 0, 0.2, 1);

  --duration-instant: 100ms;
  --duration-fast:    150ms;
  --duration-normal:  300ms;
  --duration-slow:    500ms;
  --duration-slower:  800ms;


  /* ─── LAYOUT ─────────────────────────────────────── */

  --container-sm:  640px;
  --container-md:  768px;
  --container-lg:  1024px;
  --container-xl:  1280px;
  --container-2xl: 1440px;

  --content-width: min(1280px, 100% - var(--space-lg) * 2);
  --prose-width:   65ch;


  /* ─── Z-INDEX ────────────────────────────────────── */

  --z-below:    -1;
  --z-base:      0;
  --z-raised:   10;
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-overlay:  300;
  --z-modal:    400;
  --z-toast:    500;
  --z-cursor:   999;
}
```

### Semantic Tokens — НЕ color names

```css
/* ❌ ЗАБОРОНЕНО — color names */
--brown: oklch(55% 0.09 55);
--gray-200: oklch(88% 0.010 85);

/* ✅ ПРАВИЛЬНО — semantic meaning */
--color-accent: oklch(62% 0.120 55);
--color-border: oklch(88% 0.010 85);
/* Design може еволюціонувати без переписування CSS */
```

-----

## TYPOGRAPHY ENGINEERING

### Font Rule — Self-hosted ТІЛЬКИ

```
❌ Google Fonts CDN  → зовнішній запит, GDPR, LCP degradation
✅ Self-hosted variable fonts (woff2-variations)
✅ next/font (automatic font optimization)
✅ font-display: swap (або optional для non-critical)
```

### Type Hierarchy

```css
/* src/styles/typography.css */
@layer typography {

  /* Headings — geometric, tight tracking */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: var(--weight-bold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--text-primary);
    text-wrap: balance;
  }

  h1 { font-size: var(--text-3xl); }
  h2 { font-size: var(--text-2xl); }
  h3 { font-size: var(--text-xl); }

  /* Body — high readability */
  body {
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    color: var(--text-primary);
    font-optical-sizing: auto;
    -webkit-font-smoothing: antialiased;
  }

  p {
    max-width: var(--prose-width);
    text-wrap: pretty;
  }
}
```

-----

## SPACING MATHEMATICS

```css
/* ✅ Mathematical rhythm */
.section {
  padding-block: var(--space-section);
}

.card {
  padding: var(--space-md);
  gap: var(--space-sm);
}

/* ❌ Random magic numbers */
.card {
  padding: 23px;       /* звідки 23? */
  margin-top: 37px;    /* чому 37? */
}
```

-----

## LAYOUT LAW

```css
/* Preferred: asymmetrical, spacious, clear flow */
@layer layout {

  .container {
    width: var(--content-width);
    margin-inline: auto;
  }

  /* Mobile-first grid */
  .services-grid {
    display: grid;
    grid-template-columns: 1fr;                           /* mobile */
    gap: var(--space-md);

    @media (width >= 768px) {
      grid-template-columns: repeat(2, 1fr);              /* tablet */
    }

    @media (width >= 1024px) {
      grid-template-columns: repeat(3, 1fr);              /* desktop */
    }
  }

  /* Container queries для компонентів */
  .card-container {
    container-type: inline-size;
  }

  .card {
    /* Адаптується до контейнера, а не viewport */
    @container (width >= 400px) {
      display: grid;
      grid-template-columns: auto 1fr;
    }
  }
}
```

-----

## COMPONENT ENGINEERING LAW

Кожен компонент ПОВИНЕН:

```
✅ працювати без JS (progressive enhancement)
✅ бути семантичним HTML5
✅ підтримувати keyboard navigation
✅ підтримувати screen readers
✅ мати loading states
✅ мати empty states
✅ мати error states
✅ бути mobile-first
```

```css
/* Кожен компонент — CSS Module */
/* app/[locale]/[city]/_components/CityHero/city-hero.module.css */

@layer components {
  .hero {
    padding-block: var(--space-hero);
    background-color: var(--color-bg);
  }

  .hero__title {
    font-size: var(--text-4xl);
    letter-spacing: var(--tracking-tightest);
    color: var(--text-primary);
  }

  .hero__cta {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-lg);
    background-color: var(--color-accent);
    color: var(--text-inverse);
    border-radius: var(--radius-sm);
    font-weight: var(--weight-semibold);
    transition: background-color var(--duration-fast) var(--ease-premium);

    &:hover {
      background-color: var(--color-accent-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 3px;
    }
  }
}
```

-----

## MOTION SYSTEM

### Philosophy

```
subtle · physical · expensive · smooth
```

### Rules

```css
/* ✅ Allowed — cheap to animate */
transition: opacity var(--duration-normal) var(--ease-premium);
transition: transform var(--duration-normal) var(--ease-premium);

/* ❌ Avoid — causes layout shifts */
transition: top, left, width, height, margin, padding;

/* ✅ Entry animations */
@starting-style {
  .card { opacity: 0; transform: translateY(8px); }
}

.card {
  opacity: 1;
  transform: translateY(0);
  transition: opacity var(--duration-normal) var(--ease-premium),
              transform var(--duration-normal) var(--ease-premium);
}

/* ✅ Reduced motion respect */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

-----

## ACCESSIBILITY LAW

```
Minimum: WCAG 2.2 AA — no exceptions
```

```css
/* focus-visible — обов'язково */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: var(--radius-xs);
}

/* Contrast — мінімум 4.5:1 для body text */
/* oklch дозволяє точно контролювати перцептивний контраст */
```

```html
<!-- Semantic HTML — ніяких div там де є семантичний тег -->
<main>
  <article>
    <header>
      <h1>Матові натяжні стелі у Києві</h1>
    </header>
    <section aria-label="Переваги">...</section>
    <section aria-label="Ціни">...</section>
  </article>
  <aside aria-label="Калькулятор вартості">...</aside>
</main>
```

-----

## IMAGE LAW

```
✅ AVIF першочергово · WebP fallback
✅ next/image · responsive sizes · lazy loading
✅ priority: true ТІЛЬКИ above-the-fold (перше зображення)
✅ width + height — обов'язково (prevents CLS)
✅ alt — детальний, містить послугу + місто (для Gemini multimodal)

❌ full-size originals без Cloudinary
❌ priority на all images
❌ alt="" (крім декоративних)
```

```typescript
// ✅ Правильно
<Image
  src={cloudinaryUrl}
  alt="Матова натяжна стеля 35 м² у вітальні ЖК Комфорт Таун Київ — NOVA STELYA"
  width={1200}
  height={800}
  priority={isAboveFold}
  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
/>
```

-----

## SEO-SAFE UI LAW

```
❌ hidden H1 (display:none або visibility:hidden)
❌ lazy critical content (hero, H1, price)
❌ text inside images (Gemini бачить, але Google crawler — ні)
❌ client-rendered-only critical content

✅ Critical content: SSR/SSG ТІЛЬКИ
✅ H1 — завжди видимий, завжди в DOM
✅ Ціна — серверна відповідь, не JS-rendered
```

-----

## DESIGN DECISION ENGINE

```
Before ANY UI decision ask:

Is it premium?        → No → reject
Is it accessible?     → No → fix
Is it fast?           → No → optimize
Is it SEO-safe?       → No → fix
Is it maintainable?   → No → simplify
Is there simpler?     → Yes → choose simpler
Does it feel expensive? → No → redesign
```

-----

## FORBIDDEN PATTERNS

**Візуально:**

```
template marketplace look · cheap drop shadows
heavy gradients everywhere · glassmorphism without purpose
overrounded UI (border-radius: 999px на all things)
dark aggressive UI · casino feeling · crypto startup aesthetic
random spacing · visual noise · card overload
```

**Технічно:**

```
!important · magic numbers · nested div hell
100 utility classes · client-side everything
global CSS that leaks between components
inline styles for anything except dynamic values
CSS-in-JS runtime (emotion, styled-components) → bundle overhead
```

-----

## QUALITY GATES

### Before any component ships:

```
Lighthouse:    98–100
LCP:           < 1.2s
INP:           < 50ms
CLS:           0.00
Critical JS:   < 50kb gzip

Visual QA:
□ premium    □ calm    □ expensive    □ timeless

Engineering QA:
□ predictable    □ maintainable    □ minimal    □ fast
```

-----

## FINAL GOLDEN LAW

```
Beautiful  ≠  Premium
Complex    ≠  Advanced
Animated   ≠  Modern

Minimal  +  Fast  +  Precise  +  Predictable  =  World Class
```

```
Swiss Watch Frontend Engineering:

Every pixel justified.
Every animation justified.
Every component justified.
Every line of CSS justified.
Nothing exists without reason.
```

-----

*NOVA STELYA Design System v2.0 FINAL*
*CSS Runtime & Design Engineering Invariant · Gold Standard 2026*