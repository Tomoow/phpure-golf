# Form checkbox — A-basic — spec

> **Figma node:** `1420:30806` — *Checkbox* component set (PHPure Golf, file `YlKyhwcdYEa41gK1BSs4AZ`).
> Probed sub-nodes: `1420:31133` (M / Default / Unchecked), `1420:31139` (M / Default / Checked), `1420:31145` (M / Hover / Unchecked), `1420:31151` (M / Hover / Checked), `1420:31157` (M / Focus / Unchecked), `1420:31163` (M / Focus / Checked), `1420:31169` (M / Disabled / Unchecked), `1420:31175` (M / Disabled / Checked), `1420:30899` (S / Default / Unchecked / Label), `1420:31241` (M / Default / Unchecked / Label), `1420:31593` (L / Default / Unchecked / Label), `1420:31349` (M / Default / Unchecked / Label + Hint), `1420:31599` (L / Default / Unchecked / Label + Hint), `1420:31277` (M / Disabled / Unchecked / Label).

---

## 1. Overview

A native `<input type="checkbox">` styled via `appearance: none` + a CSS-drawn check glyph. Pairs with `form-group` (label + hint + error) for stacked usage and works inline as a row composition with a label. CSS-only — no Alpine. Mirrors the form-field architecture: a single `@utility form-checkbox` shell driven by CSS custom properties, with state selectors keying off `:checked` / `:focus-visible` / `:disabled` / `[aria-invalid="true"]` / `:indeterminate` (see §6, §10).

---

## 2. Decision log (read before authoring)

The following decisions are required from the design lead before the author writes CSS. Open questions are logged numerically in `design-tokens/questions.md` (entries `28–33`, dated `2026-05-08`) and cross-referenced inline below as **OQ-CB-#**.

