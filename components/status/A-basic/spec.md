# Status — A-basic — spec

> Figma-extracted spec for the **Stock status** indicator atom. Single source of visual truth is the Figma node listed below; every color, dimension, and typography value below traces to a Figma MCP call dated 2026-05-13. Where no Figma value exists, the gap is logged in `design-tokens/questions.md` (see §11 Open questions).

---

## 1. Identity

| Field | Value |
|---|---|
| Component name | **status** (atom) |
| Variant | `A-basic` |
| Figma file | PHPure Golf — `YlKyhwcdYEa41gK1BSs4AZ` |
| Figma node (component set) | `1385:32111` ("Stock status" frame) |
| Figma URL | `https://figma.com/design/YlKyhwcdYEa41gK1BSs4AZ/?node-id=1385-32111` |
| Closest Hyvä UI 2.7.1 kit folder | **None** — no `status` / `stockstatus` / `badge` folder in `hyva-ui-reference/components/`. The product-card kit references a `stockstatus` child block via `$block->getChildBlock('stockstatus')` (item.phtml:170) but ships no styles for it. Author should treat this as a new atom. Closest structural analog is `notification/A-simple/` (icon + text pair, same Hyvä CSS atom pattern). |
| Extraction date | 2026-05-13 |
| Designer fonts | Figma references `DM Sans Medium 500 @ 16/24`. No commercial-font remap needed for this atom (already DM Sans in Figma). |

---

## 2. Purpose

A small inline indicator that communicates product **stock availability** next to a price, on a product card, on a PDP, or in a quick-view modal. Read-only; not interactive in the Figma source.

The atom has **5 status values** × **2 visual styles** = **10 leaf variants**, with **no per-variant state** (no hover / focus / active / disabled in the Figma source — this is a display atom, not an interactive control).

---

## 3. Variants

### 3.1 Variant matrix

