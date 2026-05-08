# Swatches — A-swatches-rounded — spec

> **Figma node:** `1385:32405` — *Swatch* component set (PHPure Golf, file `YlKyhwcdYEa41gK1BSs4AZ`).
>
> **Probed sub-nodes (M / Size used as the canonical baseline; XS-3XL scale dimensionally only):**
>
> | Variant | Node ID |
> |---|---|
> | Text · Rectangle · M · Default | `1385:32416` |
> | Text · Rectangle · M · Hover | `1385:32473` |
> | Text · Rectangle · M · Focus | `1385:32515` |
> | Text · Rectangle · M · Selected | `1385:32557` |
> | Text · Rectangle · M · Disabled | `1385:32599` |
> | Colour · Rectangle · M · Default | `1385:33098` |
> | Colour · Rectangle · M · Hover | `1385:33186` |
> | Colour · Rectangle · M · Focus | `1385:33268` |
> | Colour · Rectangle · M · Selected | `1385:33332` |
> | Colour · Rectangle · M · Disabled | `1385:33447` |
> | Colour · Round · M · Default | `1385:33140` |
> | Colour · Round · M · Selected | `1385:33334` |
> | Image · Rectangle · M · Default | `1385:33739` |
> | Image · Rectangle · M · Selected | `1385:33747` |
> | Image · Rectangle · M · Disabled | `1385:33741` |
>
> **Kit reference:** `hyva-ui/components/swatches/A-swatches-rounded/src/web/tailwind/components/swatches.css` (read-only). PHPure Golf takes the kit's structural ideas (CSS-only, `--swatch-*` token slots, `:has(:checked)` selectors, type detection by `[style*="background-color"]` / `[style*="background-image"]`) and replaces the styling with brand tokens drawn from `design-tokens/tokens.resolved.json`.

---

## 1. Overview

A native form swatch atom: a wrapping `<label>` that visually represents a product attribute option (size, color, fabric/material) and contains a visually-hidden `<input type="radio">` (single-select, e.g. PDP/PLP attribute pickers) or `<input type="checkbox">` (multi-select, e.g. layered-nav facets). The `<label>` IS the swatch — colored chip, text pill, or image thumbnail — driven by CSS custom properties on a single `@utility swatch` shell. Three orthogonal modifier dimensions: **type** (`--color` / `--text` / `--image`), **shape** (`--rectangle` default / `--round`), and **size** (`--xs` / `--s` / `--m` default / `--l` / `--xl` / `--2xl` / `--3xl`). State is derived from `:has(:checked)`, `:has(:focus-visible)`, `:has(:disabled)`, and `[aria-disabled="true"]` / `.is-out-of-stock` on the wrapper. CSS-only — no Alpine. Mirrors form-checkbox architecture: ONE shell, slot-driven palette, modifier-only overrides.

---

## 2. Decision log (read before authoring)

Open questions are logged numerically in `design-tokens/questions.md` (entries `34–41`, dated `2026-05-08`) and cross-referenced inline below as **OQ-SW-#**.