| # | Decision | Default proposed by spec |
|---|---|---|
| OQ-CB-1 | **Indeterminate state.** Figma does not include an indeterminate variant for the checkbox. The form-checkbox SHELL must support it because it's a standard ARIA pattern (e.g. "select all" tri-state). | Use the same colors as `Checked` (emerald-200 fill, white glyph) but render a 2px-tall horizontal bar (10×2 px in M) instead of a checkmark. Confirm. |
| OQ-CB-2 | **Invalid / error state.** Figma does not include an error variant for the checkbox. The shell must support it (terms-and-conditions checkbox, "you must accept" cases). | Mirror form-field: `--check-border = rose-500`, `--check-focus-outline = rose-700`, `--check-focus-ring = Focus/Error`. Glyph stays whatever the checked/indeterminate state would render. Confirm. |
| OQ-CB-3 | **Default-Unchecked border color.** Figma reports `slate-blue-300` (#9DB0C2 → 2.23:1 vs white = WCAG 1.4.11 FAIL for UI components). The form-field shell already deviates from Figma here, using `slate-blue-500` (4.39:1 PASS). | Use `slate-blue-500` for the unchecked border to match form-field and pass WCAG AA. Document in `design-tokens/accessibility-review.md` with the same A11Y-007-style entry. Confirm. |
| OQ-CB-4 | **Disabled-Checked glyph.** Figma reports the disabled-checked glyph as `slate-blue-200` on a white box with `slate-blue-100` border (i.e. the box is NOT filled). This contradicts the standard "checked = filled" pattern. | Render disabled-checked exactly as Figma: white box, slate-blue-100 border, slate-blue-200 glyph. NOT a faded emerald. Confirm. |
| OQ-CB-5 | **Disabled label color.** Figma keeps the label at `slate-blue-700` even in the Disabled variant (`1420:31277`), with no opacity change. Visually the row reads as enabled. | Override Figma: render disabled label at `slate-blue-400` to match the form-group disabled affordance and pass colour-meaning rules. Confirm. |
| OQ-CB-6 | **Touch target.** WCAG 2.5.8 requires ≥24×24 px target. Sizes S (16) and M (20) are smaller. The wrapping `<label>` must extend the hit area via padding. | Wrapping `<label>` provides at least `--spacing-1` (4 px) padding on all sides for S and M; L (24 px) needs no padding. Confirm. |

---

## 3. Visual spec — the box itself

All values reference token names declared in `src/css/theme.css`. Hex values intentionally omitted — see `design-tokens/tokens.resolved.json`.

### 3.1 Common (all sizes, all states)

| Property | Token | Notes |
|---|---|---|
| Border style | `solid` | — |
| Border width | `1px` (raw — matches Figma; the form-field shell is also 1px) | If a token like `border-width-sm` is added later, swap. |
| Border radius | `borderRadius.base` (= `4px` = `rounded-sm` in v4) | Figma reports `rounded-[4px]`; matches `--radius-base`. |
| Glyph (checked) | Heroicons outline-24 `check` (the SVG asset returned by Figma is a tick stroke, see §3.4) | — |
| Glyph (indeterminate) | Horizontal bar (CSS-drawn, no SVG). See OQ-CB-1. | — |
| Transitions | `color, background-color, border-color, box-shadow` | Same defaults as form-field. |

### 3.2 Box dimensions per size

| Size | Box (incl. border) | Glyph (centered) |
|---|---|---|
| S | `16 × 16 px` | `8 × 8 px` (Figma reports `size-[10px]` for M; for S the SVG is reduced; confirm with author at implementation time — see OQ-CB-7) |
| M | `20 × 20 px` | `10 × 10 px` |
| L | `24 × 24 px` | `12 × 12 px` (proportional; Figma confirmed below) |

> Note: Figma's Disabled-Checked variant uses a different SVG asset (`58521c5b…`) than non-disabled checked variants (`fdae2b47…`). Both render the same tick shape; the difference is the stroke color (white vs slate-blue-200). The author should draw the glyph via CSS `mask-image` or inline SVG so colour can be driven from `currentColor`.

### 3.3 State matrix — Size M (S and L scale proportionally; only the box dimensions change)

Figma reports **no Indeterminate and no Invalid** variants. Rows for those are derived per OQ-CB-1 and OQ-CB-2.

| State | Box bg | Box border | Glyph color | Glyph visible? | Outer ring (`box-shadow`) | Outline |
|---|---|---|---|---|---|---|
| **Unchecked / Default** | `colors.white` | `colors.slateBlue.300` (Figma) — see OQ-CB-3 (recommend `slateBlue.500`) | — | no | none | none |
| **Unchecked / Hover** | `colors.neutral.100` | `colors.deepEmeraldGreen.200` | — | no | none | none |
| **Unchecked / Focus-visible** | `colors.white` | `colors.blue.400` | — | no | `boxShadow.Focus/Primary` (4 px spread, `focusRingColors.primary`) | 2 px solid `colors.deepEmeraldGreen.500` (matches form-field WCAG fix; see OQ-CB-8) |
| **Unchecked / Disabled** | `colors.white` | `colors.slateBlue.100` | — | no | none | none |
| **Checked / Default** | `colors.deepEmeraldGreen.200` | none (Figma renders no border on checked; the fill IS the surface) | `colors.white` | yes (check) | none | none |
| **Checked / Hover** | `colors.deepEmeraldGreen.200` | none | `colors.white` | yes (check) | none | none |
| **Checked / Focus-visible** | `colors.deepEmeraldGreen.200` | none | `colors.white` | yes (check) | `boxShadow.Focus/Primary` | 2 px solid `colors.deepEmeraldGreen.500` |
| **Checked / Disabled** | `colors.white` (NOT filled — see OQ-CB-4) | `colors.slateBlue.100` | `colors.slateBlue.200` | yes (check) | none | none |
| **Indeterminate / Default** | `colors.deepEmeraldGreen.200` (per OQ-CB-1) | none | `colors.white` | yes (bar) | none | none |
| **Indeterminate / Hover** | `colors.deepEmeraldGreen.200` | none | `colors.white` | yes (bar) | none | none |
| **Indeterminate / Focus-visible** | `colors.deepEmeraldGreen.200` | none | `colors.white` | yes (bar) | `boxShadow.Focus/Primary` | 2 px solid `colors.deepEmeraldGreen.500` |
| **Indeterminate / Disabled** | `colors.white` (matches Disabled-Checked treatment per OQ-CB-1) | `colors.slateBlue.100` | `colors.slateBlue.200` | yes (bar) | none | none |
| **Invalid / Unchecked** | `colors.white` | `colors.rose.500` (per OQ-CB-2) | — | no | none | none |
| **Invalid / Unchecked + Focus-visible** | `colors.white` | `colors.rose.500` | — | no | `boxShadow.Focus/Error` | 2 px solid `colors.rose.700` |
| **Invalid / Checked** | `colors.deepEmeraldGreen.200` (fill stays brand-correct; the rose comes through the focus ring + adjacent error hint per OQ-CB-2 alt) **OR** `colors.rose.500` fill (alt) | none / `colors.rose.500` | `colors.white` | yes (check) | none | none |
| **Invalid / Indeterminate** | same as Invalid / Checked | same | `colors.white` | yes (bar) | none | none |

> The "Invalid / Checked" row has two viable interpretations. The spec recommends keeping the emerald fill so that the user's selection remains legible and the error is communicated via the surrounding `form-group__hint--error` text + the rose focus ring. Confirm in OQ-CB-2.

### 3.4 Glyph implementation note

Figma ships the checkmark as an SVG asset shared across all non-disabled states, and a separate SVG for the disabled-checked state (only the stroke colour differs). For implementation, the author should NOT load two SVG files — instead, draw the glyph via inline SVG (`<svg viewBox="0 0 10 10">`) or CSS `mask-image` + `background-color: currentColor`. This collapses both glyphs into one and lets the disabled-checked colour fall out of the cascade.

The Heroicons outline-24 `check` icon is the canonical project tick (per `CLAUDE.md` icons section). Confirm Figma's SVG matches at the M size (10 × 10 px). Stroke width and end-cap rounding likely differ between the two asset families — see OQ-CB-7.

---

## 4. Sizes

Three sizes — Figma `Size = S | M | L`.

| Size | Box | Label typography token | Hint typography token | Gap (box ↔ text) | Top padding on box wrapper |
|---|---|---|---|---|---|
| S | 16 × 16 px | `typography.text-sm/leading-5/font-medium` (resolved DM Sans 14/20/600) — color `colors.slateBlue.700` | `typography.text-xs/leading-4/font-normal` (DM Sans 12/16/500) — color `colors.slateBlue.400` (see OQ-CB-9 — Figma did not return a S+Label+Hint sample to confirm hint sizing) | `spacing.2` (8 px — Figma reports `gap-[8px]` for None-text; `gap-[10px]` for Label-bearing) | `spacing.0.5` (2 px — Figma reports `pt-[2px]` to align box with first line of label) |
| M | 20 × 20 px | `typography.text-base/leading-6/font-medium` (DM Sans 16/24/600) — color `colors.slateBlue.700` | `typography.text-sm/leading-5/font-normal` (DM Sans 14/20/500) — color `colors.slateBlue.400` | `spacing.2.5` (10 px) | `spacing.0.5` (2 px) |
| L | 24 × 24 px | `typography.text-lg/leading-7/font-medium` (DM Sans 18/28/600) — color `colors.slateBlue.700` | `typography.text-base/leading-6/font-normal` (DM Sans 16/24/500) — color `colors.slateBlue.400` | `spacing.2.5` (10 px) | `spacing.0.5` (2 px) |

> All `text-*-medium` Figma styles ship as Demi-600 (see `questions.md` #8), so the resolved token's `weight: 400` field is misleading for this component — the author should render at 600 to match Figma. This is consistent with how the Button and Form-field specs handled the same token. The shell uses `font-weight: 600` directly.

---

## 5. Layout patterns

### 5.1 Inline row (default)

Box + label sit on one line, vertically aligned to the first text-baseline / first text-line of the label.

```
┌──┐  Label text
└──┘
```

- Wrapper element: `<label class="form-checkbox">` containing both `<input>` and the label text node. (Implicit label association — preferred for screen-reader consistency.)
- Display: `inline-flex` with `align-items: flex-start` and `gap: var(--check-gap)` (= `--spacing-2.5` for M / L, `--spacing-2` for S).
- The box gets `margin-top: var(--spacing-0\\.5)` (2 px) so it visually centres on the cap-height of the first text line — Figma reports `pt-[2px]` on the box wrapper.
- Touch target: `<label>` adds `padding-block: --spacing-1` (4 px) at S/M to lift the row's hit area to ≥24 px.

### 5.2 Stacked with hint text

Box + label on first line; hint text on second line under the label, indented to align with the label start.

```
┌──┐  Label text
└──┘  Hint text under the label
```

- Wrapper: `<label class="form-checkbox form-checkbox--stacked">` (or use `form-group` if the hint must be addressed by `aria-describedby`; see §6 — the author may decide composition).
- DOM: `<label> <input> <span class="form-checkbox__text"> <span class="form-checkbox__label">…</span> <span class="form-checkbox__hint">…</span> </span> </label>`.
- The text column is a `flex flex-col` with `align-items: flex-start`. Hint takes `--check-hint-color = slateBlue.400` and the size-specific hint typography token from §4.
- For error state: hint colour swaps to `colors.rose.700` (matches `form-group__hint--error`).

### 5.3 Group of checkboxes (`<fieldset>` + `<legend>`)

When two or more checkboxes share a question (e.g. "Which sports?"), wrap them in a `<fieldset>` with a `<legend>`. The `<legend>` carries the group label; each checkbox is its own labelled row.

```html
<fieldset class="form-checkbox-group">
    <legend class="form-checkbox-group__legend">Which sports?</legend>
    <label class="form-checkbox">
        <input type="checkbox" name="sport" value="golf"> Golf
    </label>
    <label class="form-checkbox">
        <input type="checkbox" name="sport" value="tennis"> Tennis
    </label>
</fieldset>
```

WCAG 1.3.1 / 4.1.2 require the group to be programmatically associated with its label — `<fieldset>` + `<legend>` is the simplest correct implementation.

The author should ship a small `@utility form-checkbox-group` (display: flex; flex-direction: column; gap: --spacing-2) and `@utility form-checkbox-group__legend` (uses the same typography as `form-group__label`).

---

## 6. Architecture (recommendation for the author)

**Recommended:** ONE `@utility form-checkbox` shell on the wrapping `<label>`, with state selectors driven by `:has(:checked)`, `:has(:focus-visible)`, `:has(:disabled)`, `:has([aria-invalid="true"])`, `:has(:indeterminate)`. CSS custom properties drive the box appearance from a small palette of slot tokens.

This mirrors the form-field shell architecture and the Hyvä UI 2.7.1 idiom for atoms. Concretely:

```
@utility form-checkbox {
    /* slots */
    --check-bg: var(--color-white);
    --check-border: var(--color-slate-blue-500); /* per OQ-CB-3 */
    --check-glyph: transparent;
    --check-focus-ring: var(--shadow-focus\/primary);
    --check-focus-outline: var(--color-deep-emerald-green-500);
    --check-size: --spacing(5);                  /* M default */
    --check-glyph-size: --spacing(2.5);          /* 10 px */
    --check-gap: --spacing(2.5);
    --check-radius: var(--radius-base);

    /* state overrides */
    &:has(:hover:not(:disabled, :checked, :indeterminate)) { --check-bg: var(--color-neutral-100); --check-border: var(--color-deep-emerald-green-200); }
    &:has(:checked), &:has(:indeterminate) { --check-bg: var(--color-deep-emerald-green-200); --check-border: transparent; --check-glyph: var(--color-white); }
    &:has(:focus-visible) { box-shadow: var(--check-focus-ring); outline: 2px solid var(--check-focus-outline); outline-offset: 2px; }
    &:has(:disabled) { --check-border: var(--color-slate-blue-100); --check-bg: var(--color-white); --check-glyph: var(--color-slate-blue-200); cursor: not-allowed; }
    &:is([aria-invalid="true"], .is-invalid) { --check-border: var(--color-rose-500); --check-focus-ring: var(--shadow-focus\/error); --check-focus-outline: var(--color-rose-700); }
}

@utility form-checkbox--sm { --check-size: --spacing(4); --check-glyph-size: --spacing(2); --check-gap: --spacing(2); }
@utility form-checkbox--lg { --check-size: --spacing(6); --check-glyph-size: --spacing(3); }
```

The `<input>` itself gets `appearance: none; width: var(--check-size); height: var(--check-size); …` on a sibling `@utility form-checkbox__input`. The glyph is drawn via a single inline SVG (or `mask-image` + `background-color: var(--check-glyph)`).

**NOT recommended:** separate utilities per state (`form-checkbox--checked`, `form-checkbox--disabled`, etc.). That pattern duplicates the colour palette across every selector and forces consumers to manage state classes manually instead of letting the native attributes drive the visual.

---

## 7. Accessibility

| Requirement | How |
|---|---|
| **Label association** | Wrapping `<label>` (preferred) OR `<input id="x"> + <label for="x">`. Both supported; spec recommends wrapping for atomicity. |
| **`aria-checked`** | Auto-managed by the native `<input type="checkbox">`. Do NOT add manually. |
| **Indeterminate** | JavaScript-only state — set via `el.indeterminate = true`. The CSS rule keys off `:indeterminate`. There is no HTML attribute equivalent. The author should ship a one-liner Alpine snippet in the README usage example: `<input type="checkbox" x-init="$el.indeterminate = true">`. |
| **`aria-invalid`** | Set on the `<input>` to drive the invalid visual via `:has([aria-invalid="true"])` on the wrapper. Mirrors form-field. |
| **`aria-describedby`** | When hint text is present, the hint's `<span>` gets an `id` and the `<input>` gets `aria-describedby="<that id>"`. For error hint, the relationship is the same; screen readers will announce the hint after the label. |
| **Required marking** | Both the `required` attribute on `<input>` AND a visible asterisk on the label (`<span class="form-checkbox__required" aria-hidden="true">*</span>`). Matches the form-field decision (`questions.md` #21). |
| **Touch target ≥ 24 × 24 px** | WCAG 2.5.8. The `<label>` wrapper extends the click area via padding (see §5.1). For S (16) and M (20), `padding-block: --spacing-1` (4 px) brings the row to ≥24 px. L (24) needs none. |
| **Focus indicator ≥ 3:1** | The 4 px `Focus/Primary` glow alone is `1.4:1` against white (FAIL). The shell adds a 2 px solid outline in `deepEmeraldGreen.500` (`9.83:1` PASS). For error: 2 px solid `rose.700` (`6.37:1` PASS). |
| **Border contrast (UI components, WCAG 1.4.11)** | Default unchecked border requires ≥3:1. `slateBlue.300` at `2.23:1` FAILS. Spec recommends `slateBlue.500` (`4.39:1` PASS) — see OQ-CB-3. Disabled border is exempt from 1.4.11 per WCAG. |
| **Group association** | `<fieldset>` + `<legend>` for multi-checkbox groups (§5.3). |
| **Color is not the sole indicator** | Checked state has the check glyph (shape, not just colour). Indeterminate has the bar. Error state has the hint text (text + colour). All compliant. |

---

## 8. Implied interactions

- Click anywhere on the `<label>` toggles the checkbox — native HTML behaviour.
- Pressing `Space` while focused toggles the checkbox — native HTML behaviour.
- Tabbing focuses the `<input>`; the wrapper's `:has(:focus-visible)` paints the focus ring.
- Indeterminate is a programmatic state only — clicking a checkbox in indeterminate state collapses it to checked (the browser default). Document this in the README so consumers don't expect the indeterminate visual to "stick".

---

## 9. Tokens used

By name only — values live in `design-tokens/tokens.resolved.json` and `src/css/theme.css`.

**Colors**

- `colors.white`
- `colors.slateBlue.100` (disabled border)
- `colors.slateBlue.200` (disabled-checked glyph)
- `colors.slateBlue.300` (Figma-default unchecked border — superseded by 500 per OQ-CB-3)
- `colors.slateBlue.400` (recommended disabled label color, hint text color)
- `colors.slateBlue.500` (WCAG-corrected unchecked border — recommended)
- `colors.slateBlue.700` (label color)
- `colors.neutral.100` (hover-unchecked bg)
- `colors.deepEmeraldGreen.200` (checked / indeterminate fill, hover-unchecked border)
- `colors.deepEmeraldGreen.500` (focus outline, primary)
- `colors.blue.400` (focus border, unchecked)
- `colors.rose.500` (invalid border)
- `colors.rose.700` (invalid focus outline, invalid hint text)

**Typography**

- `typography.text-sm/leading-5/font-medium` (label, size S)
- `typography.text-base/leading-6/font-medium` (label, size M)
- `typography.text-lg/leading-7/font-medium` (label, size L)
- `typography.text-xs/leading-4/font-normal` (hint, size S — pending OQ-CB-9)
- `typography.text-sm/leading-5/font-normal` (hint, size M)
- `typography.text-base/leading-6/font-normal` (hint, size L)

**Spacing**

- `spacing.0.5` (box top-padding for baseline alignment)
- `spacing.1` (label wrapper padding for touch target on S/M)
- `spacing.2` (gap S; group gap)
- `spacing.2.5` (gap M / L)

**Border-radius**

- `borderRadius.base` (4 px)

**Shadows**

- `boxShadow.Focus/Primary` (4 px ring, primary)
- `boxShadow.Focus/Error` (4 px ring, invalid)

**Spacing for sizes (raw — drives `--check-size`)**

- `spacing.4` = 16 px (S)
- `spacing.5` = 20 px (M)
- `spacing.6` = 24 px (L)

---

## 10. Auto-layout rules (Figma → CSS)

| Figma frame | CSS equivalent |
|---|---|
| `Checkbox` outer (e.g. `1420:31241`) — `flex items-start gap-[10px]` | `display: inline-flex; align-items: flex-start; gap: var(--check-gap);` |
| `Input` inner wrapper (e.g. `1420:31242`) — `pt-[2px]` when label is present | `padding-top: var(--spacing-0\\.5);` only on stacked / labeled variants. None for stand-alone box. |
| `Base/_CheckRadio` (the box) — `size-[20px] rounded-[4px] border` | `width / height: var(--check-size); border-radius: var(--check-radius); border: 1px solid var(--check-border);` |
| `Checkmark (Stroke)` — `size-[10px]` centered | `width / height: var(--check-glyph-size); position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);` (if drawn as inline SVG inside the input wrapper) |
| `Label and hint text` — `flex flex-col items-start min-w-0 flex-1` | `display: flex; flex-direction: column; align-items: flex-start; min-width: 0; flex: 1;` |

---

## 11. Dimensions at each breakpoint

The checkbox is intrinsically sized — no responsive variation. Sizes S/M/L are content-driven (consumer chooses). However:

- **Mobile (≤640 px):** spec recommends Size M as the default, with the wrapping `<label>` padding bringing the touch target to ≥44 px (Apple HIG / Material) where space allows.
- **Tablet (640–1024 px):** Size M default; Size L for high-prominence forms (e.g. checkout terms acceptance).
- **Desktop (≥1024 px):** Size M default; Size S for dense data tables.

---

## 12. Open questions

All numbered against `design-tokens/questions.md`, dated `2026-05-08`. Cross-referenced inline as **OQ-CB-#** above.

- **OQ-CB-1** (`#28`) — Indeterminate state colours and glyph treatment.
- **OQ-CB-2** (`#29`) — Invalid / aria-invalid state visual (border colour, fill behaviour for invalid-checked).
- **OQ-CB-3** (`#30`) — Default unchecked border: `slateBlue.300` (Figma) vs `slateBlue.500` (WCAG-correct).
- **OQ-CB-4** (`#31`) — Disabled-Checked rendering: white box + slate-blue-200 glyph (Figma) vs faded emerald (alt).
- **OQ-CB-5** (`#32`) — Disabled label colour: stay at `slateBlue.700` (Figma) vs drop to `slateBlue.400`.
- **OQ-CB-6** (referenced inline) — Touch target padding for S / M sizes.
- **OQ-CB-7** (`#33` part a) — Glyph SVG: confirm Heroicons `check` is canonical, and confirm S-size glyph dimensions.
- **OQ-CB-8** (referenced inline) — Confirm 2 px solid outline strategy is acceptable for the checkbox focus state (matches form-field).
- **OQ-CB-9** (`#33` part b) — Hint typography for Size S: spec proposes `text-xs/leading-4/font-normal` by extrapolation; confirm.

---

## 13. References

- Figma node `1420:30806` (component set).
- `design-tokens/tokens.resolved.json` — token source of truth.
- `design-tokens/accessibility-review.md` — WCAG audit table (form-checkbox row to be added under OQ-CB-3 if accepted).
- `components/form-field/A-basic/spec.md` — sibling atom; same shell architecture.
- `components/form-field/A-basic/src/web/tailwind/components/form-field.css` — reference implementation pattern.
