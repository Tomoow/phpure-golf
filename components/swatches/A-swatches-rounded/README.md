# Swatches — A-swatches-rounded

PHPure Golf brand variant of the Hyvä UI 2.7.1 swatches kit. CSS-only
attribute-picker / facet atom. ONE `@utility swatch` shell on a wrapping
`<label>` drives every visual through CSS custom properties and `:has()`
state selectors.

## Overview

A `<label class="swatch">` is the swatch — colored chip, text pill, or
image thumbnail — wrapping a visually-hidden native `<input type="radio">`
(single-select, e.g. PDP attribute pickers) or `<input type="checkbox">`
(multi-select, e.g. layered-nav facets). Three orthogonal modifier
dimensions: **type** (color / text / image), **shape** (round default /
rectangle), and **size** (XS / S / M / L / XL). State derives from
`:has(:checked)`, `:has(:focus-visible)`, `:has(:disabled)`, plus
`.is-out-of-stock` / `[aria-disabled="true"]` on the wrapper. No Alpine.

## Figma node

- **Spec**: `1385:32405` (Swatch component set, PHPure Golf file
  `YlKyhwcdYEa41gK1BSs4AZ`).
- **Kit reference**: `hyva-ui/components/swatches/A-swatches-rounded/` —
  structural ideas only (token-slot pattern, `:has(:checked)` selectors,
  CSS-gradient diagonal slash). Visual values come from PHPure Golf brand
  tokens, not the kit's defaults.

## Types

| Modifier | Description | Inline style required |
|---|---|---|
| `swatch--color` | Round (or rectangular) chip filled with the product hex | `style="--swatch-bg: #HEX"` |
| `swatch--text` | Pill with text inside (sizes "S", "M", "38", etc.) | None |
| `swatch--image` | Square chip with `<img class="swatch__media">` filling it | None — `<img src>` |

Type modifiers are mutually exclusive.

### Inline-style whitelist

`style="--swatch-bg: <hex>"` on `swatch--color` is the **only** inline-style
use case the linter allows for this utility. It carries the merchant-
configured product attribute hex (e.g. `#14B8A6`), which is product data,
not a brand token. All other inline styles remain forbidden per
`CLAUDE.md` §4.

## States

State is derived from the native input — no per-state utilities. All states
use the same shell rule structure (`@utility swatch { … :has(:state) { … } }`).

| State | Trigger | Visual |
|---|---|---|
| Default | none | Chip + 1-2 px slate-blue-200 / gray-200 border |
| Hover | `:has(:hover)` (excluding selected/disabled) | Outer 2 px ring (emerald round / blue rectangle for color/image; emerald-300 border for text) |
| Focus-visible | `:has(:focus-visible)` | Soft `Focus/Primary` glow on the chip via `box-shadow` |
| Selected | `:has(:checked)` | **Color/image**: full `Additional/Swatch inner` shadow + 2 px outer ring. **Text**: emerald-300 border + emerald-500 label + 600 weight |
| Disabled | `:has(:disabled)` | Reduced opacity + diagonal slash overlay |
| Out-of-stock | `.is-out-of-stock` (or `[aria-disabled="true"]`) | Identical to disabled — semantic difference only |

The shell does NOT add per-option invalid borders. Group-level errors are
communicated via `form-group__hint--error` on the legend's adjacent message
(see Decision log, OQ-SW-10).

## Sizes

| Modifier | Color/image chip | Text pill min | Touch padding |
|---|---|---|---|
| `swatch--xs` | 16x16 px | 40x32 px | 4 px (>=24x24 hit area) |
| `swatch--s` | 20x20 px | 40x32 px | 2 px |
| `swatch--m` (default) | 20x20 px | 56x40 px | 0 |
| `swatch--l` | 28x28 px | 48x44 px | 0 |
| `swatch--xl` | 32x32 px | 64x48 px | 0 |

2XL / 3XL (Figma sizes 6 and 7) are deferred to v2 — that scale is better
expressed as a card pattern rather than an atom (OQ-SW-5).

## Group layout

Wrap a row of swatches sharing one product attribute in a `<fieldset>`:

```html
<fieldset class="swatch-group">
  <legend class="swatch-group__legend">Color</legend>
  <!-- swatches… -->
</fieldset>
```

- `swatch-group` — flex-wrap row, `gap: --spacing(2)` (8 px).
- `swatch-group--tight` — `gap: --spacing(1)` (4 px) for filter facets.
- `swatch-group__legend` — visible attribute name, 14 px / weight 500.

## Accessibility

- **Native semantics**: `<input type="radio">` (single-select) or
  `<input type="checkbox">` (multi-select). Visually hidden via
  `position: absolute; opacity: 0` — never `display: none` (which would
  remove the input from the AT tree).