| # | Decision | Default proposed by spec |
|---|---|---|
| OQ-SW-1 | **Out-of-stock / unavailable visual.** Figma does not show a dedicated *out-of-stock* variant separate from *Disabled*. The Disabled-Colour and Disabled-Image variants overlay an `X-Circle` (a `Heroicons solid x` inside a small white square at 50 % opacity over the swatch). The Disabled-Text variant draws a diagonal strikethrough line (slate-blue-400 stroke at `-45°`) across the pill. The kit's `swatches.css` instead uses a CSS `linear-gradient` diagonal slash for unavailable color/image swatches (see kit lines 119-145). | Treat **Disabled** in Figma as the canonical "out-of-stock" rendering for PHPure Golf. Use the kit's `linear-gradient` diagonal-slash approach for color/image swatches (a single thin slate-blue-400 line corner-to-corner) and a strikethrough line for text swatches. Do NOT use the Heroicons-X overlay icon — it costs an extra DOM node per swatch and the diagonal line is a recognized Hyvä convention. Distinguish "disabled by config" from "out of stock" via two modifier classes (`is-disabled` vs `is-out-of-stock`) that resolve to the same visuals; the difference is semantic for the consumer. Confirm. |
| OQ-SW-2 | **Selected glyph for color swatches.** Figma's `Selected` color/image swatch overlays a `box-shadow: inset 0 0 0 2px white` (the white inner ring) over the color fill, plus a 2 px outer ring in `deep-emerald-green-300` (Round) or `blue-500` (Rectangle). It does NOT render a check glyph on top of the color. The white inner ring is the entire selection signifier. | Adopt Figma exactly: no check glyph on color swatches. The combined inner-white-ring + outer-emerald (or outer-blue) ring is the selected affordance. Document this in the README as a known divergence from common Magento defaults (which stamp a check on the swatch). Confirm. |
| OQ-SW-3 | **Outer-ring colour: rectangle vs round.** Figma's selected/focus/hover rings use **different colours** for Rectangle vs Round shapes: Rectangle Selected uses `blue-500` (`#3B82F6`), Round Selected uses `deep-emerald-green-300` (`#2F9483`). Rectangle Hover uses `blue-300`; Round Hover (not yet probed but visible in screenshot) appears identical green-tinted. Rectangle Focus border = `blue-500` w/ 4px width. | Treat shape as a palette switch: `swatch--round` overrides `--swatch-ring-selected: var(--color-deep-emerald-green-300)` and `--swatch-ring-hover: var(--color-deep-emerald-green-200)`; the default (Rectangle) keeps the blue palette. The brand-recommended pattern for the homepage is Round + emerald — Rectangle + blue is retained for backwards compatibility with merchant overrides but is not the recommended default. Confirm. |
| OQ-SW-4 | **Hover border color (text swatches).** Figma reports `text · M · Hover` border = `deep-emerald-green-300` (`#2F9483`) — a brand color, not blue. This contradicts the kit (`--swatch-stroke: var(--color-blue-300)` on hover). | Adopt Figma: use `--swatch-ring-hover: var(--color-deep-emerald-green-300)` for **text swatches in BOTH Rectangle and Round shapes**. Color/image hover keeps blue (Rectangle) / emerald (Round) per OQ-SW-3. Confirm. |
| OQ-SW-5 | **Focus ring on text swatches.** Figma `text · M · Focus` adds an OUTER drop-shadow `0 0 0 4px #E1EBDD` (= `Focus/Primary` token) on top of the emerald-green-300 border. Color/image focus does **not** show this drop-shadow in Figma — instead the border thickens to 4 px in `blue-500` (Rectangle) or stays as a 2 px emerald ring (Round). | Standardise: **all swatch types** (color/text/image) get `box-shadow: var(--shadow-focus\/primary)` on `:has(:focus-visible)`. The 4 px-thick blue Figma border on focus is rejected — it visually clashes with the 2 px Selected border and creates layout shift. Use the same focus pattern as form-checkbox / form-field. Confirm. |
| OQ-SW-6 | **Selected text swatch typography.** Figma reports the Selected text label uses font-weight 600 (`ITC Avant Garde Gothic Pro Demi`, remapped to DM Sans 600 per `fontFamilyOverrides`) and color `deep-emerald-green-500` (`#004D40`). Default uses weight 500 + `slate-blue-600`. | Adopt Figma. The selected text label gets `font-weight: 600` and `color: var(--color-deep-emerald-green-500)`. Confirm — note this changes the visual weight when toggling between options, but the customer expects this kind of emphasis cue. |
| OQ-SW-7 | **Disabled text swatch fill.** Figma reports Disabled-Text (`1385:32599`) = `bg = slate-blue-100`, `border = slate-blue-300`, `label = slate-blue-400 @ 75 % opacity`, plus a diagonal strikethrough line. The 75 % opacity on top of `slate-blue-400` resolves to roughly slate-blue-300 contrast. | Drop the `opacity: 0.75` and use `color: var(--color-slate-blue-300)` directly so the rendered intensity matches Figma without a multiplicative layer that interferes with stacking contexts. Border = `slate-blue-300`, bg = `slate-blue-100`. Confirm. |
| OQ-SW-8 | **Touch target for color swatches at sizes XS / S / M.** Figma's color swatch sizes (`16`, `15.75` (sic), `20`, `22`, `24`, `30`, `40` px) are smaller than the WCAG 2.5.8 24×24 px target. The kit's CSS bumps swatches with a background-color/image to a fixed `8 × spacing` (= `32 px`) — ignoring Figma sizes. | The wrapping `<label>` provides padding to extend the hit area to ≥24×24 px for sizes XS/S/M; the visible chip stays at the Figma dimension. Document in README that the consumer should render at **size M or larger on mobile** for primary attribute pickers; XS/S are reserved for filter facets where space is constrained and where the parent fieldset row already provides a larger interactive area. Confirm. |

---

## 3. Type-by-type visual spec

Hex values are deliberately not reproduced here — every value resolves to a token name from `design-tokens/tokens.resolved.json` (see `src/css/theme.css`).

### 3.1 Color swatch (`swatch--color`)

