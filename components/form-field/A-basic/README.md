# Form field — A-basic

## Overview

The foundational single-line input shell that every concrete input type (text, email, password, search, currency, phone, select, datepicker, stepper, IBAN, etc.) composes *inside*. The shell is **one** `@utility form-field` plus three feedback modifiers; every "variant" in the Figma catalog is HTML composition inside the shell, not a new CSS class.

Key architecture:

- `@utility form-field` — CSS-variable-driven shell. Handles border, background, padding, radius, typography reset, and per-state styling (hover, focus-within, disabled, readonly, aria-invalid).
- `@utility form-field__input` — bare input/textarea/select that sits inside the shell and lets the shell own the visual.
- `@utility form-field__select` — extends `form-field__input` for native `<select>` (removes native chevron; caller adds a chevron SVG in the trailing affix slot).
- `@utility form-field__affix` — generic leading/trailing slot for icons, buttons, selects.
- `@utility form-field__leading-text` / `form-field__trailing-text` — prefix/suffix TEXT blocks with the `slateBlue.50` background.
- Feedback modifiers: `form-field--error`, `form-field--warning`, `form-field--success` — each overrides only border / focus-ring tokens.
- `form-field--textarea` — modifier that flips the shell to top-align children for multi-line textareas.
- `@utility form-group` + `form-group__label` / `form-group__required` / `form-group__hint` (`--error`, `--warning`, `--success`) — the labeled wrapper around the shell (spec §7).

## Figma nodes

| Node | Role | Colon form | Dash form |
|---|---|---|---|
| Base shell ("Base/_Input field {base}") | Source of truth for shell styling | `1329:15249` | `1329-15249` |
| Variants catalog ("Input field") | Source of truth for HTML composition patterns | `1331:14308` | `1331-14308` |

Figma file key: `YlKyhwcdYEa41gK1BSs4AZ`.

## Variants (composition patterns)

All 11+ patterns are **HTML composition inside the shell**. No CSS variant classes.

### Plain text input

```html
<div class="form-field">
  <input type="text" class="form-field__input" placeholder="Your email" />
</div>
```

Swap `type="text"` for `email`, `tel`, `url`, `number`, `search` — the visual is identical.

### Leading icon (24 px)

```html
<div class="form-field">
  <span class="form-field__affix">
    <svg class="size-6" aria-hidden="true">…magnifier…</svg>
  </span>
  <input type="search" class="form-field__input" placeholder="Search products" />
</div>
```

### Trailing icon (20 px)

```html
<div class="form-field">
  <input type="email" class="form-field__input" placeholder="you@phpure.golf" />
  <span class="form-field__affix">
    <svg class="size-5" aria-hidden="true">…envelope…</svg>
  </span>
</div>
```

### Password with visibility toggle

```html
<div class="form-field" x-data="{ shown: false }">
  <input class="form-field__input" x-bind:type="shown ? 'text' : 'password'" value="…" />
  <button type="button" class="form-field__affix"
          aria-label="Show password"
          x-bind:aria-pressed="shown"
          @click="shown = !shown">
    <svg>…eye…</svg>
  </button>
</div>
```

### Currency with leading text prefix

```html
<div class="form-field">
  <span class="form-field__leading-text" aria-hidden="true">€</span>
  <input type="number" class="form-field__input" placeholder="0.00" step="0.01" />
</div>
```

### Currency with leading + trailing text

```html
<div class="form-field">
  <span class="form-field__leading-text" aria-hidden="true">€</span>
  <input type="number" class="form-field__input" value="1250" />
  <span class="form-field__trailing-text" aria-hidden="true">.00</span>
</div>
```

### Phone (country-code select + tel input)

```html
<div class="form-field">
  <select class="form-field__input form-field__select form-field__select--auto" aria-label="Country code">
    <option value="+32">+32</option>
    <option value="+31">+31</option>
  </select>
  <input type="tel" class="form-field__input" placeholder="4 123 45 67" />
</div>
```

### Native select with styled chevron (country / size / etc.)

```html
<div class="form-field">
  <select class="form-field__input form-field__select" aria-label="Country">
    <option value="">Select a country</option>
    <option value="be">Belgium</option>
  </select>
  <span class="form-field__affix" aria-hidden="true">
    <svg class="size-5">…chevron-down…</svg>
  </span>
</div>
```

### Datepicker (native)

```html
<div class="form-field">
  <input type="date" class="form-field__input" aria-label="Tee time" />
  <span class="form-field__affix" aria-hidden="true"><svg>…calendar…</svg></span>
</div>
```

### Stepper (quantity − / +)

```html
<div class="form-field" x-data="{ v: 1 }">
  <button type="button" class="form-field__affix" aria-label="Decrease" @click="v = Math.max(0, v - 1)">
    <svg>…minus…</svg>
  </button>
  <input type="number" class="form-field__input form-field__input--numeric" x-model.number="v" min="0" />
  <button type="button" class="form-field__affix" aria-label="Increase" @click="v++">
    <svg>…plus…</svg>
  </button>
</div>
```

Stepper is a composition only — there is no dedicated CSS. See the Decision log and Future work below.

### Textarea (multi-line)

```html
<div class="form-field form-field--textarea">
  <textarea class="form-field__input" rows="4" placeholder="Leave a note…"></textarea>
</div>
```

`form-field--textarea` flips the shell to `align-items: flex-start` so the first line of text aligns with the top of any affixes.

## States

Implemented on the shell via the three feedback modifiers + native CSS pseudo-classes:

