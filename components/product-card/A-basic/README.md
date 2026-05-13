# Product Card — A-basic

Hyvä UI 2.7.1 MOLECULE that composes five approved atoms plus nine card-local sub-elements to render a PHPure Golf product card on a category-listing page.

## Overview

- **Figma node:** [`2256:7466`](https://figma.com/design/YlKyhwcdYEa41gK1BSs4AZ/?node-id=2256-7466) (`ui_productcard_a_swatches`)
- **Spec:** [`./spec.md`](./spec.md)
- **Kit reference:** `hyva-ui-reference/components/product-card/A-card-with-swatches/`
- **Atom vs molecule:** MOLECULE. Composes existing atoms verbatim — no new atom variants are introduced.

## Variant matrix (8 leaves)

Cartesian product of three binary axes: Device × Style × Promo.

| # | Device  | Style | Promo | Outer size      | Image frame      |
|---|---------|-------|-------|-----------------|------------------|
| 1 | Desktop | Grid  | false | 376 × 658 px    | 336 × 240 (1.4:1) |
| 2 | Desktop | Grid  | true  | 376 × 658 px    | 336 × 240 (1.4:1) |
| 3 | Desktop | List  | false | 960 × 352 px    | 320 × 320 (1:1)   |
| 4 | Desktop | List  | true  | 960 × 352 px    | 320 × 320 (1:1)   |
| 5 | Mobile  | Grid  | false | 158 × 478 px    | 142 × 102 (~1.4:1) |
| 6 | Mobile  | Grid  | true  | 158 × 478 px    | 142 × 102 (~1.4:1) |
| 7 | Mobile  | List  | false | 320 × 228 px    | 109 × 102 (~1.07:1) |
| 8 | Mobile  | List  | true  | 320 × 228 px    | 109 × 102 (~1.07:1) |

Mobile leaves are produced via responsive breakpoint utilities; no separate `--mobile` modifier exists.

## States

- **Default** — `.product-card.product-card--grid` or `.product-card.product-card--list`. No corner badges.
- **`is-new`** — adds an absolutely-positioned `.product-card__badge.product-card__badge--new` ribbon. Mobile List additionally applies `.product-card__badge--sm` (PC-7).
- **`is-promo`** — adds `.product-card__badge.product-card__badge--promo` ribbon AND flips `.product-card__price-row` to `data-promo="true"`. The current price flips to red-600; an old strikethrough price appears alongside. Mobile List downshifts the current price to 20/28 (PC-1).
- **`:hover` on the card** — `box-shadow: var(--shadow-shadow/lg)` with `transition: box-shadow 200ms`. No image zoom (PC-5 / PC-14).
- **Out of stock** — flip the stock-status atom to `status--out-of-stock`. Action row remains the same; the "Notify me" swap is a future composition, not in this molecule (PC-2).

## Usage

### Desktop (Grid)

```html
<form class="product-card product-card--grid" method="post" action="/checkout/cart/add">
  <span class="product-card__badge product-card__badge--new">New</span>

  <a href="/products/flyknit-racer" class="product-card__image-frame" tabindex="-1">
    <img class="product-card__image" alt="" src="/media/.../flyknit.png" />
  </a>

  <div class="product-card__body">
    <span class="product-card__brand">Druids</span>

    <h3 class="product-card__title">
      <a href="/products/flyknit-racer">Flyknit Racer</a>
    </h3>

    <span class="review-summary"
          style="--review-fill: 0.82;"
          role="img"
          aria-label="Rated 4.1 out of 5 stars based on 12 reviews">
      <!-- review-summary inner DOM per the review atom contract -->
    </span>

    <fieldset class="swatch-group" aria-label="Color">
      <label class="swatch swatch--color swatch--s" style="--swatch-bg: #047857;">
        <input class="swatch__input" type="radio" name="color" value="emerald" checked />
        <span class="swatch__chip" aria-hidden="true"></span>
        <span class="sr-only">Emerald</span>
      </label>
      <!-- ...more swatches -->
    </fieldset>

    <div class="product-card__price-row">
      <span class="sr-only">Price</span>
      <span class="product-card__price-current">$95.00</span>
    </div>

    <span class="status status--dot status--in-stock">
      <span class="status__glyph" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="6" fill="currentColor" /></svg>
      </span>
      <span class="status__label">In stock</span>
    </span>

    <div class="product-card__action-row">
      <div>
        <button type="submit" class="btn btn-primary btn-icon-leading btn-size-m" aria-label="Add Flyknit Racer to cart">
          <svg><!-- cart icon --></svg>
          <span class="sr-only md:not-sr-only">Add to cart</span>
        </button>
      </div>
      <div>
        <button type="button" class="btn btn-secondary btn-icon-only-round btn-size-m"
                aria-pressed="false" aria-label="Add Flyknit Racer to wishlist">
          <svg><!-- heart icon --></svg>
        </button>
      </div>
    </div>

    <label class="form-checkbox">
      <input class="form-checkbox__input" type="checkbox" />
      <span class="form-checkbox__box" aria-hidden="true">
        <svg><!-- check tick --></svg>
      </span>
      <span class="form-checkbox__text">
        <span class="form-checkbox__label">Add to comparison</span>
      </span>
    </label>
  </div>
</form>
```

### Mobile (List, promo)

```html
<form class="product-card product-card--list" method="post" action="/checkout/cart/add">
  <span class="product-card__badge product-card__badge--promo product-card__badge--sm"
        aria-label="20 percent off">
    <span aria-hidden="true">-20%</span>
  </span>

  <a href="/products/flyknit-racer" class="product-card__image-frame" tabindex="-1">
    <img class="product-card__image" alt="" src="/media/.../flyknit.png" />
  </a>

  <div class="product-card__body">
    <!-- brand, title, reviews, swatches (XS), price-row[data-promo], status, action-row, compare -->
    <div class="product-card__price-row" data-promo="true">
      <span class="sr-only">Sale price</span>
      <span class="product-card__price-current">$95.00</span>
      <span class="product-card__price-old">
        <span class="sr-only">Original price</span>
        <span aria-hidden="true">$118.00</span>
      </span>
    </div>
    <!-- ... -->
  </div>
</form>
```

## Atomic-design covenant

The card composes existing atoms VERBATIM. No new atom variants are introduced; no modifier classes are added to any atom CSS file.

| Card slot | EXACT class string | Atom file |
|---|---|---|
| Wishlist heart | `btn btn-secondary btn-icon-only-round btn-size-m` | `components/buttons/A-basic/src/web/tailwind/components/button.css` |
| Add-to-cart (Desktop) | `btn btn-primary btn-icon-leading btn-size-m` | same |
| Add-to-cart (Mobile) | `btn btn-primary btn-icon-leading btn-size-m` + `<span class="sr-only md:not-sr-only">Add to cart</span>` | same (PC-8 — no new icon-only-pill variant) |
| Color swatches (Desktop) | `swatch swatch--color swatch--s` grouped by `swatch-group` | `components/swatches/A-swatches-rounded/src/web/tailwind/components/swatches.css` |
| Color swatches (Mobile) | `swatch swatch--color swatch--xs` grouped by `swatch-group` | same |
| Stock status | `status status--dot status--in-stock` or `--out-of-stock` | `components/status/A-basic/src/web/tailwind/components/status.css` |
| Star rating | `review-summary` 5-star track + score + count (NOT a `--mono` modifier, PC-10) | `components/review/A-basic/src/web/tailwind/components/review.css` |
| Add to comparison | `form-checkbox` (size M default) | `components/form-checkbox/A-basic/src/web/tailwind/components/form-checkbox.css` |

### Card-local sub-elements (new, defined in `product-card.css`)

| Utility | Purpose |
|---|---|
| `product-card` | shell — bg, radius, hover shadow, slot tokens |
| `product-card--grid` | layout mode = vertical grid stack |
| `product-card--list` | layout mode = horizontal list row |
| `product-card__body` | flex-column content stack |
| `product-card__image-frame` | fixed-aspect image container |
| `product-card__image` | object-cover inner `<img>` (PC-4: no rotation) |
| `product-card__badge` + `--new` / `--promo` / `--sm` | corner ribbon |
| `product-card__price-row` | flex row holding current + optional old price (consumer adds `data-promo="true"`) |
| `product-card__price-current` | current-price text, color flips to red on promo |
| `product-card__price-old` | strikethrough old price |
| `product-card__description` | 2-line clamp paragraph (Desktop List only) |
| `product-card__brand` | brand label (emerald) |
| `product-card__title` | product-title `<h3>` (one-line truncate ellipsis) |
| `product-card__action-row` | Add-to-cart + Wishlist row |

## Dependencies

### Tokens (every value resolves to `src/css/theme.css`)

- **Colors:** `--color-champagne-beige-100` (card bg), `--color-champagne-beige-500` (new badge bg), `--color-deep-emerald-green-500` (brand + new badge text), `--color-red-600` (promo badge bg + promo current price), `--color-slate-blue-800` (title, default price, old price), `--color-slate-blue-500` (description), `--color-white` (promo badge text).
- **Radii:** `--radius-xl` (card 12 px), `--radius-lg` (badge bottom corners 8 px).
- **Shadows:** `--shadow-shadow/lg` (card `:hover`).
- **Spacing:** `--spacing-2` through `--spacing-8` and the `0.5`/`1.5`/`2.5`/`3.5`/`4.5` half-step tokens.
- **Typography:** `--font-sans` (DM Sans).

### Atoms (CSS imported via `src/css/styles.css`)

- `buttons/A-basic`
- `swatches/A-swatches-rounded`
- `status/A-basic`
- `review/A-basic`
- `form-checkbox/A-basic`

## Decision log

| ID | Decision | Status |
|---|---|---|
| PC-1 | Mobile List promo current-price = 20/28; other promo current-prices = 24/32. | confirmed |
| PC-2 | Stock-status slot rendered between price and action row, all 4 layouts. Out-of-stock keeps the same action row. | confirmed (designer-deferred: "Notify me" composition is a future ticket) |
| PC-3 | Price-old sizes: Desktop Grid = 18/28; Desktop List + Mobile Grid + Mobile List = 16/24. | confirmed |
| PC-4 | Image: plain `object-cover`. Skip Figma's 45° rotation hack. | confirmed |
| PC-5 | Card hover: `Shadow/lg` token + 200 ms transition. No image zoom. | confirmed |
| PC-6 | "Add to comparison" label allowed to wrap naturally on narrow viewports. | confirmed |
| PC-7 | Mobile List "New" badge uses `product-card__badge--sm` (12/16, 32 px tall, py-2 px-1). | confirmed |
| PC-8 | Mobile primary button = same pill atom + `sr-only md:not-sr-only` label. No new atom variant. | confirmed |
| PC-9 | Swatch wrap: `flex-wrap` (atom default). No overflow chip. | confirmed |
| PC-10 | Review atom verbatim (5-star track + score + count). DO NOT add a `--mono` modifier even though Figma uses a 1-star compact summary. | confirmed (designer-deferred — pending live-preview review; if designer pushes back, the call moves to the review atom, not the card) |
| PC-11 | Description: `-webkit-line-clamp: 2`. | confirmed |
| PC-12 | Compare child-block slot wired up in PHTML but rendered conditionally; preview omits the icon (Figma omits it). | confirmed |
| PC-13 | Demo swatch hexes (`#9FB4A9`, `#3A3A3A`, `#52B4A8`) are inline `style="--swatch-bg"` per-card runtime data — the documented inline-style whitelist on the swatch atom. | confirmed |
| PC-14 | Hover shadow: `Shadow/lg` token. | confirmed |
| PC-15 | Weight inconsistencies between Figma "Demi/Bold" and token weights: use the token weights as-is. Do not touch `tokens.resolved.json`. | confirmed (designer-deferred — global DM Sans weight remap may be revisited project-wide) |
| PC-16 | Skip `font-variation-settings: 'opsz' 14` everywhere (same as status / review atoms). | confirmed |
| PC-17 | Heading semantics: `<h3 class="product-card__title">` overrides the Hyvä kit pattern for a11y. | confirmed |
| PC-18 | Touch-target sizes: 40 × 40 icon-only buttons (passes WCAG 2.2 AA; doesn't meet AAA 44 × 44). | confirmed |

## Accessibility

- **Heading semantics (PC-17):** the product title is rendered as `<h3 class="product-card__title">` so AT users can navigate by heading. The kit's default `<a class="product-item-link">` is overridden.
- **Wishlist toggle:** `<button type="button" aria-pressed="false">` with an `aria-label` that includes the product name ("Add Flyknit Racer to wishlist"). When toggled on, `aria-pressed="true"` and the label flips to "Remove Flyknit Racer from wishlist".
- **Strikethrough price:** the `<span class="product-card__price-old">` wraps both an `sr-only` "Original price" label and an `aria-hidden="true"` visible-only span containing the price digits, so AT reads "Original price 118 dollars" then "Sale price 95 dollars" without strikethrough spelling.
- **Promo badge:** `aria-label="20 percent off"` on the wrapping `<span>`, with the visible `-20%` inside an `aria-hidden="true"` child so AT announces "twenty percent off" rather than "minus twenty percent".
- **Form wrapper:** when the product is saleable, the card is wrapped in `<form action="..." method="post">` (Hyvä kit pattern). Add-to-cart is a `<button type="submit">` inside the form. When the product is unsaleable, the wrapper becomes a `<div>` (no add-to-cart submission).
- **Color-only meaning:** the promo state communicates "this is on sale" via three redundant cues — red current-price text, strikethrough old price, and "-20%" badge. ≥2 cues satisfy WCAG 1.4.1.
- **Stock status:** the `status` atom carries the canonical label at slate-blue-800 (15.34:1 vs white); the colored dot is decorative reinforcement.
- **Touch targets (PC-18):** wishlist + cart icon-only buttons are 40 × 40 px — passes WCAG 2.5.8 AA (24 × 24) but not AAA (44 × 44).
- **Image link tabindex:** the image-frame `<a>` carries `tabindex="-1"` because the title link points to the same product page (Hyvä kit pattern); AT users still reach the product via the title heading.
