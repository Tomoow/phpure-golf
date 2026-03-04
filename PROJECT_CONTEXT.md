# PHPure Golf — Project Context

Living document. Check this before building anything new.

---

## Stack

- **Platform:** Magento 2.4.8-p3 Community Edition
- **Frontend theme:** Hyvä Theme 1.4.4 (licensed via Private Packagist)
- **Child theme:** `app/design/frontend/Phpure/golf/`
- **CSS:** Tailwind CSS v4 (JIT, utility-first)
- **JS:** Alpine.js (shipped with Hyvä)
- **Build:** `npm run build` / `npm run watch` from `app/design/frontend/Phpure/golf/web/tailwind/`
- **PHP namespace:** `Phpure\Golf`
- **Repo:** https://github.com/Tomoow/phpure-golf (private, HTTPS)

## Approach

- **Single-store build** — not a reusable library, components are custom for this store.
- **No Hyvä UI license** — all components built from scratch on top of Hyvä Theme.
- **Figma designs are the source of truth** — designers based work on Hyvä UI patterns but everything we build is custom.
- **Bottom-up build order** — atoms first, then molecules, then organisms, then page templates.
- **All sizes in `rem`** — never use `px` in code output (shadows, spacing, font sizes, etc.).

## Brand Color Palettes

Four custom palettes registered in `@theme` block of `tailwind-source.css`:

| Palette | Role | CSS prefix | Example (500) |
|---------|------|------------|---------------|
| Deep Emerald Green | **Primary** (buttons, links, active states) | `deep-emerald-` | `#004d40` |
| Burnished Gold | **Secondary** (accents, badges) | `burnished-gold-` | `#b68d40` |
| Slate Blue | UI neutrals (text, borders, form strokes) | `slate-blue-` | `#5b7c99` |
| Champagne Beige | Warm backgrounds | `champagne-beige-` | `#f1e3c6` |

### Hyvä Semantic Token Mapping (`hyva.config.json`)

- `primary` → Deep Emerald Green (lighter: 200, DEFAULT: 500, darker: 700)
- `secondary` → Burnished Gold (lighter: 200, DEFAULT: 500, darker: 700)
- `on-primary` / `on-secondary` → `#fff`
- Form stroke → `slate-blue-400`

### Page Defaults (`@theme` block)

- `--color-bg` → `champagne-beige-100`
- `--color-fg` → `slate-blue-900`
- `--color-fg-secondary` → `slate-blue-600`
- `--color-surface` → white

### Focus Ring Colors

- Primary: `#e1ebdd`
- Error: `#fecdd3`
- Warning: `#fde68a`
- Success: `#a7f3d0`

## Typography

### Font Families

- **Body text** (`text-xs` through `text-xl`): **DM Sans** (Google Fonts) — placeholder for ITC Avant Garde Gothic Pro (Adobe Fonts)
- **Headings** (`text-2xl` and up): **Playfair Display** (Google Fonts) — placeholder for Dejanire Headline (Adobe Fonts)
- Loaded via Google Fonts `<link>` in head. Will swap to Adobe Fonts when Typekit project ID is available.

### Type Scale

Standard Tailwind defaults — no overrides needed:

| Token | Size | Tailwind class |
|-------|------|----------------|
| xs | 0.75rem | `text-xs` |
| sm | 0.875rem | `text-sm` |
| base | 1rem | `text-base` |
| lg | 1.125rem | `text-lg` |
| xl | 1.25rem | `text-xl` |
| 2xl | 1.5rem | `text-2xl` |
| 3xl | 1.875rem | `text-3xl` |
| 4xl | 2.25rem | `text-4xl` |
| 5xl | 3rem | `text-5xl` |
| 6xl | 3.75rem | `text-6xl` |
| 7xl | 4.5rem | `text-7xl` |
| 8xl | 6rem | `text-8xl` |
| 9xl | 8rem | `text-9xl` |

### Font Weights

`font-light` (300), `font-normal` (400), `font-medium` (500), `font-bold` (700)

## Breakpoints

Standard Tailwind v4 defaults — no overrides:

| Name | Width | Prefix |
|------|-------|--------|
| xs | 376px | (base) |
| sm | 640px | `sm:` |
| md | 768px | `md:` |
| lg | 1024px | `lg:` |
| xl | 1280px | `xl:` |
| 2xl | 1536px | `2xl:` |

