# Reviews summary — A-basic

PHPure Golf brand variant of the Hyvä UI 2.7.1 review-summary atom. Compact,
read-only star-rating row used in product cards, PDP headers, listing tiles,
and anywhere a category-level rating signal is needed.

## Overview

A single-row composition of up to three slots — **Leading** (title + optional
counter pill), **Stars** (5-glyph cluster with fractional fill), and **Trailing**
(score + count). Variants compose by including / omitting child elements; there
are no root-level variant modifier classes.

- **Category:** Atom (CSS-only; no PHTML).
- **Closest kit folder:** none directly. `hyva-ui-reference/components/product-reviews/A-basic/`
  ships the full PDP review LIST. Its inner star-row a11y pattern
  (`role="img"` + `aria-label`) is mirrored here on `.review-summary__stars`.
- **Read-only.** No hover / focus / active / disabled states (RV-1). The atom
  may be wrapped in an `<a>` by the consumer to act as a "Jump to reviews"
  link.

## Figma node

`1385:28923` — "Reviews summary" frame, 24 leaves (3 Leading × 2 Stars × 4
Trailing). Star path saved verbatim in `figma-screenshots/`.

## Variants

Compose by inclusion / omission of children. No `.review-summary--*` modifiers.

| Slot | Element | Notes |
|---|---|---|
| Leading title | `.review-summary__leading-title` | DM Sans 14/20 weight 600, slate-blue-800. Inside `.review-summary__leading`. |
| Leading counter pill | `.review-summary__leading-counter` | 20×20 circle, deep-emerald-500 bg, white DM Sans 12/16 weight 600 label. Renders next to the title with 4 px gap. |
| Stars | `.review-summary__stars` | 5-star cluster, 20×20 slots overlapping by −2 px. Two stacked layers (track + fill); the fill layer is clipped by `--review-fill`. Wrapper carries `role="img"` + `aria-label`. |
| Score | `.review-summary__score` | DM Sans 14/20 weight 700, slate-blue-800. Inside `.review-summary__trailing`. |
| Count | `.review-summary__count` | DM Sans 14/20 weight 500, slate-blue-500. Inside `.review-summary__trailing`. |
| Empty fallback | `.review-summary__empty-fallback` | Optional "(0 reviews)" consumer-supplied span when no reviews exist (RV-6). Same typography as `.review-summary__count`. |

## States

**None.** Read-only display atom. No hover / focus / active / disabled.

## Usage

Minimal — stars only:

```html
<span class="review-summary" style="--review-fill: 0.82">
    <span class="review-summary__stars" role="img" aria-label="4.1 out of 5 stars">
        <span class="review-summary__stars-track" aria-hidden="true">
            <span class="review-summary__star"><svg width="14" height="13.3715"><use href="#rs-star"/></svg></span>
            <!-- × 5 -->
        </span>
        <span class="review-summary__stars-fill" aria-hidden="true">
            <span class="review-summary__star"><svg width="14" height="13.3715"><use href="#rs-star"/></svg></span>
            <!-- × 5 -->
        </span>
    </span>
</span>
```

Full row — title + counter pill + stars + score + count:

```html
<span class="review-summary" style="--review-fill: 0.82">
    <span class="review-summary__leading">
        <p class="review-summary__leading-title">Reviews</p>
        <span class="review-summary__leading-counter" aria-label="9 reviews">
            <span aria-hidden="true">9</span>
        </span>
    </span>
    <span class="review-summary__stars" role="img" aria-label="4.1 out of 5 stars">
        <!-- 5 track stars + 5 fill stars as above -->
    </span>
    <span class="review-summary__trailing">
        <span class="review-summary__score">4.1</span>
        <span class="review-summary__count">(12 reviews)</span>
    </span>
</span>
```

Empty (no reviews yet):

```html
<span class="review-summary">
    <span class="review-summary__empty-fallback">(0 reviews)</span>
</span>
```

### Runtime fill contract (RV-7)

**Row-level**, single numeric, recommended consumer API.

- One CSS custom property on the row: `style="--review-fill: 0.82"`.
- `0` = empty cluster, `1` = fully filled, any continuous value in between.
- The filled layer is clipped from the right by
  `calc((1 - var(--review-fill)) * 100%)` — the leftmost fraction stays visible.