| Property | Value / Token | Source / Notes |
|---|---|---|
| Box width × height | `--swatch-size` per size modifier (see §5). Default M = 20×20 px | Figma `1385:33098` |
| Outer (label) shape | Inherits `swatch--rectangle` (rounded-md, 6px) or `swatch--round` (rounded-full) | Figma node names ("Style=Rectangle" / "Style=Round") |
| Inner color fill | `--swatch-color` (consumer-set inline `background-color: <hex>`; the hex IS the product color value, not a brand token — e.g. `#14B8A6`, `#DC2626`. Document in README that real product hex values are written via `style="background-color: …"` and the linter must whitelist swatches for that one inline-style exception, OR the consumer ships per-color CSS classes like `.swatch--color-teal500` that set `--swatch-color`.) | Figma uses Tailwind/teal/500 = `#14B8A6` as the demo product color. |
| Inner border (chip itself) | 1 px solid `colors.slateBlue.200` (= `#BDCBD6`, the `additional.swatchStroke` rgba(0,0,0,0.24) value when overlaid on white reads identically) | Figma `1385:33098` reports `border border-[#bdcbd6]`. |
| Inner border-radius | `borderRadius.sm` (= 3 px = `rounded-sm`) for Rectangle; `borderRadius.full` (= 9999 px) for Round | Figma reports `rounded-[3px]` (Rectangle) / `rounded-[499.5px]` (Round). |
| Selected inner shadow | `boxShadow.Additional/Swatch inner` → `inset 0 0 0 3px rgba(0,0,0,0.24), inset 0 0 0 2px #FFFFFF` | Figma `1385:33332` reports `shadow-[inset_0px_0px_0px_2px_white]` only — see §3.4. The 3 px black-24% layer underneath comes from the named `Additional/Swatch inner` token; both layers MUST be applied together for the selected look the designer intended. |
| Selected outer ring | 2 px solid `colors.blue.500` (Rectangle) / `colors.deepEmeraldGreen.300` (Round) — see OQ-SW-3 | Figma `1385:33332` (Rect) / `1385:33334` (Round). |
| Hover outer ring | 2 px solid `colors.blue.300` (Rectangle) / `colors.deepEmeraldGreen.200` (Round, projected) | Figma `1385:33186`. |
| Focus outer ring | `boxShadow.Focus/Primary` → `0 0 0 4px #E1EBDD` (per OQ-SW-5) | Figma `1385:33268` reports a 4 px solid border instead — rejected per OQ-SW-5. |
| Disabled / out-of-stock visual | Whole label `opacity: 0.5` + a corner-to-corner diagonal slash: `linear-gradient(130deg, transparent calc(50% - 1px), var(--color-slate-blue-400) calc(50% - 1px), var(--color-slate-blue-400) calc(50% + 1px), transparent calc(50% + 1px))` overlay (see kit lines 119-145). | OQ-SW-1. Figma uses an `X-Circle` overlay; rejected. |
| Selected glyph (check overlay) | NONE — see OQ-SW-2. The white inner ring + outer ring is the selection signifier. | Figma confirms no glyph. |

### 3.2 Text swatch (`swatch--text`)

| Property | Value / Token | Source / Notes |
|---|---|---|
| Box dimensions | `--swatch-size-w` × `--swatch-size-h` per size modifier (see §5). Default M = 54×40 px (Rectangle), 53×40 px (Round) | Figma `1385:32416` (Rect) / `1385:32876` (Round). |
| Outer border-radius | `borderRadius.md` (6 px) for Rectangle; `borderRadius.full` for Round | Figma reports `rounded-[6px]` / pill capsule. |
| Padding | Default M = `padding-block: --spacing(2.5)` (= 10 px), `padding-inline: --spacing(5)` (= 20 px). XS = `py-[6px] px-[12px]`. | Figma. Each size modifier overrides. |
| Background (default) | `colors.white` | Figma `1385:32416`. |
| Border (default) | 2 px solid `colors.gray.200` (= `#E5E7EB`) | Figma `1385:32416`. |
| Border (hover) | 2 px solid `colors.deepEmeraldGreen.300` (per OQ-SW-4) | Figma `1385:32473`. |
| Border (selected) | 2 px solid `colors.deepEmeraldGreen.300` | Figma `1385:32557`. |
| Border (focus) | 2 px solid `colors.deepEmeraldGreen.300` + outer `box-shadow: var(--shadow-focus\/primary)` | Figma `1385:32515`. |
| Border (disabled) | 2 px solid `colors.slateBlue.300` | Figma `1385:32599`. |
| Background (disabled) | `colors.slateBlue.100` | Figma `1385:32599`. |
| Label color (default) | `colors.slateBlue.600` | Figma `1385:32416`. |
| Label color (hover) | `colors.slateBlue.800` | Figma `1385:32473`. |
| Label color (selected) | `colors.deepEmeraldGreen.500` | Figma `1385:32557`. |
| Label color (focus) | `colors.slateBlue.800` | Figma `1385:32515` (matches hover — Figma renders focus ON TOP OF hover state). |
| Label color (disabled) | `colors.slateBlue.300` (per OQ-SW-7; Figma uses slate-blue-400 @ 75 % opacity which resolves equivalently) | Figma `1385:32599`. |
| Label typography (default) | `text-sm/leading-5/font-normal` → DM Sans 14 / 20 / weight 500 | Figma `1385:32416`. |
| Label typography (hover/selected/focus/disabled) | `text-sm/leading-5/font-medium` → DM Sans 14 / 20 / weight 600 (OQ-SW-6) | Figma. |
| Disabled overlay | Strikethrough line: 2 px stroke `colors.slateBlue.400`, rotated -45°, full diagonal across the pill | Figma `1385:32599` renders this via an SVG, but the same effect is achievable via CSS `linear-gradient` per kit. |

