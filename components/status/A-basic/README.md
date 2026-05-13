# Status — A-basic

PHPure Golf brand variant of the Hyvä UI 2.7.1 stock-status atom. A small inline indicator (glyph + label) that communicates product stock availability next to a price, on a product card, on a PDP, or in a quick-view modal. Non-interactive — display only.

## Overview

- **Component name:** `status` (atom — CSS only, no PHTML)
- **Variant:** `A-basic`
- **Spec:** [`components/status/A-basic/spec.md`](./spec.md)
- **Preview:** [`components/status/A-basic/preview.html`](./preview.html)
- **CSS:** [`src/web/tailwind/components/status.css`](./src/web/tailwind/components/status.css)

## Figma node

- **File key:** `YlKyhwcdYEa41gK1BSs4AZ` (PHPure Golf)
- **Node ID (component set):** `1385:32111` — "Stock status" frame
- **Figma URL:** <https://figma.com/design/YlKyhwcdYEa41gK1BSs4AZ/?node-id=1385-32111>
- **Extraction date:** 2026-05-13

## Variants

Two styles × five status keys = **10 leaves**. Apply exactly one style modifier (`status--dot` or `status--icon`) AND exactly one status modifier (`status--in-stock`, `status--out-of-stock`, or `status--stock-status`).

The five status keys collapse to three colour buckets, because `in-stock` / `in-stock-count` / `count-in-stock` share the same colour and glyph — only the label text differs.

### Style + status matrix

| Style modifier  | Glyph                                | Gap   | Use with status modifier                              |
| --------------- | ------------------------------------ | ----- | ----------------------------------------------------- |
| `status--dot`   | 12×12 filled `<circle>` SVG          | 6 px  | Any of the three status modifiers                     |
| `status--icon`  | 20×20 Heroicons solid SVG            | 4 px  | Any of the three status modifiers                     |

### Status modifiers → CSS output

| Status modifier         | `--status-color`        | Used for status keys                                | Heroicons solid 20 glyph (icon style) |
| ----------------------- | ----------------------- | --------------------------------------------------- | ------------------------------------- |
| `status--in-stock`      | `--color-emerald-500`   | `in-stock`, `in-stock-count`, `count-in-stock`      | `check-circle`                        |
| `status--out-of-stock`  | `--color-rose-500`      | `out-of-stock`                                      | `x-circle`                            |
| `status--stock-status`  | `--color-amber-500`     | `stock-status` (warning / fallback / pending lookup)| `exclamation-circle`                  |

The `.status__label` colour is fixed to `--color-slate-blue-800` for all 10 leaves — the per-status colour modifier does NOT tint the text.

### Slot tokens (the `@utility status` shell exposes)

| Slot token             | Default                          | Overridden by                            | Purpose                                            |
| ---------------------- | -------------------------------- | ---------------------------------------- | -------------------------------------------------- |
| `--status-color`       | `var(--color-slate-blue-800)`    | `status--in-stock` / `--out-of-stock` / `--stock-status` | Glyph fill (`currentColor` cascade into the SVG)   |
| `--status-gap`         | `var(--spacing-1\.5)` (6 px)     | `status--dot` (6 px) / `status--icon` (4 px) | Flex gap between glyph wrapper and label           |
| `--status-label-color` | `var(--color-slate-blue-800)`    | (consumer override only)                 | Text colour of `.status__label`                    |

## States

The Figma source defines **no per-variant state** — this is a static display indicator. No hover, focus, active, disabled, or error states.

If a consumer needs an interactive composition (e.g. "Out of stock — Notify me" CTA), the CTA is a separate `buttons` atom rendered alongside this indicator, not a state of this atom.

## Usage

### Coloured-Dot (in-stock)

```html
<span class="status status--dot status--in-stock">
    <span class="status__glyph" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="6" fill="currentColor" />
        </svg>
    </span>
    <span class="status__label">In stock</span>
</span>
```

### Icon (out-of-stock)

```html
<span class="status status--icon status--out-of-stock">
    <span class="status__glyph" aria-hidden="true">
        <!-- Heroicons solid 20 — x-circle -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clip-rule="evenodd" />
        </svg>
    </span>
    <span class="status__label">Out of stock</span>
</span>
```

### Icon (stock-status / warning)

```html
<span class="status status--icon status--stock-status">
    <span class="status__glyph" aria-hidden="true">
        <!-- Heroicons solid 20 — exclamation-circle -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1-9a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Z" clip-rule="evenodd" />
        </svg>
    </span>
    <span class="status__label">Stock status</span>
</span>
```

### Notes

- The glyph SVG declares its own `width` / `height` attributes — the atom does NOT set glyph dimensions in CSS. 12×12 for dot, 20×20 for icon.
- `fill="currentColor"` on the SVG paths is **required** so the per-status `--status-color` cascade reaches the glyph fill via the shell's `color` property.
- Label text content is consumer-driven (translation strings, count values, "23 in stock", etc.). The atom does not own the label text.
- Whitespace handling: the label is `white-space: nowrap`. If the consumer parent is narrower than the indicator, the consumer is responsible for truncation / overflow (see preview section 3).

