# Form checkbox — A-basic

PHPure Golf brand variant of the Hyvä UI 2.7.1 form-checkbox atom.

## Overview

A native `<input type="checkbox">` styled via `appearance: none` + a CSS-driven shell on the wrapping `<label>`. CSS-only — no Alpine — except for one optional one-liner that seeds the `indeterminate` state (which is a JavaScript-only property on `HTMLInputElement`, not an HTML attribute).

The shell mirrors the form-field architecture:

- **One** `@utility form-checkbox` on the wrapping `<label>` exposes a small palette of CSS custom properties (`--check-bg`, `--check-border`, `--check-glyph`, `--check-focus-ring`, `--check-focus-outline`, `--check-size`, `--check-glyph-size`, `--check-gap`, `--check-radius`).
- **State selectors** on the shell key off `:has(:checked)`, `:has(:indeterminate)`, `:has(:focus-visible)`, `:has(:disabled)`, and `[aria-invalid="true"]` / `.is-invalid`. **No per-state utilities** — consumers don't manage state classes; the native attributes drive the visual.
- **Sizes** (`form-checkbox--sm`, `form-checkbox--lg`) override only the dimension tokens. The default is M.
- **Feedback modifiers** (`form-checkbox--error`, `form-checkbox--warning`, `form-checkbox--success`) override only the border + focus tokens. The box bg + glyph stay brand-correct so the user's selection remains legible; the rose / amber / emerald is communicated through the border, the focus outline, and the surrounding `form-group__hint--*` text.
- **Group wrapper**: `form-checkbox-group` (a flex column with `gap: --spacing-2`) and `form-checkbox-group__legend` (typography matches `form-group__label`) ship together so consumers don't reinvent the spacing.

## Figma node

`1420:30806` — *Checkbox* component set (PHPure Golf, file `YlKyhwcdYEa41gK1BSs4AZ`).

## Variants

The shell expresses three native variants of `<input type="checkbox">`:

| Variant | How it's set | What it looks like |
|---|---|---|
| Unchecked | Default | White box, slate-blue-500 border. |
| Checked | `<input checked>` (or user click) | Emerald-200 fill, white Heroicons `check` glyph, no border. |
| Indeterminate | `el.indeterminate = true` (JS) | Emerald-200 fill, white horizontal bar (CSS `::after`), no border. |

There are no separate utilities for the variants. The `:has()` selectors on the shell pick them up from the native attributes / properties.

## States

Per variant, the shell handles five states. The matrix in `preview.html` renders all of them.