| State | Trigger | Visual |
|---|---|---|
| Default | `.form-field` | border `slate-blue-300`, bg `white`, text `slate-blue-800`, placeholder `slate-blue-500` |
| Hover | `:hover` | border `blue-300` |
| Focus | `:focus-within` on shell (driven by inner input focus) | border `blue-400` + `Focus/Primary` box-shadow |
| Disabled | `:has(:disabled)`, `[aria-disabled="true"]`, `.is-disabled` | bg `slate-blue-50`, border `slate-blue-200`, text `slate-blue-400`, `cursor: not-allowed` |
| Readonly | `:has([readonly])` | Same palette as disabled, but `cursor: text` (users can select/copy) |
| Error | `.form-field--error`, `[aria-invalid="true"]`, `.is-invalid` | border `rose-500` + `Focus/Error` ring |
| Warning | `.form-field--warning` | border `amber-500` + `Focus/Warning` ring |
| Success | `.form-field--success` | border `emerald-500` + `Focus/Success` ring |

## Sizes

The Figma base node exposes **one size only**: height 40 px, inline padding 14 px, block padding 10 px, typography `text-base/leading-6/font-normal`. A smaller "dense" field would require a separate Figma node — log a new question if needed (spec §5).

## Accessibility

- **Label association.** `<label for="id">` paired with `<input id="id">`. See the Form group examples.
- **`aria-invalid="true"`** on the input when feedback = error. The shell also reacts to this on itself (so you can set it at the shell level if preferred).
- **`aria-describedby="{hint-id}"`** on the input, pointing at the hint-text `id`.
- **Native `disabled` / `required` / `readonly`** preferred over ARIA equivalents where supported.
- **Visible focus ring** — the `:focus-within` shell border + `Focus/*` box-shadow handles this.
- **Required indicator** — a red asterisk `<span class="form-group__required" aria-hidden="true">*</span>` appended to the label. The asterisk is `aria-hidden` so screen readers rely on the native `required` attribute (designer decision, Q#21).
- **Placeholder is not a label.** Always pair with `<label>` or at minimum an `aria-label`.

## Dependencies

- CSS variables from `src/css/theme.css`:
  - Colors: `--color-white`, `--color-slate-blue-{50,200,300,400,500,700,800}`, `--color-blue-{300,400}`, `--color-rose-500`, `--color-amber-500`, `--color-emerald-500`.
  - Spacing: `--spacing-1`, `--spacing-1.5`, `--spacing-2.5`, `--spacing-3.5`, `--spacing-4`, `--spacing-5`, `--spacing-6`, `--spacing-10`.
  - Radius: `--radius-sm`.
  - Shadows: `--shadow-focus/primary`, `--shadow-focus/error`, `--shadow-focus/warning`, `--shadow-focus/success`.
  - Typography: `--font-sans`.
- No external JS. Alpine is used only in the usage snippets above — the shell itself is pure CSS.
- Tailwind v4 (`@utility`, `--spacing()` helper).

## Decision log

Cross-referenced with `design-tokens/questions.md` entries 13–21. All nine were designer-approved on 2026-04-24.

| # | Question | Resolution | Applied where |
|---|---|---|---|
| Q#13 | Icon color in the shell | `currentColor` — icons inherit from text color. `blue.400` in Figma base was a preview artifact. | `form-field__affix { color: inherit }`; SVGs use `stroke="currentColor"` |
| Q#14 | Warning / success hint-text colors | `.500` tier for both: `amber.500` / `emerald.500` (mirrors `rose.500` for error). | `form-group__hint--warning`, `form-group__hint--success` |
| Q#15 | Leading 24 px vs trailing 20 px icons | Keep the Figma asymmetry. Leading = 24, trailing = 20. | Documented; caller sets the size on each SVG. Default affix size is 20 px — leading SVGs override to 24 px inline. |
| Q#16 | Readonly state (not in Figma) | Same visuals as disabled, but keep `cursor: text`. No pointer-events block. | `form-field:has([readonly])` rule |
| Q#17 | Trailing-text suffix (no Figma ref) | Mirror the leading-text styling — same bg, same border, flipped sides. | `@utility form-field__trailing-text` |
| Q#18 | Dropdown slot implementation | Styled native `<select>` for this atom. Custom Alpine combobox is a future `dropdown-list` molecule. | `@utility form-field__select` |
| Q#19 | Stepper variant | Not in this atom. Composition pattern only: shell + buttons + number input. | README snippet + preview demo; no dedicated CSS |
| Q#20 | Datepicker / mask libraries | Shell stays library-agnostic. No library-specific CSS. | Native `<input type="date">` in preview |
| Q#21 | Required indicator | Visible red asterisk in label + native HTML `required`. Asterisk is `aria-hidden="true"`. | `form-group__required` + usage pattern |

## Future work

- **`dropdown-list` molecule.** Fully custom Alpine combobox (searchable, multi-level, rich menu items) — lives as a separate component, reuses this shell for the trigger (already noted in `ui-kit-inventory.md`).
- **Stepper molecule.** If a dedicated stepper variant is designed in Figma, wrap the composition pattern above into `components/stepper/A-basic/` with Alpine logic baked in.
- **Input masking.** Dev-team decision on library (`imask`, `cleave.js`, etc.). Shell is library-agnostic.
- **Datepicker molecule.** Dev-team decision on library (`flatpickr`, `litepicker`, etc.). Shell accepts a trailing calendar icon today.