## Accessibility

- The glyph (dot or icon) is `aria-hidden="true"` because it is a decorative reinforcement of the textual label. The label IS the canonical indicator (WCAG 1.4.1 — color is not the sole means of conveying the status).
- The default container is a `<span>` (inline, no implicit ARIA role). If the indicator value changes at runtime — e.g. the stock count refreshes after an AJAX cart update or a real-time inventory push — the consumer SHOULD upgrade the wrapper to `<div role="status" aria-live="polite">` (or, when a status change is urgent, `aria-live="assertive"`) so screen readers announce the new value.
- Keyboard: N/A — non-interactive atom.
- Colour contrast vs white background:
  - **Label** (`slate-blue-800` `#24323D` on white) — **15.34 : 1**, passes WCAG 2.2 AA + AAA for text.
  - **rose-500 glyph** (`#F43F5E` on white) — **4.13 : 1**, passes SC 1.4.11 (≥3:1).
  - **emerald-500 glyph** (`#10B981` on white) — **2.49 : 1**, **fails** SC 1.4.11 for the dot/icon alone.
  - **amber-500 glyph** (`#F59E0B` on white) — **2.18 : 1**, **fails** SC 1.4.11 for the dot/icon alone.
  - Mitigation: the textual label is the canonical indicator and meets contrast on its own. The dot/icon is decorative reinforcement; failing 1.4.11 on a decorative non-essential graphic does not block compliance when the same information is conveyed in compliant text. The `.600` shades (`emerald-600` 3.06:1, `amber-600` 3.43:1) are available if the designer chooses to bump them after seeing the live preview — see ST-7 in the decision log.

## Dependencies

### Tokens — `src/css/theme.css`

| CSS custom property            | Used for                                        |
| ------------------------------ | ----------------------------------------------- |
| `--color-emerald-500`          | In-stock glyph fill                             |
| `--color-rose-500`             | Out-of-stock glyph fill                         |
| `--color-amber-500`            | Stock-status glyph fill                         |
| `--color-slate-blue-800`       | Default `--status-color` fallback + label color |
| `--spacing-1` (4 px)           | Icon-style gap                                  |
| `--spacing-1\.5` (6 px)        | Dot-style gap                                   |
| `--font-sans`                  | Label `font-family` (DM Sans)                   |
| `--spacing(4)` / `--spacing(6)`| Label `font-size` (16 px) / `line-height` (24 px) |

### Other components

None. This atom does not compose any other atom or molecule.

### Icon set

Heroicons solid 20 — `check-circle`, `x-circle`, `exclamation-circle`. Inlined as raw SVG markup per the project's established convention (see form-checkbox `check` path, swatches has no icons). No external icon-set dependency.

## Decision log

All decisions confirmed by the orchestrator on 2026-05-13. Cross-references to `design-tokens/questions.md` are listed for traceability.

| ID    | Topic                                            | Decision                                                                                              | Cross-ref            |
| ----- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | -------------------- |
| ST-1  | Size variants (S / M / L)                        | **No.** Single size at 24 px outer height. Driven by the label's 16/24 type style.                    | questions.md #44     |
| ST-2  | `font-variation-settings: 'opsz' 14`             | **Do NOT apply.** Local DM Sans variable file ships no `opsz` axis. Sub-pixel visual delta at 16 px.  | questions.md #45     |
| ST-3  | Text-only variant (no glyph)                     | **No.** Atom is always glyph + text.                                                                  | questions.md #46     |
| ST-4  | "Notify me" CTA composition                      | **No.** This atom is the indicator only; consumer composes a `buttons` atom alongside.                | questions.md #47     |
| ST-5  | `white-space: nowrap` + overflow policy          | **Apply `nowrap` per Figma.** Consumer parent handles overflow (truncation, sr-only, marquee, etc.).  | questions.md #48     |
| ST-6  | RTL behavior                                     | **`flex` + logical `gap`** — glyph stays at inline-start in both LTR and RTL without `row-reverse`.   | questions.md #48     |
| ST-7  | WCAG 1.4.11 on emerald-500 / amber-500 glyphs    | **FIGMA-EXACT FIRST — ship `.500` shades. Designer will eyeball the live preview before bumping to `.600`. Do NOT silently bump. Deferred — awaiting designer review of live preview.** | questions.md #49     |

## File layout

```
components/status/A-basic/
├── README.md                              ← this file
├── spec.md                                ← Figma-extracted spec
├── preview.html                           ← static gallery of all 10 variants + on-card + nowrap demo
├── figma-screenshots/                     ← reviewer ref images
└── src/
    └── web/
        └── tailwind/
            └── components/
                └── status.css             ← @utility blocks (5 total)
```