| Style \ Status | In stock | In stock (#) | # in stock | Out of stock | Stock status |
|---|---|---|---|---|---|
| **Coloured Dot** | `1385:32068` | `1385:32069` | `1385:32070` | `1385:32071` | `1385:32072` |
| **Icon** | `1385:32106` | `1385:32107` | `1385:32108` | `1385:32109` | `1385:32110` |

### 3.2 Status semantics (label text, color, glyph)

| Status key | Default label text | Semantic | Indicator color (Figma var) | Resolved hex |
|---|---|---|---|---|
| `in-stock` | `In stock` | Success — item is available | `Tailwind/emerald/500` | `#10B981` (= `tokens.colors.emerald.500`) |
| `in-stock-count` | `In stock (23)` | Success — available with count in parens | `Tailwind/emerald/500` | `#10B981` |
| `count-in-stock` | `23 in stock` | Success — available with leading count | `Tailwind/emerald/500` | `#10B981` |
| `out-of-stock` | `Out of stock` | Error — item unavailable | `Tailwind/rose/500` | `#F43F5E` (= `tokens.colors.rose.500`) |
| `stock-status` | `Stock status` | Warning / unknown — fallback / pending lookup | `Tailwind/amber/500` | `#F59E0B` (= `tokens.colors.amber.500`) |

The label text content is editable / merge-field driven in production (e.g. count value, currency-formatted units, translation strings). Color and glyph are bound to the status key, not the label.

### 3.3 Style semantics

| Style key | Glyph | Glyph size | Gap (glyph→text) |
|---|---|---|---|
| `coloured-dot` | Solid filled circle (`<svg viewBox="0 0 12 12"><circle r="6" cx="6" cy="6"/></svg>`) | 12 × 12 px | 6 px |
| `icon` | Heroicons solid 20 (`check-circle` / `x-circle` / `exclamation-circle`) | 20 × 20 px | 4 px |

There are **no size variants** (no S/M/L) in the Figma source. Every leaf is identical in height (24 px) regardless of style; only the glyph footprint and the gap differ. **See OQ-ST-1 — confirm whether other sizes are needed.**

---

## 4. States

The Figma source defines **no per-variant state**. The component is a static display indicator.

| State | Defined in Figma? | Notes |
|---|---|---|
| Default | yes | Only state shown |
| Hover | no | Not interactive — no need |
| Focus | no | Not interactive — no need |
| Active | no | Not interactive — no need |
| Disabled | no | Out-of-stock is a SEMANTIC status, not a UI state |
| Error | no | Out-of-stock is the closest analog; uses `rose.500` (see §3.2) |

If, in production, the status becomes a clickable link (e.g. "Out of stock — Notify me"), the link/button styling will come from its own atom (`buttons` / underlined link), not this one. **See OQ-ST-4.**

---

## 5. Dimensions

### 5.1 Outer container

Auto-layout (`display: flex; align-items: center;`). No padding, no border, no background — this is a transparent inline indicator.

| Property | Coloured-Dot | Icon |
|---|---|---|
| Height (intrinsic, driven by text line-height) | 24 px | 24 px |
| Width | hug-content | hug-content |
| `gap` | **6 px** (Figma `gap-[6px]`) | **4 px** (Figma `gap-[4px]`) |
| `padding` | 0 | 0 |
| `border` | 0 | 0 |
| `background` | transparent | transparent |
| `border-radius` | 0 | 0 |

### 5.2 Per-variant outer widths (Figma reported)

| Variant | Coloured-Dot width | Icon width |
|---|---|---|
| In stock | 78 px | 84 px |
| In stock (#) | 114 px | 120 px |
| # in stock | 100 px | 106 px |
| Out of stock | 112 px | 118 px |
| Stock status | 109 px | 115 px |

These are intrinsic-content widths from Figma at the default zoom; in production the container is `width: max-content` and re-flows with the label text and translation.

### 5.3 Glyph dimensions

| Style | Glyph wrapper | Inner glyph |
|---|---|---|
| Coloured-Dot | `12 × 12 px` (`shrink-0 size-[12px]`) — the wrapper IS the dot | n/a — single `<svg>` |
| Icon | `20 × 20 px` (`shrink-0 size-[20px] overflow-clip`) | Heroicons inner path padded `inset-[10%]` per Figma (i.e. 16 × 16 px visible glyph centered in 20 × 20 box, matching Heroicons solid-20 default sizing) |

---

## 6. Tokens

Every value below is the Figma-var name → its resolved value in `design-tokens/tokens.resolved.json`. **No raw hex values appear in the implementation** — author MUST reference the token only.

### 6.1 Colors

| Use site | Figma variable | Token path | Resolved hex |
|---|---|---|---|
| In-stock indicator (dot fill, icon fill) | `Tailwind/emerald/500` | `colors.emerald.500` | `#10B981` |
| Out-of-stock indicator (dot fill, icon fill) | `Tailwind/rose/500` | `colors.rose.500` | `#F43F5E` |
| Stock-status / warning indicator (dot fill, icon fill) | `Tailwind/amber/500` | `colors.amber.500` | `#F59E0B` |
| Label text (all 10 variants) | `Tailwind/Slate Blue/800` | `colors.slateBlue.800` | `#24323D` |

### 6.2 Typography (label text — all 10 variants identical)

| Property | Figma style | Token path | Resolved value |
|---|---|---|---|
| Style name | `text-base/leading-6/font-normal` | `typography.text-base/leading-6/font-normal` | — |
| `font-family` | `DM Sans` (Figma reported the resolved family directly; no commercial-font remap needed for this atom) | `fontFamily.sans` | `["DM Sans", "system-ui", "sans-serif"]` |
| `font-weight` | 500 (Medium) | — | `500` |
| `font-size` | 16 px | — | `16px` |
| `line-height` | 24 px | — | `24px` |
| `letter-spacing` | 0 % | — | `0` |
| `text-transform` | none | — | none |
| `text-align` | inherit (defaults to start) | — | start |
| `white-space` | `nowrap` (Figma sets `whitespace-nowrap` to prevent the label wrapping) | — | `nowrap` |
| `font-variation-settings` | `'opsz' 14` (Figma applies optical sizing 14) | — | `'opsz' 14` — **see OQ-ST-2; not yet a token** |

### 6.3 Spacing

| Use site | Figma value | Token path | Resolved value |
|---|---|---|---|
| Gap glyph→text (Coloured-Dot style) | `6px` | `spacing.1.5` | `0.375rem` (= 6 px) |
| Gap glyph→text (Icon style) | `4px` | `spacing.1` | `0.25rem` (= 4 px) |

### 6.4 Border-radius / border / shadow

None. The component has no borders, no rounded corners on the container, and no shadows. The dot itself is a perfect circle by virtue of being a `<circle>` SVG element (no `border-radius` needed).

---

## 7. Iconography

### 7.1 Coloured-Dot style

The "dot" is a **filled SVG circle**, not an icon from any external library. It's a single `<circle r="6">` inside a `12 × 12` viewBox, filled with the per-status color (§3.2). Implementation can either inline the SVG or use a `<span>` with `border-radius: 9999px` + `background-color` + `width/height: 12px`. **Inline SVG is preferred** so the color binds via `fill="currentColor"` and the wrapper's `color` cascades from the per-status modifier class.

### 7.2 Icon style

Three Heroicons solid-20 icons, one per status semantic:

| Status | Heroicon name (Figma) | Heroicons v2 equivalent | Source SVG hash (Figma localhost) |
|---|---|---|---|
| in-stock / in-stock-count / count-in-stock | `Icon/Solid/check-circle` | `check-circle` (solid) | `e90fd95344602d4ef73e58e9ebb0aa45f0ee2520.svg` |
| out-of-stock | `Icon/Solid/x-circle` | `x-circle` (solid) | `a69b855430d90223e22b0b70cf70c102e6fd98f1.svg` |
| stock-status | `Icon/Solid/exclamation-circle` | `exclamation-circle` (solid) | `45d058a63e28513a8d35733dc08bd1761573281f.svg` |

**Icon-set version is not pinned in `CLAUDE.md`. See `questions.md` #12 (Heroicons v1 vs v2) — this affects the import path but not the names, since all three names are stable across v1 / v2.** For the implementation, the author should match the Heroicons set already used by the existing approved components (button, form-checkbox, swatches — all use Heroicons inline SVG inlined per the existing pattern).

The icon box wrapper is `20 × 20 px` and `overflow-clip` (Figma's `Icon/Solid/*` wrapper); the inner path lives in a `16 × 16` square (Figma `inset-[10%]` = 10 % padding all sides = 2 px on each side of a 20 px box).

### 7.3 Text-only variant

**Does not exist in Figma.** The component is icon-or-dot + text, always. If a text-only variant is required (e.g. for a compact mobile listing), it must be added as a new Figma variant first. **See OQ-ST-3.**

### 7.4 Trailing icon / dismiss / close

No trailing icon, no close button, no dismiss control in any of the 10 variants. The atom is non-dismissible.

---

## 8. Auto-layout rules

```
.status (flex container)
├── direction: row
├── align-items: center
├── justify-content: start (default)
├── flex-wrap: nowrap (Figma `whitespace-nowrap` on the <p>)
├── gap: 6px (Coloured-Dot) | 4px (Icon)
├── padding: 0
├── width: max-content / hug-content
├── height: 24px (driven by line-height of the text)
│
├── .status__glyph (shrink-0)
│   ├── Coloured-Dot: 12 × 12 px filled-circle SVG
│   └── Icon: 20 × 20 px Heroicon solid-20 SVG
│
└── .status__label (shrink-0, whitespace-nowrap)
    ├── DM Sans 500 16/24
    └── color = slateBlue.800
```

### 8.1 Wrap behaviour

Figma sets `whitespace-nowrap` explicitly on the label. The label MUST NOT wrap; if the container width is constrained, the label should overflow / be truncated by the parent layout — not wrap into 2 lines. **See OQ-ST-5 for the truncation policy.**

### 8.2 RTL behaviour

Not specified in Figma. Author should rely on `flex` + `gap` (which is logically-aware) and assume the glyph stays on the inline-start side in both LTR and RTL. **See OQ-ST-6.**

---

## 9. Implied interactions

**None** in Figma. The Stock status atom is a non-interactive display indicator. Specifically:

- Not clickable.
- Not a link.
- Not a button.
- Not dismissible.
- Not toggleable.
- Not animated.

If a downstream consumer (e.g. an Out-of-Stock variant on a PDP) requires a "Notify me when in stock" CTA, that CTA is a separate `<button>` atom rendered alongside this indicator, not inside it. **See OQ-ST-4.**

---

## 10. Accessibility

Not explicitly authored in Figma (the source is a visual design, not an a11y-spec). Author MUST add the following at implementation time:

### 10.1 Semantic markup

- The container should be a `<span>` (inline) or a `<div role="status" aria-live="polite">` if the content can change at runtime (e.g. after an AJAX cart update).
- The glyph (whether dot or icon) is `aria-hidden="true"` because it's a redundant visual cue; the textual label carries the meaning.

### 10.2 Color-contrast

| Pairing | Contrast | WCAG |
|---|---|---|
| `slateBlue.800` (`#24323D`) on white | 15.34 : 1 | AAA (large + small text) — passes |
| `emerald.500` (`#10B981`) on white as a 12 × 12 dot or 20 × 20 icon | 2.49 : 1 | WCAG 2.2 SC 1.4.11 (UI components) requires **≥ 3 : 1** — **FAILS for the dot/icon alone** |
| `rose.500` (`#F43F5E`) on white as a 12 × 12 dot | 4.13 : 1 | passes 1.4.11 |
| `amber.500` (`#F59E0B`) on white as a 12 × 12 dot | 2.18 : 1 | FAILS 1.4.11 |

The 1.4.11 failure on emerald and amber dots is mitigated by the textual label (the label IS the canonical indicator; the dot is decorative reinforcement). **The label color must stay at `slateBlue.800` for this mitigation to hold.** See OQ-ST-7 — confirm whether to also bump the dot/icon color (e.g. `emerald.600 = #059669` is 3.06 : 1, passes; `amber.600 = #D97706` is 3.43 : 1, passes).

### 10.3 Keyboard

N/A — not interactive.

---

## 11. Open questions

All five entries below are logged in `design-tokens/questions.md` (#44–#48), dated 2026-05-13. Author MUST NOT guess defaults for these.

| ID | Topic | Cross-ref |
|---|---|---|
| **OQ-ST-1** | Are there size variants (S / M / L) needed? Figma defines only one size (24 px height). Author needs to know whether to ship a fixed size or add an S (text-sm) and L (text-lg) shell. | `questions.md` #44 |
| **OQ-ST-2** | Figma applies `font-variation-settings: 'opsz' 14` to all labels. DM Sans (the substitute font) ships variable-weight but the available file in `src/fonts/dm-sans/` may not support the `opsz` axis. Confirm whether to render with or without `opsz`. | `questions.md` #45 |
| **OQ-ST-3** | Is a text-only (no glyph) variant needed? Some compact layouts (e.g. mobile mini-cart) omit indicator glyphs entirely. Not in Figma. | `questions.md` #46 |
| **OQ-ST-4** | When out-of-stock, does the consumer want a "Notify me" CTA next to (or replacing) the status indicator? Affects whether this atom needs a "with-action" composition variant. | `questions.md` #47 |
| **OQ-ST-5** | Wrap / truncate policy when the container is narrower than the label. Truncate with ellipsis, hide overflow, allow line-break despite Figma's `whitespace-nowrap`? | `questions.md` #48 |
| **OQ-ST-6** | RTL behavior — glyph stays at inline-start in both LTR and RTL? Confirm. | `questions.md` #48 (combined) |
| **OQ-ST-7** | WCAG 1.4.11 failure on the emerald-500 dot / icon and amber-500 dot. Author wants to bump these to the `.600` shade (`emerald.600 = #059669` ≥ 3 : 1; `amber.600 = #D97706` ≥ 3 : 1) to satisfy SC 1.4.11. Rose-500 already passes. | `questions.md` #49 |

---

## 12. Implementation hints (non-binding)

**For the `hyva-component-author` subagent — these are derived from the Figma + Hyvä kit conventions, not invented.**

### 12.1 File layout (atom — CSS only, no PHTML)

```
components/status/A-basic/
├── spec.md                         ← this file
├── README.md                       ← Hyvä-style usage doc (author writes)
├── preview.html                    ← static gallery of all 10 variants
├── figma-screenshots/              ← reviewer ref images
└── src/
    └── web/
        └── tailwind/
            └── components/
                └── status.css      ← @utility blocks, no @apply
```

### 12.2 Suggested utility-class API (DO NOT IMPLEMENT — author decides)

```html
<!-- Coloured-Dot, in stock -->
<span class="status status--dot status--in-stock">
  <svg class="status__glyph" aria-hidden="true"><circle r="6" cx="6" cy="6" fill="currentColor"/></svg>
  <span class="status__label">In stock</span>
</span>

<!-- Icon, out of stock -->
<span class="status status--icon status--out-of-stock">
  <svg class="status__glyph" aria-hidden="true"><!-- heroicons solid x-circle 20 --></svg>
  <span class="status__label">Out of stock</span>
</span>
```

The `--in-stock` / `--out-of-stock` / `--stock-status` modifier sets the `color` of the container (which the glyph's `currentColor` then inherits). The label always stays `slateBlue.800` via an explicit `.status__label { color: var(--color-slate-blue-800); }` so the modifier doesn't tint the text.

### 12.3 Tailwind v4 tokens to reference

All values below already exist in `design-tokens/tokens.resolved.json` / will exist in `src/css/theme.css` (per `scripts/build-tailwind-config.mjs`). Author MUST use the token, never the raw value.

- `--color-emerald-500` (`#10B981`)
- `--color-rose-500` (`#F43F5E`)
- `--color-amber-500` (`#F59E0B`)
- `--color-slate-blue-800` (`#24323D`)
- `--spacing-1` (`0.25rem` = 4 px)
- `--spacing-1\.5` (`0.375rem` = 6 px) — note Tailwind's `1.5` key
- `--font-sans` (`"DM Sans", system-ui, sans-serif`)
- `text-base` (16 px / 24 px) + `font-medium` (= 500) per Tailwind v4 defaults

---

**End of spec.**
