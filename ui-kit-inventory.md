# Hyvä UI Kit Inventory — PHPure Golf POC

**Kit version:** Hyvä UI 2.7.1 (read-only reference at `hyva-ui-reference/`)
**Count:** 37 component families, 65 variants total.

## Status legend

- `untouched` — kit file unchanged, no POC output yet.
- `spec-pending` — `figma-extractor` is producing a spec.
- `in-progress` — `hyva-component-author` is producing files.
- `lint-fail` — `token-linter` found issues; needs rework.
- `review-pending` — ready for `component-reviewer`.
- `needs-rework` — reviewer flagged issues; back to author.
- `approved (YYYY-MM-DD)` — `component-reviewer` signed off. Ready for handoff.
- `skipped` — out of POC scope, left for the dev team to adopt later.

## Build order — tentative

Phase 1 will prioritize atoms first (Button, then form controls, then icons), then the molecules/organisms the chosen homepage needs. The "Proposed Phase 1 ordering" section at the bottom of this file is filled in once the homepage Figma node is known.

## Inventory

| Component | Hyvä UI kit path | Category | Figma node ID | Status | Notes |
|---|---|---|---|---|---|
| accordion — A-basic | `hyva-ui-reference/components/accordion/A-basic/` | atom/molecule | _tbd_ | untouched | Alpine `x-collapse`. |
| ajax-atc — A-simple | `hyva-ui-reference/components/ajax-atc/A-simple/` | product | _tbd_ | untouched | Add-to-cart behavior. |
| banner — A-default | `hyva-ui-reference/components/banner/A-default/` | marketing | _tbd_ | untouched | |
| banner — B-split | `hyva-ui-reference/components/banner/B-split/` | marketing | _tbd_ | untouched | |
| banner — C-text | `hyva-ui-reference/components/banner/C-text/` | marketing | _tbd_ | untouched | |
| breadcrumbs — A-simple | `hyva-ui-reference/components/breadcrumbs/A-simple/` | chrome | _tbd_ | untouched | |
| buttons — A-basic | `hyva-ui-reference/components/buttons/A-basic/` | atom (CSS) | `1286:12715` | approved (2026-04-24) | Phase 1 complete. Variants: primary / secondary / tertiary / transparent + icon-only + sizes. |
| form-field — A-basic | _POC-original (not in kit)_ | atom (CSS) | `1329:15249` base, `1331:14308` variants | approved (2026-04-24) | Phase 1 complete. Shell utility (`@utility form-field`) + bare input utility (`@utility form-field__input`) + affix / leading-text / trailing-text / select / numeric / feedback modifiers / form-group. Addon compositions (leading/trailing slots, password, phone, stepper, datepicker, textarea) documented in README — no separate CSS. Foundation for input / select / password / phone / stepper / etc. |
| dropdown-list — A-basic | _POC-original (not in kit)_ | molecule (Alpine) | `1343:42718` list, `1343:42177` list item | untouched | Future Phase 1 ticket. Floating menu panel for country selector / phone prefix / custom select replacement. Will use Alpine combobox + `aria-expanded` / `aria-controls`. Not needed for the form-field atom — that uses styled native `<select>` for now. |
| card — A-default | `hyva-ui-reference/components/card/A-default/` | atom/molecule | _tbd_ | untouched | |
| card — B-media | `hyva-ui-reference/components/card/B-media/` | atom/molecule | _tbd_ | untouched | |
| categories — A-grid-images | `hyva-ui-reference/components/categories/A-grid-images/` | catalog | _tbd_ | untouched | |
| categories — B-grid-patterns | `hyva-ui-reference/components/categories/B-grid-patterns/` | catalog | _tbd_ | untouched | |
| category-filter — A-standard | `hyva-ui-reference/components/category-filter/A-standard/` | catalog | _tbd_ | untouched | Layered navigation. |
| category-filter — B-elasticsuite | `hyva-ui-reference/components/category-filter/B-elasticsuite/` | catalog | _tbd_ | skipped | Elasticsuite-specific; out of POC scope. |
| cookie-notice — A-full-width | `hyva-ui-reference/components/cookie-notice/A-full-width/` | chrome | _tbd_ | untouched | |
| cookie-notice — B-overlay | `hyva-ui-reference/components/cookie-notice/B-overlay/` | chrome | _tbd_ | untouched | |
| cookie-notice — C-simple-elegant | `hyva-ui-reference/components/cookie-notice/C-simple-elegant/` | chrome | _tbd_ | untouched | |
| error-page — A-simple | `hyva-ui-reference/components/error-page/A-simple/` | utility page | _tbd_ | untouched | |
| error-page — B-split | `hyva-ui-reference/components/error-page/B-split/` | utility page | _tbd_ | untouched | |
| footer — A-clean | `hyva-ui-reference/components/footer/A-clean/` | chrome | _tbd_ | untouched | |
| footer — B-4-column-newsletter | `hyva-ui-reference/components/footer/B-4-column-newsletter/` | chrome | _tbd_ | untouched | |
| footer — C-mega | `hyva-ui-reference/components/footer/C-mega/` | chrome | _tbd_ | untouched | |
| gallery — A-basic | `hyva-ui-reference/components/gallery/A-basic/` | product | _tbd_ | untouched | Product gallery. |
| gallery — B-fancy | `hyva-ui-reference/components/gallery/B-fancy/` | product | _tbd_ | untouched | |
| gallery — C-grid | `hyva-ui-reference/components/gallery/C-grid/` | product | _tbd_ | untouched | |
| gallery — D-splide | `hyva-ui-reference/components/gallery/D-splide/` | product | _tbd_ | untouched | Splide-based. |
| generic-content — A-text | `hyva-ui-reference/components/generic-content/A-text/` | content | _tbd_ | untouched | |
| generic-content — B-visual | `hyva-ui-reference/components/generic-content/B-visual/` | content | _tbd_ | untouched | |
| header — A-clean | `hyva-ui-reference/components/header/A-clean/` | chrome | _tbd_ | untouched | |
| header — B-compact | `hyva-ui-reference/components/header/B-compact/` | chrome | _tbd_ | untouched | |
| header — C-stacked | `hyva-ui-reference/components/header/C-stacked/` | chrome | _tbd_ | untouched | |
| loaders — A-spinner | `hyva-ui-reference/components/loaders/A-spinner/` | utility | _tbd_ | untouched | |
| loaders — B-ping | `hyva-ui-reference/components/loaders/B-ping/` | utility | _tbd_ | untouched | |
| loaders — C-dancers | `hyva-ui-reference/components/loaders/C-dancers/` | utility | _tbd_ | untouched | |
| menu — A-simple-static-links | `hyva-ui-reference/components/menu/A-simple-static-links/` | navigation | _tbd_ | untouched | |
| menu — B-4-column-megamenu | `hyva-ui-reference/components/menu/B-4-column-megamenu/` | navigation | _tbd_ | untouched | |
| menu — C-vertical-dropdown-4-column | `hyva-ui-reference/components/menu/C-vertical-dropdown-4-column/` | navigation | _tbd_ | untouched | |
| menu — D-shop-drowdown | `hyva-ui-reference/components/menu/D-shop-drowdown/` | navigation | _tbd_ | untouched | |
| menu-mobile — A-scroll | `hyva-ui-reference/components/menu-mobile/A-scroll/` | navigation | _tbd_ | untouched | |
| menu-mobile — B-tabs | `hyva-ui-reference/components/menu-mobile/B-tabs/` | navigation | _tbd_ | untouched | |
| minicart — A-classic | `hyva-ui-reference/components/minicart/A-classic/` | cart | _tbd_ | untouched | |
| minicart — B-popover | `hyva-ui-reference/components/minicart/B-popover/` | cart | _tbd_ | untouched | |
| modal — A-simple | `hyva-ui-reference/components/modal/A-simple/` | utility | _tbd_ | untouched | |
| notification — A-simple | `hyva-ui-reference/components/notification/A-simple/` | utility | _tbd_ | untouched | |
| notification — B-full-width | `hyva-ui-reference/components/notification/B-full-width/` | utility | _tbd_ | untouched | |
| order-confirmation — A-clear | `hyva-ui-reference/components/order-confirmation/A-clear/` | checkout | _tbd_ | untouched | |
| pagination — A-clean | `hyva-ui-reference/components/pagination/A-clean/` | catalog | _tbd_ | untouched | |
| popup — A-newsletter-image | `hyva-ui-reference/components/popup/A-newsletter-image/` | marketing | _tbd_ | untouched | |
| popup — B-newsletter-title | `hyva-ui-reference/components/popup/B-newsletter-title/` | marketing | _tbd_ | untouched | |
| product-card — A-card-with-swatches | `hyva-ui-reference/components/product-card/A-card-with-swatches/` | product | _tbd_ | untouched | |
| product-data — A-specs | `hyva-ui-reference/components/product-data/A-specs/` | product | _tbd_ | untouched | |
| product-data — B-accorditabs | `hyva-ui-reference/components/product-data/B-accorditabs/` | product | _tbd_ | untouched | |
| product-data — C-highlights | `hyva-ui-reference/components/product-data/C-highlights/` | product | _tbd_ | untouched | |
| product-reviews — A-basic | `hyva-ui-reference/components/product-reviews/A-basic/` | product | _tbd_ | untouched | |
| product-reviews — B-minimal | `hyva-ui-reference/components/product-reviews/B-minimal/` | product | _tbd_ | untouched | |
| scroll-to-top — A-simple | `hyva-ui-reference/components/scroll-to-top/A-simple/` | utility | _tbd_ | untouched | |
| scroll-to-top — B-action | `hyva-ui-reference/components/scroll-to-top/B-action/` | utility | _tbd_ | untouched | |
| search-form — A-header | `hyva-ui-reference/components/search-form/A-header/` | navigation | _tbd_ | untouched | |
| shortcuts — A-simple | `hyva-ui-reference/components/shortcuts/A-simple/` | navigation | _tbd_ | untouched | |
| slider — A-basic | `hyva-ui-reference/components/slider/A-basic/` | content | _tbd_ | untouched | |
| slider — B-marquee | `hyva-ui-reference/components/slider/B-marquee/` | content | _tbd_ | untouched | |
| slider — C-product | `hyva-ui-reference/components/slider/C-product/` | product | _tbd_ | untouched | |
| sticky-atc — A-simple | `hyva-ui-reference/components/sticky-atc/A-simple/` | product | _tbd_ | untouched | Add-to-cart sticky bar. |
| swatches — A-swatches-rounded | `hyva-ui-reference/components/swatches/A-swatches-rounded/` | product | _tbd_ | untouched | |
| testimonial — A-simple | `hyva-ui-reference/components/testimonial/A-simple/` | marketing | _tbd_ | untouched | |
| testimonial — B-card | `hyva-ui-reference/components/testimonial/B-card/` | marketing | _tbd_ | untouched | |
| usp — A-icons | `hyva-ui-reference/components/usp/A-icons/` | marketing | _tbd_ | untouched | |
| usp — B-cards | `hyva-ui-reference/components/usp/B-cards/` | marketing | _tbd_ | untouched | |
| usp — C-compact | `hyva-ui-reference/components/usp/C-compact/` | marketing | _tbd_ | untouched | |

---

## Proposed Phase 1 ordering

_Fills in once the homepage Figma node is provided._ Recommended sequence for the POC:

1. **Button** (`buttons/A-basic`, node `1286:12715`) — atom, first target. All other components depend on it.
2. **Typography tokens** — not a component per se; lives in `src/css/theme.css` via `@theme`.
3. **Form atoms** (inputs, selects, checkboxes, radios) — only once the homepage spec confirms which are visible.
4. **Header variant** that matches the homepage — one of A-clean / B-compact / C-stacked.
5. **Footer variant** — one of A-clean / B-4-column-newsletter / C-mega.
6. **Homepage-specific blocks** — banner, usp, product-card, categories, slider, etc. depending on the chosen homepage frame.

Decisions pending: which homepage Figma node targets Phase 2. The designer will provide.