### 3.3 Image swatch (`swatch--image`)

| Property | Value / Token | Source / Notes |
|---|---|---|
| Box dimensions | Same as `swatch--color` (`--swatch-size` square chip) per size (see §5) | Figma `1385:33739`. |
| Background | The product image (`<img>` child or `background-image: url(…)`) | Figma uses an `<img>` with `object-cover; size-full; rounded-[3px]`. |
| Border (default) | 1 px solid `colors.slateBlue.200` | Figma `1385:33739`. |
| Border-radius (chip) | Same as color swatch (3 px Rect / pill Round) | — |
| Inner shadow / outer ring (selected/hover/focus) | Identical to `swatch--color` — see §3.1 | Figma `1385:33747`. |
| Disabled / out-of-stock | Same diagonal-slash + `opacity: 0.5` as `swatch--color` (OQ-SW-1) | — |

### 3.4 The `Additional/Swatch inner` shadow — what it actually is

Figma's named `Additional/Swatch inner` token is a **two-stop inner shadow stack**:

```
inset 0px 0px 0px 3px rgba(0, 0, 0, 0.24),  /* ← 3 px black-24 % stop */
inset 0px 0px 0px 2px #FFFFFF                /* ← 2 px white stop, drawn ON TOP */
```

Visually this paints:
1. An outer 3 px ring of black-24% (the dark stroke around the white ring),
2. Over which a 2 px solid-white ring is stamped, leaving 1 px of the black-24 % visible at the very edge of the chip.

Result: the selected color swatch appears as **product-color (centre) → 2 px white ring → 1 px subtle dark line → 2 px brand-colored outer ring**. Critical that ALL THREE rings are drawn: dropping the dark inner layer (as the kit does) flattens the look against bright product colors like teal-300 or red-200 where pure white-on-color has poor edge definition.

The author MUST apply the full token, not just the white inner ring: `box-shadow: var(--shadow-additional\/swatch-inner);` on the chip when `:has(:checked)` matches.

---

## 4. State matrix — Size M (XS-3XL scale dimensionally only; palette is identical)

Columns: `box-bg` | `box-border` | `inner-shadow` (Additional/Swatch inner) | `outer-ring` | `glyph / overlay`. Tokens are resolved names from `tokens.resolved.json`.

### 4.1 Color swatch · Rectangle

| State | box-bg (the chip fill) | box-border | inner-shadow | outer-ring (label) | overlay |
|---|---|---|---|---|---|
| Default | `--swatch-color` (consumer hex) | 1 px `slateBlue.200` | none | none | none |
| Hover | `--swatch-color` | 1 px `slateBlue.200` | none | 2 px `blue.300` | none |
| Focus | `--swatch-color` | 1 px `slateBlue.200` | none | `Focus/Primary` (outer drop-shadow) — OQ-SW-5 | none |
| Selected | `--swatch-color` | none (the inner-shadow draws the white edge) | `Additional/Swatch inner` | 2 px `blue.500` | none — OQ-SW-2 |
| Disabled / out-of-stock | `--swatch-color` | 1 px `slateBlue.200` | none | none | diagonal `slateBlue.400` slash; whole label `opacity: 0.5` |

### 4.2 Color swatch · Round

| State | box-bg | box-border | inner-shadow | outer-ring | overlay |
|---|---|---|---|---|---|
| Default | `--swatch-color` | 1 px `slateBlue.200` | none | none | none |
| Hover | `--swatch-color` | 1 px `slateBlue.200` | none | 2 px `deepEmeraldGreen.200` | none |
| Focus | `--swatch-color` | 1 px `slateBlue.200` | none | `Focus/Primary` | none |
| Selected | `--swatch-color` | none | `Additional/Swatch inner` | 2 px `deepEmeraldGreen.300` | none |
| Disabled / out-of-stock | `--swatch-color` | 1 px `slateBlue.200` | none | none | diagonal slash + `opacity: 0.5` |