- **Group association**: `<fieldset>` + `<legend>` is the simplest
  WCAG 1.3.1 / 4.1.2 grouping. The legend reads the attribute name
  ("Color", "Size") to AT.
- **Color name disambiguation (WCAG 1.4.1 *Use of Color*)**: color and
  image swatches MUST carry an accessible text name. Pattern:
  `<span class="sr-only">Teal</span>` inside the label. The shell does
  NOT enforce this — the consumer is responsible. Without an sr-only
  name, color alone is insufficient signifier per WCAG (OQ-SW-8).
- **Text-swatch labelling**: the visible text inside the pill IS the
  accessible name. For abbreviations like "M", consider adding
  `aria-label="Medium"` on the input or label.
- **Keyboard navigation**: native `<input type="radio">` arrow-key
  cycling within the fieldset. Tab order follows the input position.
- **Focus indicator**: soft `Focus/Primary` glow on the chip
  (`box-shadow: var(--shadow-focus/primary)`). The glow alone is 1.23:1
  vs white (fails WCAG 1.4.11 3:1) — same accepted trade-off as
  form-checkbox / form-field (deviation A11Y-007 family). See OQ-SW-4.
- **Touch target (WCAG 2.5.8)**: XS (16x16 chip) bumps to 24x24 hit area
  via `--swatch-touch-pad: --spacing(1)` on the wrapping label. S
  (20x20 chip) reaches 24x24 with `--spacing(0.5)` padding. M / L / XL
  already meet the threshold.
- **Out-of-stock semantic**: add `aria-disabled="true"` AND
  `<span class="sr-only">(out of stock)</span>` inside the label. The
  diagonal slash is the visual cue (OQ-SW-1) — required because color
  + opacity alone fails WCAG 1.4.1.
- **Disabled vs out-of-stock**: identical visuals, different semantics.
  Use `:disabled` on the input for "config-locked" (still tab-reachable
  in some browsers). Use `aria-disabled="true"` for "you can interact
  but it's unavailable" (OQ-SW-3).

## Dependencies

### Tokens (all from `src/css/theme.css`)

| Token | Used for |
|---|---|
| `--color-white` | Text-swatch default bg |
| `--color-gray-200` | Text-swatch default border |
| `--color-slate-blue-100` | Text-swatch disabled bg |
| `--color-slate-blue-200` | Color/image chip border |
| `--color-slate-blue-300` | Disabled text border + label |
| `--color-slate-blue-400` | Diagonal-slash stroke |
| `--color-slate-blue-600` | Text-swatch label (default) |
| `--color-slate-blue-700` | Group legend |
| `--color-slate-blue-800` | Text-swatch label (hover) |
| `--color-deep-emerald-green-200` | Round color/image hover ring |
| `--color-deep-emerald-green-300` | Round color/image selected ring; text-swatch hover/selected/focus border |
| `--color-deep-emerald-green-500` | Text-swatch label (selected) |
| `--color-blue-300` | Rectangle color/image hover ring |
| `--color-blue-500` | Rectangle color/image selected ring |
| `--shadow-additional/swatch-inner` | Selected color/image inner ring stack |
| `--shadow-focus/primary` | Focus glow (all types) |
| `--radius-sm` (3 px) | Color/image rectangle radius |
| `--radius-md` (6 px) | Text rectangle radius |
| `--radius-full` | Round shape |
| `--spacing-*` | Padding + gap |
| `--font-sans` | Text-swatch label |

### Other components

- `form-group__hint--error` (from `form-field/A-basic`) — used in
  invalid-fieldset example.

### Inline style

`style="--swatch-bg: <hex>"` on `swatch--color` only. Documented above.

## Usage

### Color swatch (single-select, round, M)

```html
<label class="swatch swatch--color" style="--swatch-bg: #14B8A6;">
    <input type="radio" name="color" value="teal" class="swatch__input" />
    <span class="sr-only">Teal</span>
    <span class="swatch__chip" aria-hidden="true"></span>
</label>
```

### Text swatch (size pill, M)

```html
<label class="swatch swatch--text">
    <input type="radio" name="size" value="m" class="swatch__input" />
    <span class="swatch__chip">M</span>
</label>
```

### Image swatch (material, M)

```html
<label class="swatch swatch--image">
    <input type="radio" name="material" value="leather" class="swatch__input" />
    <span class="sr-only">Leather</span>
    <span class="swatch__chip" aria-hidden="true">
        <img class="swatch__media" src="/path/leather.jpg" alt="" />
    </span>
</label>
```

### Out-of-stock color swatch

```html
<label class="swatch swatch--color is-out-of-stock"
       style="--swatch-bg: #DC2626;" aria-disabled="true">
    <input type="radio" name="color" value="red" class="swatch__input" disabled />
    <span class="sr-only">Red (out of stock)</span>
    <span class="swatch__chip" aria-hidden="true"></span>
</label>
```