## Icons & Micro-Animations

- **Icon library:** [Feather Icons](https://feathericons.com/) — inline SVG, no icon font.
- **Micro-animations:** [useAnimations](https://useanimations.com/) — Lottie-based animations built on Feather icons. Use for interactive states (hover, click, toggle) where appropriate.

## Shadows

Defined in `@theme` block, all values in `rem`:

| Token | Tailwind class |
|-------|----------------|
| `--shadow-sm` | `shadow-sm` |
| `--shadow-base` | `shadow` |
| `--shadow-md` | `shadow-md` |
| `--shadow-lg` | `shadow-lg` |
| `--shadow-xl` | `shadow-xl` |
| `--shadow-2xl` | `shadow-2xl` |
| `--shadow-inner` | `shadow-inner` |

## Screens (Figma)

| # | Page | Figma node |
|---|------|------------|
| 1 | Homepage A (minimal) | `5838:2501` |
| 2 | Homepage B (full) | `5838:2502` |
| 3 | Mega menu (desktop) | `6809:37242` |
| 4 | Mobile navigation | `6809:37241` |
| 5 | Category — clubs | `5846:4579` |
| 6 | Category — apparel | `5846:4579` |
| 7 | PDP — clubs | `5851:13797` |
| 8 | PDP — apparel | `6727:20299` |
| 9 | Brand page | `6237:10113` |
| 10 | About page | `6911:27840` |
| 11 | Contact page | `6931:29686` |
| 12 | Blog listing + detail | `10248:37768` |

Figma file key: `YlKyhwcdYEa41gK1BSs4AZ`

## Component Build Order

### Layer 1 — Atoms (no dependencies)
- [ ] Typography (heading styles, body)
- [ ] Button (primary, secondary, outline, ghost, sizes)
- [ ] Icon system (Feather + useAnimations)
- [ ] Link / text link
- [ ] Input / text field
- [ ] Textarea
- [ ] Select / dropdown
- [ ] Checkbox / radio
- [ ] Badge / tag
- [ ] Color swatch
- [ ] Size selector
- [ ] Divider / separator
- [ ] Rating stars
- [ ] Price display

### Layer 2 — Molecules (depend on atoms)
- [ ] Form group (label + input + validation)
- [ ] Search bar
- [ ] Quantity selector
- [ ] Breadcrumbs
- [ ] Pagination
- [ ] Product card
- [ ] Blog/story card
- [ ] Category card
- [ ] USP bar item
- [ ] Newsletter input row
- [ ] FAQ accordion item
- [ ] Product gallery

### Layer 3 — Organisms (depend on molecules)
- [ ] Header (announcement bar + logo + search + icons + nav + USP strip)
- [ ] Mega menu
- [ ] Mobile navigation
- [ ] Footer
- [ ] Product card grid / carousel
- [ ] Blog card grid
- [ ] Category grid
- [ ] Filter sidebar (layered navigation)
- [ ] Product detail info panel
- [ ] Specs table
- [ ] Related products carousel
- [ ] FAQ section
- [ ] Contact form
- [ ] "Inner circle" CTA section
- [ ] Brand hero
- [ ] "Shop the look" hotspot
- [ ] Reviews section
- [ ] Featured product banner

### Layer 4 — Page templates (depend on organisms)
- [ ] Homepage A
- [ ] Homepage B
- [ ] Category / listing page
- [ ] PDP — clubs
- [ ] PDP — apparel
- [ ] Brand page
- [ ] About page
- [ ] Contact page
- [ ] Blog listing
- [ ] Blog detail

## Build Progress

_Components marked done will be checked off in the build order above._

---

## Key Files

| File | Purpose |
|------|---------|
| `app/design/frontend/Phpure/golf/theme.xml` | Theme declaration (parent: Hyva/default) |
| `app/design/frontend/Phpure/golf/registration.php` | Theme registration |
| `app/design/frontend/Phpure/golf/web/tailwind/tailwind-source.css` | Main CSS entry + `@theme` tokens |
| `app/design/frontend/Phpure/golf/web/tailwind/hyva.config.json` | Hyvä token config (primary/secondary colors, form tokens) |
| `app/design/frontend/Phpure/golf/web/tailwind/package.json` | npm deps and build scripts |
| `auth.json` | Composer credentials (NEVER commit) |
| `PROJECT_CONTEXT.md` | This file |