### 4.3 Text swatch · Rectangle (Round shares this palette; only the radius differs)

| State | box-bg | box-border | label color | label weight | outer-ring / focus | overlay |
|---|---|---|---|---|---|---|
| Default | `white` | 2 px `gray.200` | `slateBlue.600` | 500 | none | — |
| Hover | `white` | 2 px `deepEmeraldGreen.300` | `slateBlue.800` | 600 | none | — |
| Focus | `white` | 2 px `deepEmeraldGreen.300` | `slateBlue.800` | 600 | `Focus/Primary` | — |
| Selected | `white` | 2 px `deepEmeraldGreen.300` | `deepEmeraldGreen.500` | 600 | none | — |
| Disabled / out-of-stock | `slateBlue.100` | 2 px `slateBlue.300` | `slateBlue.300` | 600 | none | strikethrough `slateBlue.400` |

### 4.4 Image swatch (Rectangle and Round share the color-swatch matrix in §4.1 / §4.2)

The product image fills the chip; everything else is identical to the color swatch. The disabled diagonal slash is drawn over the image (slightly darker stroke recommended in implementation, but Figma uses the same `slateBlue.400` value).

---

## 5. Sizes

Figma exposes 7 sizes (XS, S, M, L, XL, 2XL, 3XL). PHPure Golf will ship **XS, S, M (default), L, XL** as utilities; 2XL and 3XL are out of scope for v1 (sizes large enough that they are typically rendered as a separate `swatch-card` molecule, e.g. 95×60 / 98×80 px for 3XL — better handled as a card pattern). Confirm scope with design owner before authoring.

### 5.1 Color / Image swatch — the chip is square; gap is the row gap between adjacent swatches

| Size | `--swatch-size` | Label padding (touch target) | Group `gap` |
|---|---|---|---|
| XS | 16 × 16 px | `--spacing-1` (4 px) all sides → 24×24 hit area | `--spacing-1` (4 px) |
| S | 16 × 16 px (Figma reports 15.75 — round to 16) | `--spacing-1` | `--spacing-1` |
| M (default) | 20 × 20 px | `--spacing-1` → 28×28 hit area | `--spacing-2` (8 px) |
| L | 22 × 22 px | `--spacing-0\.5` (2 px) → ≥24 hit area | `--spacing-2` |
| XL | 24 × 24 px | none (already at WCAG threshold) | `--spacing-2` |

### 5.2 Text swatch — the chip width grows with content; use `--swatch-min-width` and let content size the height

| Size | `--swatch-min-width` × `--swatch-min-height` | `padding-block` × `padding-inline` | Font | Group `gap` |
|---|---|---|---|---|
| XS | 41 × 32 px | `--spacing-1\.5` × `--spacing-3` (6 / 12 px) | `text-xs/leading-4/font-normal` (12/16/500) | `--spacing-1` |
| S | 39 × 32 px | `--spacing-1\.5` × `--spacing-3` | `text-xs` (12/16/500) | `--spacing-1` |
| M (default) | 54 × 40 px | `--spacing-2\.5` × `--spacing-5` (10 / 20 px) | `text-sm/leading-5/font-normal` (14/20/500) | `--spacing-2` |
| L | 48 × 44 px | `--spacing-3` × `--spacing-4` (12 / 16 px) | `text-base/leading-6/font-normal` (16/24/500) | `--spacing-2` |
| XL | 66 × 48 px | `--spacing-3\.5` × `--spacing-6` (14 / 24 px) | `text-base` | `--spacing-2` |

> Spacing values are derived from Figma node dimensions. The author should treat them as an **opening proposal** and confirm pixel-perfect values against the Figma frame at implementation time. The L-size 12 px vertical padding is unusual for a 44 px high pill — verify before shipping. (See OQ-SW-9.)

---

## 6. Group layout

| Property | Token / Value | Notes |
|---|---|---|
| Group container | `<fieldset class="swatch-group">` with `<legend class="swatch-group__legend">` (visible — "Color:" / "Size:") | WCAG 1.3.1 / 4.1.2 — required to associate every swatch with its attribute name. |
| Group direction | `flex-direction: row; flex-wrap: wrap` | — |
| Group gap | `var(--swatch-group-gap)` (defaults to 8 px = `--spacing-2`; modifier `swatch-group--tight` sets it to 4 px for filter-facet contexts) | — |
| Group padding | 0 (the legend handles the row of attribute name above) | — |
| Wrapping | Swatches wrap to a second row at the grid container's intrinsic width. On viewports < 375 px (xs), Color swatches at size M may wrap to ≥3 rows for products with 8+ color options — acceptable, no horizontal scroll. | — |
| Selected count display | Out of scope for the atom. The molecule that consumes swatches (e.g. `product-card-options`, `pdp-attribute-picker`) is responsible for "Color: Teal" hint text below the group. | — |
| Filter-facet variant (multi-select) | `<fieldset class="swatch-group swatch-group--multi">` containing `<input type="checkbox">` instead of `<input type="radio">`. The shell stylesheet does not differ — the `:has(:checked)` selector matches both. The consumer picks the input type. | — |