### Rectangle shape (color, blue rings)

```html
<label class="swatch swatch--color swatch--rectangle" style="--swatch-bg: #14B8A6;">
    <input type="radio" name="color" value="teal" class="swatch__input" />
    <span class="sr-only">Teal</span>
    <span class="swatch__chip" aria-hidden="true"></span>
</label>
```

### Multi-select facet (checkboxes, tight gap)

```html
<fieldset class="swatch-group swatch-group--tight">
    <legend class="swatch-group__legend">Filter by color</legend>
    <label class="swatch swatch--color" style="--swatch-bg: #14B8A6;">
        <input type="checkbox" name="color[]" value="teal" class="swatch__input" />
        <span class="sr-only">Teal</span>
        <span class="swatch__chip" aria-hidden="true"></span>
    </label>
    <!-- … more swatches … -->
</fieldset>
```

### Invalid group (group-level error message)

```html
<fieldset class="swatch-group" aria-invalid="true" aria-describedby="size-error">
    <legend class="swatch-group__legend">Size</legend>
    <!-- swatches… -->
    <span id="size-error" class="form-group__hint form-group__hint--error">
        Please choose a size before adding to cart.
    </span>
</fieldset>
```

### Sized ladder (XS through XL)

```html
<label class="swatch swatch--color swatch--xs" style="--swatch-bg: #14B8A6;">…</label>
<label class="swatch swatch--color swatch--s"  style="--swatch-bg: #14B8A6;">…</label>
<label class="swatch swatch--color swatch--m"  style="--swatch-bg: #14B8A6;">…</label>
<label class="swatch swatch--color swatch--l"  style="--swatch-bg: #14B8A6;">…</label>
<label class="swatch swatch--color swatch--xl" style="--swatch-bg: #14B8A6;">…</label>
```

## Decision log

Logged in `design-tokens/questions.md` entries 34-43, dated 2026-05-08.
Defaults applied per task brief.

| OQ | Resolution |
|---|---|
| OQ-SW-1 — out-of-stock visual | CSS `linear-gradient` diagonal slash via `::after` pseudo, slate-blue-400 stroke. Same implementation across all three types. No Heroicons-X overlay. |
| OQ-SW-2 — selected color swatches | Apply the FULL `Additional/Swatch inner` shadow (3 px black-24% + 2 px white inset) plus the outer 2 px ring. No check-glyph overlay. Pale-product-color contrast issue noted as future work. |
| OQ-SW-3 — disabled vs out-of-stock | Identical visuals, different semantics: `:disabled` on the input vs `is-out-of-stock` / `[aria-disabled="true"]` on the wrapper. |
| OQ-SW-4 — focus indicator | Soft `Focus/Primary` glow on the chip ONLY (matches form-checkbox decision). No hard outline. Trade-off A11Y-007 family. |
| OQ-SW-5 — size scope | XS / S / M / L / XL ship. 2XL / 3XL deferred to v2 (better as a card pattern). |
| OQ-SW-6 — selected glyph | None for color/image. Inner+outer ring is the affordance. For text, label-color shifts to emerald-500 + weight 600. |
| OQ-SW-7 — group gap | `--spacing(2)` (8 px) default; `swatch-group--tight` for `--spacing(1)` (4 px). |
| OQ-SW-8 — color-swatch labelling | `<span class="sr-only">` is required per WCAG 1.4.1. Documented in usage examples; not enforced by the shell. |
| OQ-SW-9 — touch target XS / S | Wrapping-label padding via `--swatch-touch-pad`: 4 px on XS, 2 px on S. M / L / XL meet 24x24 without padding. |
| OQ-SW-10 — invalid fieldset | Group-level error via `form-group__hint--error` adjacent to the legend. No per-option invalid border (would conflict with selected ring). The fieldset carries `aria-invalid="true"`. |

## Future work

- **2XL / 3XL sizes** (OQ-SW-5) — defer to a separate `swatch-card`
  molecule pattern (95x60 / 98x80 px chips per Figma).
- **Pale color contrast** (OQ-SW-2) — the inner ring relies on a 2 px
  white inset stamped over a 3 px black-24% inset. On very pale product
  colors (e.g. champagne-300, sky-100) the white inner ring may have
  insufficient contrast against the chip. If a real audit catches it,
  add a contrast-respecting outline that adapts to the color's
  luminance (CSS `color-contrast()` is not yet broadly supported, so
  this would likely require a JS-side computation).
- **Reduced-motion** — wrap chip transitions in
  `@media (prefers-reduced-motion: reduce) { transition-duration: 0; }`
  if any consumer reports an issue. Not implemented in v1.
- **Shape switch on text swatches with rectangle modifier** — verify
  whether merchants want emerald rings AND blue rings as separate
  options, or whether emerald is the universal text-swatch palette.
  Currently emerald applies to text regardless of shape.