- Both star layers must contain the same 5 SVG glyphs in the same order so the
  overlay aligns pixel-for-pixel with the track.
- Score and count strings are **independent** consumer-supplied text — keep
  them in sync with `--review-fill` at the data layer.

This is the ONE whitelisted inline style for this atom (analogous to
`--swatch-bg` on the color-swatches atom). Token-linter respects the
whitelist when the consumer applies the documented comment marker.

### Star glyph

Inline the Figma 5-point star path (saved in `figma-screenshots/`). NOT
Heroicons — same brand-glyph exception as the status atom's filled dot
(RV-5). Use an SVG `<symbol id="rs-star">` once per page and reference it
via `<use href="#rs-star">` to avoid duplicating the path 10 times per row.

### Accessibility

- `.review-summary__stars` carries `role="img"` and `aria-label="X.X out of 5 stars"`
  (mirrors the kit pattern at `product-reviews/A-basic/.../list.phtml` lines 85–88).
- All individual `.review-summary__star` spans and the two
  `.review-summary__stars-track` / `.review-summary__stars-fill` wrappers are
  `aria-hidden="true"` — the cluster's aria-label is the canonical value.
- The counter pill carries `aria-label="N reviews"` on its wrapper; the inner
  numeric span is `aria-hidden`.
- Textual score and count (slate-blue-800 / slate-blue-500 on white) are the
  canonical values; the colored stars are decorative reinforcement.

## Dependencies

**Tokens** (from `src/css/theme.css`):

- `--font-sans`
- `--color-slate-blue-200` (empty-star track)
- `--color-slate-blue-500` (count text, empty fallback)
- `--color-slate-blue-800` (title, score text)
- `--color-champagne-beige-700` (filled-star value)
- `--color-deep-emerald-green-500` (counter-pill background)
- `--color-white` (counter-pill label)
- `--spacing` / `--spacing(1)` / `--spacing(1.5)` / `--spacing(3)` /
  `--spacing(3.5)` / `--spacing(4)` / `--spacing(5)`
- `--radius-full` (counter-pill circle, RV-4)

**Slot tokens** (declared in `review-summary` shell):

- `--review-fill: 0` (0..1, consumer overrides inline)
- `--review-gap-slots: --spacing(3)` (12 px between Leading / Stars / Trailing)
- `--review-gap-inline: --spacing(1)` (4 px inside Leading and Trailing)

**Other components:** none. Self-contained atom.

**Assets:** the Figma star SVG path (saved in
`components/review/A-basic/figma-screenshots/`).

## Decision log

| ID | Decision | Notes |
|---|---|---|
| RV-1 | Read-only display only — no hover / focus / active. | Confirmed by orchestrator 2026-05-13. |
| RV-2 | Single 20-px star size — no S / M / L axis. | Confirmed. |
| RV-3 | `font-variation-settings: 'opsz' 14` NOT applied. | Local DM Sans build lacks the `opsz` axis. Same as status ST-2. |
| RV-4 | Counter pill uses `--radius-full` (9999 px). | Visually identical to Figma's `10px` on a 20×20 box; resolves to existing token. |
| RV-5 | Inline the Figma custom 5-point star path. | NOT Heroicons — brand-glyph exception, same as status's filled dot. |
| RV-6 | Empty state renders nothing. Optional `(0 reviews)` fallback in slate-blue-500. | The literal Figma "[Empty Reviews summary component]" string is a Figma-authoring guard rail, NOT a runtime element. |
| RV-7 | Row-level `--review-fill: 0..1`. Score / count are independent strings. | One numeric per row; cluster-wide clip-path. |
| RV-8 | **Designer-deferred — pending live-preview review.** Filled star at `champagne-beige-700` on white = WCAG 1.4.11 contrast 1.94:1, below the 3:1 UI-component threshold. Mitigation: textual score / count at slate-blue-800 (15.34:1) is the canonical value; stars are decorative reinforcement carried by `role="img"` + `aria-label`. Designer to eyeball the live preview and decide whether to bump to `.800`. | Same family of WCAG bumps as status ST-7, form-field A11Y-007, swatches contrast. |