---

## 7. Accessibility

| Requirement | Implementation |
|---|---|
| Native semantics | `<input type="radio" name="<attr>" value="<id>">` (single-select) OR `<input type="checkbox">` (multi-select facet). The input is visually hidden via `position: absolute; opacity: 0;` (NEVER `display: none` — that removes it from the AT tree). |
| Group association | `<fieldset>` + `<legend>` wraps all swatches for one attribute. Legend reads the attribute name ("Color", "Size"). |
| Color name disambiguation (WCAG 1.4.1 *Use of Color*) | Color and Image swatches MUST carry a text name accessible to AT. Two patterns: (a) `<span class="sr-only">Teal</span>` inside the label (preferred — survives mismatched `aria-label`s), OR (b) `aria-label="Teal"` on the wrapping `<label>`. The visible chip itself has no text. |
| Text-swatch labelling | The visible text inside the pill ("M", "38", "L") IS the accessible name. No additional `aria-label` needed unless the abbreviation is ambiguous (e.g. for sizes "M" alone, attach `aria-label="Medium"` on the input or label). |
| Keyboard navigation | Native `<input type="radio">` arrow-key cycling within the fieldset. Tab order: previous control → first radio in group → next control. The input's hidden visual presentation does NOT affect focus reachability. |
| Focus indicator | `:has(:focus-visible)` on the wrapping `<label>` paints `box-shadow: var(--shadow-focus\/primary)` (4 px pale-emerald glow). NOTE: the soft glow alone is 1.23:1 vs white (fails WCAG 1.4.11 3:1). Same trade-off as form-checkbox / form-field — designer-approved deviation A11Y-007 family. The shell ALSO adds a 2 px outer outline in `colors.deepEmeraldGreen.500` for stronger contrast. Confirm the same compromise applies here (OQ-SW-5). |
| Touch target (WCAG 2.5.8) | The wrapping `<label>` extends padding to provide ≥24×24 px hit area for sizes XS / S / M. See §5 for per-size padding. The visible chip stays at the Figma dimension. |
| Disabled state | `<input type="radio" disabled>` (not `aria-disabled="true"` — the native attribute is preferred when no programmatic interaction is allowed). Disabled inputs ARE still tab-reachable in some browsers — verify the consumer uses `disabled` (excluded from tab order) vs `aria-disabled="true"` (announced as disabled but still focusable) intentionally. |
| Out-of-stock semantic | When a swatch represents an out-of-stock combo (e.g. "Teal/L" sold out), the consumer should add `aria-disabled="true"` AND a visually-hidden hint: `<span class="sr-only">(out of stock)</span>` inside the label. Visual cue beyond opacity (the diagonal slash, OQ-SW-1) is mandatory because color/opacity alone fails WCAG 1.4.1. |
| Reduced motion | `transition-property: color, background-color, border-color, box-shadow` — wrap in `@media (prefers-reduced-motion: reduce) { transition-duration: 0; }` if any consumer reports an issue. Default duration matches `--default-transition-duration` (form-field convention). |

---

## 8. Auto-layout / shell architecture

### 8.1 DOM template (canonical example — color swatch, single-select, M size, Round shape)

```html
<fieldset class="swatch-group">
  <legend class="swatch-group__legend">Color</legend>

  <label class="swatch swatch--color swatch--round" style="--swatch-color: #14B8A6;">
    <input type="radio" name="color" value="teal-500" class="swatch__input" />
    <span class="sr-only">Teal</span>
  </label>

  <label class="swatch swatch--color swatch--round is-out-of-stock" style="--swatch-color: #DC2626;" aria-disabled="true">
    <input type="radio" name="color" value="red-600" class="swatch__input" disabled />
    <span class="sr-only">Red (out of stock)</span>
  </label>
</fieldset>
```

For text swatches the visible text replaces `<span class="sr-only">…</span>`:

```html
<label class="swatch swatch--text swatch--round">
  <input type="radio" name="size" value="m" class="swatch__input" />
  <span class="swatch__label">M</span>
</label>
```

For image swatches the image replaces the inline `--swatch-color`:

```html
<label class="swatch swatch--image swatch--rectangle">
  <input type="radio" name="material" value="leather" class="swatch__input" />
  <img src="…" alt="" class="swatch__media" />
  <span class="sr-only">Leather</span>
</label>
```

### 8.2 CSS architecture (mirrors form-checkbox)

- **ONE** `@utility swatch` shell on the wrapping `<label>` declares the full `--swatch-*` token slot system:
  - `--swatch-color` (consumer-set product hex)
  - `--swatch-bg` (default = white for text, transparent for color/image)
  - `--swatch-border` (default = `gray.200` for text, `slateBlue.200` for color/image)
  - `--swatch-border-width` (default = 2 px for text, 1 px for color/image)
  - `--swatch-radius` (default = `radius.md` for Rectangle text; modifiers override)
  - `--swatch-label-color` (default = `slateBlue.600`)
  - `--swatch-label-weight` (default = 500)
  - `--swatch-ring-hover`, `--swatch-ring-selected`, `--swatch-ring-focus`
  - `--swatch-inner-shadow` (set to `Additional/Swatch inner` only when selected)
  - `--swatch-size`, `--swatch-min-width`, `--swatch-min-height`, `--swatch-padding-block`, `--swatch-padding-inline`
  - `--swatch-group-gap`
- **Type modifiers** (`swatch--color` / `swatch--text` / `swatch--image`) override the relevant slot bundle. They are mutually exclusive — the consumer applies exactly one.
- **Shape modifiers** (`swatch--rectangle` default, `swatch--round`) override `--swatch-radius` and the ring palette (per OQ-SW-3).
- **Size modifiers** (`swatch--xs` / `--s` / `--m` default / `--l` / `--xl`) override only the dimensional + typography slots (per §5).
- **State selectors** read off the input child:
  - `:has(:hover):not(:has(:checked, :disabled))` → hover palette
  - `:has(:focus-visible)` → focus ring
  - `:has(:checked)` → selected palette + inner shadow
  - `:has(:disabled), &.is-out-of-stock, &[aria-disabled="true"]` → disabled / OOS palette + diagonal slash
- **NO per-state utility classes.** No `swatch--selected`, no `swatch--disabled`. Every state derives from the input or from a semantic modifier (`is-out-of-stock`).
- **NO Alpine.** All state lives in the native `<input>`.
- **CSP:** zero inline event handlers; the only inline style permitted is `style="--swatch-color: <hex>"` for color swatches. The token-linter must whitelist `--swatch-color` as the one allowed inline-style use case (other inline styles remain forbidden). The image-swatch background uses `<img>` with `src=""`, NOT inline `background-image`.

### 8.3 Visible-input pattern

The native `<input>` is anchored absolutely on top of the visible chip:

```css
.swatch__input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    appearance: none;
    -webkit-appearance: none;
    opacity: 0;
    cursor: inherit;
}
```