| State | Trigger | Tokens that change |
|---|---|---|
| Default | — | (the modifier base) |
| Hover | `:has(:hover:not(:disabled, :checked, :indeterminate))` | `--check-bg → neutral-100`, `--check-border → deep-emerald-green-200` (only on Unchecked) |
| Focus-visible | `:has(:focus-visible)` | adds `box-shadow: var(--check-focus-ring)` + `outline: 2px solid var(--check-focus-outline)` |
| Disabled | `:has(:disabled)` | label → slate-blue-400, hint → slate-blue-300, glyph → slate-blue-300, `cursor: not-allowed`. Border + bg cascade depends on Checked / Indeterminate (see Q#31 below) |
| Invalid | `[aria-invalid="true"]` or `.is-invalid` on the wrapper | `--check-border → rose-500`, `--check-focus-ring → Focus/Error`, `--check-focus-outline → rose-700` |

## Sizes

| Size | Class | Box | Glyph | Label typography |
|---|---|---|---|---|
| S | `form-checkbox--sm` | 16 × 16 px | 12 px | `text-sm` / `leading-5` / 600 |
| **M (default)** | `form-checkbox` | 20 × 20 px | 16 px | `text-base` / `leading-6` / 600 |
| L | `form-checkbox--lg` | 24 × 24 px | 16 px | `text-lg` / `leading-7` / 600 |

S and M add `padding-block: --spacing(1)` to the wrapping `<label>` so the click target reaches ≥24 × 24 px (WCAG 2.5.8). L already meets the threshold without padding.

## Layout

### Single, label only

```html
<label class="form-checkbox">
    <input type="checkbox" class="form-checkbox__input" />
    <span class="form-checkbox__box" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" class="form-checkbox__check">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    </span>
    <span class="form-checkbox__text">
        <span class="form-checkbox__label">Subscribe to the newsletter</span>
    </span>
</label>
```

### Stacked, label + hint (with `aria-describedby`)

```html
<label class="form-checkbox">
    <input type="checkbox" class="form-checkbox__input"
           id="ck-news" aria-describedby="ck-news-hint" />
    <span class="form-checkbox__box" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" class="form-checkbox__check">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    </span>
    <span class="form-checkbox__text">
        <span class="form-checkbox__label">Email me about course conditions</span>
        <span class="form-checkbox__hint" id="ck-news-hint">Once a week, never on Sundays.</span>
    </span>
</label>
```

### Required (with visible asterisk + native `required`)

```html
<label class="form-checkbox form-checkbox--error">
    <input type="checkbox" class="form-checkbox__input"
           id="ck-terms" required aria-invalid="true"
           aria-describedby="ck-terms-hint" />
    <span class="form-checkbox__box" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" class="form-checkbox__check">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    </span>
    <span class="form-checkbox__text">
        <span class="form-checkbox__label">
            I accept the terms and conditions
            <span class="form-checkbox__required" aria-hidden="true">*</span>
        </span>
        <span class="form-checkbox__hint form-group__hint--error" id="ck-terms-hint">
            You must accept before continuing.
        </span>
    </span>
</label>
```

### Indeterminate (seed via a one-liner module script)

```html
<label class="form-checkbox">
    <input type="checkbox" class="form-checkbox__input" id="ck-select-all" />
    <span class="form-checkbox__box" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" class="form-checkbox__check">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    </span>
    <span class="form-checkbox__text">
        <span class="form-checkbox__label">Select all</span>
    </span>
</label>

<!-- CSP-safe: module script, no event handler. -->
<script type="module">
    const el = document.getElementById('ck-select-all');
    if (el) el.indeterminate = true;
</script>
```

`indeterminate` is a JavaScript-only property of `HTMLInputElement` — there is no HTML attribute equivalent. Clicking an indeterminate checkbox collapses it to the standard checked state (browser default).

### Group (`<fieldset>` + `<legend>`)

```html
<fieldset class="form-checkbox-group">
    <legend class="form-checkbox-group__legend">Communication preferences</legend>
    <label class="form-checkbox">
        <input type="checkbox" class="form-checkbox__input" name="comms" value="email" checked />
        <span class="form-checkbox__box" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" class="form-checkbox__check">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
        </span>
        <span class="form-checkbox__text">
            <span class="form-checkbox__label">Email</span>
        </span>
    </label>
    <!-- repeat per option … -->
</fieldset>
```

`<fieldset>` + `<legend>` is the simplest WCAG 1.3.1 / 4.1.2 compliant grouping. The shipped `form-checkbox-group` utility strips the native UA fieldset border + margin so the rows read as a flat stack.

### Form-field-style composition

Drop the checkbox inside a regular `form-group` to use the `form-group__label` and `form-group__hint` patterns from `form-field`:

```html
<div class="form-group">
    <label class="form-group__label" for="ck-fg">Newsletter</label>
    <label class="form-checkbox">
        <input type="checkbox" id="ck-fg" class="form-checkbox__input" />
        <span class="form-checkbox__box" aria-hidden="true">…</span>
        <span class="form-checkbox__text">
            <span class="form-checkbox__label">Receive the weekly digest</span>
        </span>
    </label>
</div>
```

## Accessibility

| Requirement | How |
|---|---|
| **Label association** | Wrapping `<label>` (preferred — implicit). Alternatively, `<input id="x"> + <label for="x">`. |
| **Visually hidden input** | `appearance: none; opacity: 0; position: absolute;` — never `display: none` or `visibility: hidden`, both of which remove the input from the AT tree. The `<input>` stays focusable, clickable, and announceable. |
| **`aria-checked`** | Auto-managed by `<input type="checkbox">`. **Do not add manually.** |
| **Indeterminate** | `el.indeterminate = true` (JS-only). Document this clearly when consumers ask for a tri-state ("select all") pattern — the visual is the bar, but assistive tech announces "mixed" automatically. |
| **`aria-invalid`** | Set on the `<input>` to drive the invalid visual via `:has([aria-invalid="true"])` on the wrapper. Mirrors form-field. |
| **`aria-describedby`** | When hint text is present, the hint's `<span>` gets an `id` and the `<input>` gets `aria-describedby="<id>"`. Both default and error hints. |
| **Required marking** | Both the native `required` attribute on `<input>` AND a visible asterisk on the label (`<span class="form-checkbox__required" aria-hidden="true">*</span>`). Matches the form-field convention (questions.md #21). The asterisk is `aria-hidden`; SR users hear "required" from the native attribute. |
| **Touch target ≥ 24 × 24 px** | WCAG 2.5.8. The `<label>` wrapper extends the click area via `padding-block: --spacing(1)` (4 px) for sizes S and M. Size L (24 px box) already meets the threshold. |
| **Focus indicator ≥ 3:1** | The 4 px `Focus/Primary` glow alone is 1.23:1 against white (FAIL). The shell adds a 2 px solid outline in `deep-emerald-green-500` (9.83:1 ✓). For invalid: 2 px solid `rose-700` (6.37:1 ✓). Same fix shipped on form-field / button (A11Y-006). |
| **Border contrast (UI components, WCAG 1.4.11)** | Default unchecked border requires ≥3:1. `slate-blue-300` at 2.23:1 FAILS. Shell uses `slate-blue-500` (4.39:1 ✓). Disabled border is exempt from 1.4.11 per WCAG. |
| **Group association** | `<fieldset>` + `<legend>` for multi-checkbox groups (`form-checkbox-group` utility). |
| **Color is not the sole indicator** | Checked state has the check glyph (shape, not just color). Indeterminate has the bar. Error state has the hint text + the asterisk. All compliant. |
| **Disabled stays focusable** | Per Q#31 / WCAG 2.4.3, disabled checkboxes do **not** apply `pointer-events: none`. The native `<input>` remains tab-reachable so keyboard users can perceive its state. Only `cursor: not-allowed` is set on the wrapping label. |

## Dependencies

- **Tokens** (all from `src/css/theme.css`):
  - Colors: `--color-white`, `--color-slate-blue-{100,300,400,500,700}`, `--color-deep-emerald-green-{200,500}`, `--color-neutral-100`, `--color-rose-{500,700}`, `--color-amber-700`, `--color-emerald-700`.
  - Shadows: `--shadow-focus/primary`, `--shadow-focus/error`, `--shadow-focus/warning`, `--shadow-focus/success`.
  - Radius: `--radius-base` (4 px).
  - Spacing: `--spacing-{0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7}`.
  - Typography: `--font-sans` (DM Sans).
- **Sibling components**: re-uses `form-group__hint--error`, `form-group__hint--warning`, `form-group__hint--success` from `form-field/A-basic` for hint text colors.
- **Icons**: Heroicons outline-24 `check`. Caller renders the SVG inline inside `.form-checkbox__box`.
- **JavaScript**: none required for default usage. Indeterminate state needs a one-liner module script (see "Indeterminate" example above).

## Decision log

Ambiguities raised in `design-tokens/questions.md` entries `#28`–`#33` (dated 2026-05-08). Designer-approved resolutions are baked into the CSS:

| # | Question | Resolution |
|---|---|---|
| Q#28 (OQ-CB-1) | Indeterminate visual not in Figma | Horizontally-centered 2 px-thick bar, drawn as `::after` on `.form-checkbox__box` (CSS-only — scales with the box, no SVG asset). Same emerald-200 fill + white glyph color as Checked. |
| Q#29 (OQ-CB-2) | Invalid / error visual not in Figma | Border-only signal: `--check-border = rose-500` (3.67:1 ✓ for UI), `--check-focus-outline = rose-700` (6.37:1). Box bg + glyph stay emerald / white so the selection remains legible. The hint (`form-group__hint--error`, rose-700) carries the message text. |
| Q#30 (OQ-CB-3) | Default border WCAG fail | `slate-blue-500` (4.39:1 ✓) instead of Figma's `slate-blue-300` (2.23:1 FAIL). Same deviation shipped on form-field as A11Y-007. |
| Q#31 (OQ-CB-4) | Disabled-Checked treatment | Box bg STAYS `deep-emerald-green-200`. Glyph color shifts to `slate-blue-300`. `cursor: not-allowed` on the wrapping label. `pointer-events: none` is **not** applied — the input stays tab-reachable per WCAG 2.4.3. |
| Q#32 (OQ-CB-5) | Disabled label color | `slate-blue-400` for label, `slate-blue-300` for box border + glyph + hint. Matches form-field's disabled cascade. |
| Q#33 (OQ-CB-7 + OQ-CB-9) | Glyph identity + S-size dimensions | Heroicons outline-24 `check`. S = 12 px (`--spacing(3)`); M / L = 16 px (`--spacing(4)`). Glyph color is `currentColor` so the box-bg + glyph-color tokens drive the look. |

## Future work

- **Hint typography for Size S** is provisional (12 px / leading 4 / 500). When Figma ships an S+Label+Hint sample (`questions.md` OQ-CB-9), revisit.
- **`prefers-reduced-motion`** guard on the `transition-property` in `.form-checkbox__box` — A11Y-020 advisory; can be added in a CSS-only follow-up.
- **Card variant** — once Figma adds a `Checkbox = Card` variant (large clickable card with checkbox in the corner), spec it as `form-checkbox--card` and reuse the shell.

## Files

- `src/web/tailwind/components/form-checkbox.css` — the shipped CSS.
- `preview.html` — static preview rendering every state matrix, size ladder, feedback modifier, group, and live interactive sample.
- `spec.md` — Figma-derived spec (sole upstream).
- `README.md` — this file.