The `<label>` IS the chip — clicking anywhere on the chip activates the input (because the input is its `<label>`'s descendant), so no `for=`/`id=` plumbing is needed. The `<input>` retains keyboard focusability and screen-reader visibility because it's `opacity: 0` not `display: none`.

---

## 9. Implied interactions

- **Single click / Tap:** Toggles the input. Radios become exclusively selected within their group; checkboxes toggle independently. Visual state updates via CSS only.
- **Keyboard arrow keys (radios):** Native browser behaviour cycles through the visible radios within the same `name=`. Disabled radios are skipped per browser default.
- **Keyboard space (checkboxes):** Toggles the focused checkbox.
- **Hover:** Visual ring tint only — does NOT toggle.
- **Out-of-stock click:** Disabled inputs receive no `change` event. The molecule consuming swatches may attach JS listeners (Alpine/Hyvä) at the fieldset level to intercept clicks on `[aria-disabled="true"]` swatches and surface a "this combination is out of stock" toast — that interaction is OUT OF SCOPE for the atom.
- **Required-attribute UX (PDP):** If a swatch is required and not selected, the surrounding fieldset can carry `aria-invalid="true"` (set by the consumer via Alpine on submit attempt). The shell SHOULD react to `&[aria-invalid="true"]` by tinting the legend rose-700 and adding a focus ring tinted to `Focus/Error`. Implement this in the shell so consumers don't reinvent it. Confirm via OQ-SW-10.

---

## 10. Open questions

Logged in `design-tokens/questions.md` as numbered entries dated `2026-05-08`:

| OQ-SW-# | Topic | questions.md # |
|---|---|---|
| OQ-SW-1 | Out-of-stock visual: diagonal slash vs Heroicons-X overlay | 34 |
| OQ-SW-2 | Selected color swatches: no check glyph; rely on inner ring alone | 35 |
| OQ-SW-3 | Outer-ring palette differs by shape (Rectangle = blue, Round = emerald) | 36 |
| OQ-SW-4 | Text-swatch hover border = `deepEmeraldGreen.300`, not blue | 37 |
| OQ-SW-5 | Focus ring standardisation: drop-shadow on all types, not Figma's 4 px solid border | 38 |
| OQ-SW-6 | Selected text swatch label uses font-weight 600 + emerald-500 | 39 |
| OQ-SW-7 | Disabled text swatch label color: drop opacity, use slate-blue-300 directly | 40 |
| OQ-SW-8 | Touch-target padding: scope of XS / S sizes (recommended ≥M on mobile primary pickers) | 41 |
| OQ-SW-9 | Pixel-perfect text-swatch padding values (esp. L = 12 / 16 px feels low) | 42 |
| OQ-SW-10 | `[aria-invalid]` shell support for unanswered required swatches | 43 |

---

## 11. Tokens referenced (for theme.css completeness check)

Every value below already exists in `design-tokens/tokens.resolved.json` — no new tokens are introduced by this spec.

| Token name | Used for |
|---|---|
| `colors.white` | Text swatch bg, focus inner ring stop |
| `colors.gray.200` | Text swatch default border |
| `colors.slateBlue.100` | Text swatch disabled bg |
| `colors.slateBlue.200` | Color/image swatch chip border |
| `colors.slateBlue.300` | Disabled text border + label color (per OQ-SW-7) |
| `colors.slateBlue.400` | Diagonal-slash stroke |
| `colors.slateBlue.600` | Text swatch label (default) |
| `colors.slateBlue.800` | Text swatch label (hover/focus) |
| `colors.deepEmeraldGreen.200` | Round color/image swatch hover ring |
| `colors.deepEmeraldGreen.300` | Round selected/hover ring; text swatch hover/selected/focus border |
| `colors.deepEmeraldGreen.500` | Selected text label color; hard-outline focus fallback |
| `colors.blue.300` | Rectangle color/image swatch hover ring |
| `colors.blue.500` | Rectangle color/image swatch selected outer ring |
| `colors.blue.200` | Rectangle color swatch focus border (rejected per OQ-SW-5; listed for traceability) |
| `boxShadow.Additional/Swatch inner` | Selected color/image inner ring stack (full 2-stop value) |
| `boxShadow.Focus/Primary` | Focus outer drop-shadow (all swatch types) |
| `boxShadow.Focus/Error` | Invalid-fieldset focus ring (OQ-SW-10, conditional) |
| `borderRadius.sm` (3 px) | Color/image chip Rectangle radius |
| `borderRadius.md` (6 px) | Text swatch Rectangle radius |
| `borderRadius.full` | Round shape radius |
| `typography.text-xs/leading-4/font-normal` | Text swatch label XS / S |
| `typography.text-sm/leading-5/font-normal` | Text swatch label M (default) |
| `typography.text-sm/leading-5/font-medium` | Text swatch label hover/selected/focus/disabled |
| `typography.text-base/leading-6/font-normal` | Text swatch label L / XL |
| `spacing.1` / `1.5` / `2` / `2.5` / `3` / `3.5` / `4` / `5` / `6` | Padding + gap scale |
| `colors.rose.500` / `rose.700` | OQ-SW-10 invalid-fieldset signalling (conditional) |

**Total tokens referenced: 27** (excluding the conditional rose tokens for OQ-SW-10).

**Real product hex values** (e.g. `#14B8A6`, `#DC2626`) are NOT brand tokens — they are merchant-configured product attribute values written to the swatch via `style="--swatch-color: …"`. The token-linter MUST whitelist this single inline-style use case for the `swatch` utility; all other inline styles remain forbidden per `CLAUDE.md` §4.

---

## 12. Author handoff checklist

Before implementing:

1. Read this spec end-to-end.
2. Review `design-tokens/questions.md` entries 34-43 — at least OQ-SW-1, OQ-SW-2, OQ-SW-3, OQ-SW-5 should have answers before coding starts (palette decisions). The rest (OQ-SW-4, 6, 7, 8, 9, 10) can be defaulted to the proposed value if the design lead doesn't respond within 24 h.
3. Read the kit reference at `hyva-ui/components/swatches/A-swatches-rounded/src/web/tailwind/components/swatches.css` for structural ideas. Do NOT copy hex values from the kit — they are Hyvä defaults, not PHPure Golf brand.
4. Read `components/form-checkbox/A-basic/src/web/tailwind/components/form-checkbox.css` for the `--<token>-*` token-slot pattern, the `:has(:checked)` cascade, and the focus-ring placement (on the box, NOT the wrapping label — same call here).
5. Confirm token-linter whitelist for `style="--swatch-color: …"` is in place before writing the preview.html.
