# Form field — A-basic — spec

Figma-extracted spec for the PHPure Golf base form field (atom). Token names reference `design-tokens/tokens.resolved.json`. **Do not reproduce hex values** — resolve token names via the theme.

---

## 1. Overview

**Purpose.** The foundational single-line input shell that every concrete input type (text, email, password, search, currency, phone, select, datepicker, stepper, IBAN, etc.) composes *inside*. Renders a bordered, radiused, flex-row container that wraps a bare `<input>` and optional leading/trailing slots.

**Figma nodes cited:**

| Node | Role | Colon form | Dash form |
|---|---|---|---|
| Base shell ("Base/_Input field {base}") | Defines border, background, padding, radius, focus ring, per-state and per-feedback styling. Source of truth for the `form-field` CSS. | `1329:15249` | `1329-15249` |
| Variants catalog ("Input field") | 1,152+ leaf variants combining `Type × State × Feedback × Label × Leading icon × Trailing icon × Hint text`. Source of truth for the HTML composition rules that sit *inside* the shell. | `1331:14308` | `1331-14308` |

**Figma file key:** `YlKyhwcdYEa41gK1BSs4AZ`

**Architecture (confirmed with designer in chat, 2026-04-24):**

- One base utility → `@utility form-field` — the shell. Covers default/hover/focus/disabled/error/warning/success/readonly styling, border, background, padding, radius, typography reset.
- One bare input utility → `@utility form-field__input` — removes native input chrome so the shell owns the visual.
- **Every variant in node `1331:14308` is HTML composition inside the shell, not a new utility.** Leading/trailing icons, prefix/suffix text, dropdowns, stepper buttons, visibility toggles, datepicker triggers — they sit as children of the shell, not as CSS variants. Any variant that would require a NEW CSS class is logged to `questions.md`.

---

## 2. Decision log — author must answer before implementing

1. **Focus-within vs focus.** The shell's focus styling is triggered by the *input inside* receiving focus, not by the shell itself. Author must use `:focus-within` on the shell wrapper. Confirmed by design: the focus state in Figma (`1331:14355`) shows the whole shell getting the blue border + focus ring when the inner input has focus.
2. **Feedback states are modifier classes, not Alpine-driven.** `error / warning / success` are applied by the server or surrounding Alpine x-data — the shell CSS just reacts to a modifier class (e.g. `form-field--error`). This is how Hyvä default theme handles invalid inputs already.
3. **Typography tokens reference weights from Figma.** Input text = `text-base/leading-6/font-normal` (16 px / 24 px / 500 — DM Sans Medium per `tokens.resolved.json`). Label = `text-sm/leading-5/font-medium` (14 px / 20 px / originally Demi 600 in Figma, resolved to DM Sans 500 per override). **See open question OQ-3 below — this is the same Demi/600 mismatch as Q#8 in `questions.md`.**
4. **Border radius.** Figma renders the shell at `rounded-[2px]` (2 px). That maps to token `borderRadius.sm = 0.125rem` in `tokens.resolved.json`. Author uses the `sm` token, not an arbitrary value.
5. **Border width.** Figma shows `border` (1 px) in all states — no width change on hover/focus/error. Author keeps 1 px uniformly.
6. **Prefix/dropdown segments have their own backgrounds and borders.** `Leading text` and `Leading dropdown` variants render the shell with NO padding — the shell becomes a flex container, and the prefix block + text-input block each have their own padding, border, and rounded corners. This is compositional — the shell CSS must support both "full-padding" (default) and "zero-padding segmented" modes. See §6.3 / §6.5 below.
7. **Icon library.** Uses the same Heroicons mapping as the Button spec — see Q#12 in `questions.md`. Not blocking for shell styling but blocking for variant rendering.

---

## 3. Base shell spec (Figma `1329:15249`)

Dimensions extracted from Figma variants `1329:15248` (default), `1329:15307` (error), `1329:15371` (warning), `1329:15419` (success).

### 3.1 Dimensions (single-line)

| Property | Value | Token |
|---|---|---|
| Height | 40 px | `10` (= `2.5rem`) |
| Width | 100 % of parent | — |
| Border width | 1 px | — |
| Border radius | 2 px | `borderRadius.sm` |
| Padding (inline) | 14 px | — (closest is `3.5` = `0.875rem` = 14 px → use `spacing.3.5`) |
| Padding (block) | 10 px | `2.5` (= `0.625rem` = 10 px) |
| Inner gap (between icon and input text) | 6 px | `1.5` (= `0.375rem` = 6 px) |

### 3.2 Colors & typography (default state, feedback = None)

| Role | Token |
|---|---|
| Background | `base.white` |
| Border | `slateBlue.300` |
| Input/placeholder text | `slateBlue.500` |
| Leading / trailing icon stroke | `blue.400` *(see OQ-1)* |
| Text style (input content) | `text-base/leading-6/font-normal` |

### 3.3 Wrapper spec (label + hint text around the shell)

From base node `1329:15248`. The shell alone does NOT render the label or hint — those are siblings of the shell inside an outer wrapper (the `Input with label` frame in Figma).

| Element | Style token | Color token | Spacing |
|---|---|---|---|
| Outer wrapper | `flex flex-col items-start gap-1.5` | — | `gap-1.5` = 6 px |
| Label text | `text-sm/leading-5/font-medium` (Figma Demi 600, resolved to DM Sans per override — see OQ-3) | `slateBlue.700` | margin-bottom = 6 px (via gap) |
| Hint text (default) | `text-sm/leading-5/font-normal` | `slateBlue.500` | margin-top = 6 px (via gap) |
| Hint text (error) | `text-sm/leading-5/font-normal` | `rose.500` | — |
| Hint text (warning) | `text-sm/leading-5/font-normal` | `amber.500` | — *(see OQ-2)* |
| Hint text (success) | `text-sm/leading-5/font-normal` | `emerald.500` | — *(see OQ-2)* |

Hint-text color follows the field's feedback state (see §4).

---

## 4. States — shell colors per state × feedback

Each cell is a **token name** from `tokens.resolved.json`. "—" means the state doesn't change that property vs default.

### 4.1 `Feedback = None` (no validation applied)

Extracted from `1331:14307` (Placeholder), `1331:14309` (Hover), `1331:14355` (Focus), `1331:14331` (Active), `1331:14343` (Filled), `1331:14367` (Disabled).

| State | Background | Border | Text | Focus ring (box-shadow) |
|---|---|---|---|---|
| Placeholder (default) | `base.white` | `slateBlue.300` | `slateBlue.500` | none |
| Hover | `base.white` | `blue.300` | `slateBlue.500` | none |
| Focus *(focus-within)* | `base.white` | `blue.400` | `slateBlue.500` | `Focus/Primary` |
| Active | `base.white` | `deepEmeraldGreen.500` | `slateBlue.500` | none |
| Filled *(input has a value)* | `base.white` | `slateBlue.300` | `slateBlue.800` | none |
| Disabled | `slateBlue.50` | `slateBlue.200` | `slateBlue.400` | none |

**Note.** "Active" in Figma = the field is currently being interacted with (mouse down / keypress) — it gets a `deepEmeraldGreen.500` border. "Filled" = the input has a committed value but is not focused — text color changes from placeholder (`slateBlue.500`) to filled (`slateBlue.800`), border stays at the default `slateBlue.300`.

### 4.2 `Feedback = Error`

Extracted from `1329:15307` and `1331:29647`.

| State | Background | Border | Text | Focus ring | Icon color |
|---|---|---|---|---|---|
| Placeholder | `base.white` | `rose.500` | `slateBlue.500` | none | `rose.400` *(trailing alert icon)* |
| Focus | `base.white` | `rose.500` | `slateBlue.500` | `Focus/Error` | `rose.400` |
| Disabled | `slateBlue.50` | `slateBlue.200` | `slateBlue.400` | none | — |

### 4.3 `Feedback = Warning`

Extracted from `1331:32305` and `1329:15371`.

| State | Background | Border | Text | Focus ring | Icon color |
|---|---|---|---|---|---|
| Placeholder | `base.white` | `amber.500` | `slateBlue.500` | none | `amber.400` |
| Focus | `base.white` | `amber.500` | `slateBlue.500` | `Focus/Warning` | `amber.400` |
| Disabled | `slateBlue.50` | `slateBlue.200` | `slateBlue.400` | none | — |

### 4.4 `Feedback = Success`

Extracted from `1331:36651` and `1329:15419`.

| State | Background | Border | Text | Focus ring | Icon color |
|---|---|---|---|---|---|
| Placeholder | `base.white` | `emerald.500` | `slateBlue.500` | none | `emerald.400` |
| Focus | `base.white` | `emerald.500` | `slateBlue.500` | `Focus/Success` | `emerald.400` |
| Disabled | `slateBlue.50` | `slateBlue.200` | `slateBlue.400` | none | — |

### 4.5 Readonly

**Not present in Figma as an explicit state.** Author should use the Disabled styling (`bg: slateBlue.50`, `border: slateBlue.200`, `text: slateBlue.400`) for readonly inputs, minus the cursor change. Log confirmation needed — see OQ-5.

---

## 5. Sizes

**Figma base node exposes only one size.** All variants in `1329:15249` and `1331:14308` render at the same `h-[40px]` / `px-[14px] py-[10px]` / `text-[16px]` values. There is no S/M/L variant axis on the form field. Author implements one size only.

If a smaller "dense" field is later needed, it has to come from a separate Figma node — log a new question.

---

## 6. Variants catalog — composition patterns inside the shell (Figma `1331:14308`)

Variant axes in `1331:14308`:
- `Type` ∈ { `Default`, `Leading dropdown`, `Trailing dropdown`, `Leading text` }
- `State` ∈ { `Placeholder`, `Hover`, `Focus`, `Active`, `Filled`, `Disabled` }
- `Feedback` ∈ { `None`, `Error`, `Warning`, `Success` }
- `Label` ∈ { `True`, `False` }
- `Leading icon` ∈ { `True`, `False` } *(only for `Type = Default`)*
- `Trailing icon` ∈ { `True`, `False` } *(only for `Type = Default`)*
- `Hint text` ∈ { `True`, `False` }

Total symbol count scanned = 1,152+ leaves. They reduce to the 5 composition patterns below plus the slot toggles (label, icons, hint). The `Type` axis corresponds directly to HTML composition, not to new CSS classes.

### 6.1 Plain text input *(Type = Default, no leading/trailing slot)*

- **Representative Figma node:** `1331:14307`.
- **Slots used:** center-input only.
- **Children:** `<input type="text">` bare inside `form-field__input`.
- **Extra tokens:** none beyond shell.
- **JS required:** no.
- **Maps to HTML input types:** `text`, `email`, `number`, `tel`, `url`, `search` — all differ only by the `type` attribute; the visual is identical.

### 6.2 Default input with leading AND/OR trailing icons *(Type = Default, Leading icon or Trailing icon = True)*

- **Representative Figma nodes:**
  - Leading icon only → `1331:15633`
  - Trailing icon only → `1331:15765`
  - Both → `1331:15903`
- **Slots used:** leading (24 × 24 px icon, extracted from `1329:15233`), center-input, trailing (20 × 20 px icon, extracted from `1329:15238`).
- **Size note:** The leading icon in the base is **24 × 24 px** (`size-[24px]`) but the trailing icon is **20 × 20 px** (`size-[20px]`). This asymmetry is intentional in Figma — author preserves it. *(See OQ-4 — looks like an authoring anomaly worth flagging.)*
- **Children:** icon `<svg>` in leading slot, `<input>` center, icon `<svg>` in trailing slot.
- **Gap between icon and input text:** 6 px (`spacing.1.5`).
- **JS required:** no (icons are static).
- **Maps to HTML patterns:** search input (magnifier leading icon), password reveal (eye trailing icon — **but see 6.6**), email (envelope leading icon), URL (globe leading icon).

### 6.3 Leading text prefix *(Type = Leading text)*

- **Representative Figma node:** `1331:14835`.
- **Slots used:** prefix (leading text block), center-input.
- **Structure:**
  - Outer shell: NO border, NO padding — becomes a naked flex-row container.
  - Prefix block (`I1331:14836;1329:15298`): own `bg: slateBlue.50`, own border (`slateBlue.300`, 1 px), own radius (`rounded-sm`), own padding (`pl-3.5 pr-3` + `py-2.5`), own typography (`text-base/leading-6/font-normal`, color `slateBlue.500`).
  - Input block: own `bg: base.white`, own border (`slateBlue.300`, 1 px), own radius, own padding (`pl-3 pr-3.5 py-2.5`), `<input>` inside.
- **Extra tokens:** all already in the shell's palette — prefix bg = `slateBlue.50`, which matches the Disabled state bg. No new tokens introduced.
- **JS required:** no.
- **Maps to HTML patterns:** URL input with `https://` prefix, currency input with `$` / `€` / `kr` prefix, IBAN with country code prefix, phone input where the prefix is a fixed string (for selectable prefix see §6.5).

### 6.4 Trailing text suffix

- **Not explicitly represented** as a `Type` variant in Figma (no `Type = Trailing text`). **But** the screenshot of `1329:15249` shows a symmetric pattern: leading text on the left OR right of the input. Author decision: implement a `form-field` with a trailing-text slot using the SAME CSS rules as the leading-text prefix (same tokens, just flipped padding). *(See OQ-6 — flag to confirm.)*
- **Slots used:** center-input, suffix.
- **Children:** `<input>` in center, text node in suffix.
- **JS required:** no.
- **Use cases:** unit suffix (`kg`, `cm`, `%`), currency code suffix (`EUR`, `USD`).

### 6.5 Leading dropdown *(Type = Leading dropdown)*

- **Representative Figma node:** `1331:14379`.
- **Slots used:** leading dropdown block, center-input.
- **Structure:**
  - Outer shell: border present, NO inline padding (the children own their padding).
  - Dropdown block (`I1331:14380;1329:15265`): flex-row with `gap-1`; contains an "XX" text node (`text-base/leading-6/font-normal`, color `slateBlue.700`) + a 20 × 20 px chevron-down icon (`Icon/Solid/chevron-down`). Padding `pl-3.5 pr-3 py-2.5`. **No background, no border on the block itself.**
  - Input block: flex-1, padding `pl-0 pr-3.5 py-2.5`, `<input>` inside.
- **Extra tokens used:** `slateBlue.700` for dropdown text (different from input text's `slateBlue.500`). All other tokens already in shell palette.
- **JS required:** **yes** — the dropdown has to open a list. Use Alpine.js `x-data` with `{ open: false }`, keyboard navigation, `@click.outside`. Can use a native `<select>` if the design doesn't demand custom styling inside the dropdown menu (confirmed in OQ-7).
- **Use cases:** country code + phone number, currency selector + amount, unit selector + value.

### 6.6 Trailing dropdown *(Type = Trailing dropdown)*

- **Representative Figma node:** `1331:14601`.
- **Same structure as 6.5 but with dropdown block on the right** and input block with `pl-3.5 pr-0 py-2.5`.
- **Padding on dropdown block:** `px-3.5 py-2.5`.
- **JS required:** yes (same as 6.5).
- **Use cases:** amount + currency code, value + unit selector.

### 6.7 Plain select *(no input — just the dropdown)*

- **Not a dedicated Type in Figma** — achievable via the `Leading dropdown` or `Trailing dropdown` with the center-input slot left empty, OR by using the shell with a bare `<select>` inside `form-field__input` and a chevron icon in the trailing slot.
- **Author recommendation:** use the second approach — `form-field > select.form-field__input + chevron-icon` — so native `<select>` semantics and keyboard behavior are preserved.
- **JS required:** no (native select).
- **Use cases:** single-choice field (country, category, size).

### 6.8 Password with visibility toggle

- **Not a dedicated Type in Figma.** Composed from `Type = Default` + trailing icon slot.
- **Structure:** `form-field > input[type=password] + button[type=button]` where the button holds an eye / eye-slash icon.
- **JS required:** **yes** — Alpine `x-data="{ shown: false }"`, `x-bind:type="shown ? 'text' : 'password'"`, `@click="shown = !shown"`.

### 6.9 Stepper *(number input with - / + buttons)*

- **Not a dedicated Type in Figma's `1331:14308` set.** The extracted variants catalog does not contain a stepper Type. This means the stepper either (a) lives in a different Figma file/page, (b) is composed client-side from `Type = Leading dropdown` and `Type = Trailing dropdown` replaced with button blocks, or (c) has not been designed yet.
- **Author decision required** — see OQ-8. **Do not invent a stepper design.** If the dev team needs one before OQ-8 is answered, compose it as: `form-field > button.form-field-stepper-minus + input[type=number].form-field__input + button.form-field-stepper-plus`, styled with the same tokens as the shell. Log the composition for later review.
- **JS required:** yes (Alpine: `x-data="{ v: 0 }"`, `@click` on - / +, `x-model` on input).

### 6.10 Datepicker

- **Not a dedicated Type in Figma's `1331:14308`.** Composed from `Type = Default` + trailing calendar icon.
- **JS required:** yes — depends on which date picker library the dev team picks (native `<input type="date">`, Flatpickr, litepicker, etc.). This is a dev-team-side decision — not styling. See OQ-9.

### 6.11 Currency / formatted input (IBAN, credit card)

- **Not a dedicated Type in Figma.** Composed from `Type = Default` (with or without leading prefix) + JS to mask the input.
- **JS required:** yes — input masking library decision is dev-team-side. See OQ-9.

---

## 7. Label / helper / error text wrapper (the `form-group` molecule)

From Figma base `1329:15249`, the labeled + hint-text wrapper is a 3-row flex-column:

```
+-------------------------------+
| Label           (text-sm/demi)| ← slateBlue.700
+-------------------------------+
| [ form-field shell ]          |
+-------------------------------+
| Hint text       (text-sm/med) | ← color depends on feedback
+-------------------------------+
```

- **Wrapper:** `flex flex-col items-start gap-1.5 w-full`.
- **Label:** `text-sm/leading-5/font-medium`, color `slateBlue.700`, full width.
- **Hint text:** `text-sm/leading-5/font-normal`, color follows feedback (see §3.3 table).
- **Required indicator:** not shown in Figma. Author should either (a) append a red asterisk `<span aria-hidden="true">*</span>` after the label text, styled `rose.500`, or (b) rely on the `required` HTML attribute for screen readers. See OQ-10.

This wrapper is a **separate molecule**, not part of the `form-field` atom. It should live at `components/form-group/A-basic/` when built. For now the spec is documented here so the author can scaffold it alongside.

---

## 8. Accessibility

Mandatory for every concrete variant:

1. **Label association.** `<label for="{id}">` paired with `<input id="{id}">`, or a wrapping `<label>` around both the text and the shell. Hyvä default pattern is `for=`-based.
2. **`aria-invalid="true"`** on the input when feedback = error.
3. **`aria-describedby="{hint-id}"`** on the input, pointing to the hint-text id, so errors/warnings/successes are announced.
4. **`aria-disabled="true"`** OR (preferably) the native `disabled` attribute on the input. Hyvä uses native `disabled`.
5. **`aria-required="true"`** OR native `required`. Native preferred.
6. **Visible focus ring** — the `:focus-within` shell border + `Focus/Primary` box-shadow handles this.
7. **Placeholder is NOT a label.** Never rely on placeholder as the only label. Hint text is fine for supplemental info but needs `aria-describedby`.

Per the Hyvä default theme's form pattern (referenced — not from the UI kit, since kit has no `form/` folder): inputs use `<label for>`+`<input id>` and `<input>` elements render with class `form-field__input` inside a `form-field` wrapper `<div>`.

---

## 9. Auto-layout rules

For the shell (`form-field`):

- **Direction:** `row`.
- **Align items:** `center` (all children vertically centered).
- **Gap between children:** 6 px (`spacing.1.5`).
- **Overflow:** `hidden` on the shell (Figma uses `overflow-clip`) so the focus ring shows outside and long content clips inside.
- **Wrapping:** none — always single line.
- **min-width on the center-input:** `0` (`min-w-px` in the Figma output) so flex-shrink lets the input collapse when leading/trailing slots take their natural width.

For the label-wrapper (`form-group`):

- **Direction:** `column`.
- **Align items:** `start`.
- **Gap between rows:** 6 px (`spacing.1.5`).

---

## 10. Open questions

New questions raised by this extraction. To be appended to `design-tokens/questions.md` as entries 13–21. Cross-referenced as OQ-1 … OQ-9 below:

- **OQ-1.** `blue.400` is used as the color for the leading/trailing icons in the base shell (`1329:15248`). But the icons in the variant screenshots appear in slate/grey — this `blue.400` may only be the placeholder "question mark" preview icon in Figma, not the actual production icon color. Confirm: should icons inherit `currentColor` from the input text (`slateBlue.500`) or render in a fixed `blue.400`? → **Questions.md #13.**
- **OQ-2.** The hint-text color for `warning` / `success` feedback is not explicitly extracted from a Figma variant — it is inferred by symmetry with `error` (`rose.500`). The hint text in Figma for these variants is rendered but its color variable wasn't captured cleanly. Confirm the exact tokens: warning → `amber.500`? success → `emerald.500`? → **Questions.md #14.**
- **OQ-3.** Label typography token (`text-sm/leading-5/font-medium`) stores Figma-original Demi/600 weight but the resolved font-family is DM Sans. `tokens.resolved.json` normalizes that slot to weight 400/500. Which weight wins for the label? Same question as questions.md #8 (Button Demi mismatch). → **Cross-ref questions.md #8.**
- **OQ-4.** Leading icon is 24 × 24 px, trailing icon is 20 × 20 px in the base shell (`1329:15233` vs `1329:15238`). Intentional asymmetry or Figma authoring oversight? → **Questions.md #15.**
- **OQ-5.** `readonly` as a state isn't represented in Figma. Does it render identical to `disabled`? → **Questions.md #16.**
- **OQ-6.** Figma has `Type = Leading text` but no `Type = Trailing text`. Is a trailing-text suffix allowed? If yes, mirror the leading-text styling? → **Questions.md #17.**
- **OQ-7.** Leading/Trailing dropdown variants — should the dropdown be a styled native `<select>` or a fully custom Alpine dropdown with arbitrary menu content? → **Questions.md #18.**
- **OQ-8.** No stepper variant found in `1331:14308`. Does a stepper design exist elsewhere, or should the author propose a composition? → **Questions.md #19.**
- **OQ-9.** Datepicker / currency-mask / IBAN formatting — what libraries should the dev team wire in? (Styling side is this spec; behavior is theirs.) → **Questions.md #20.**
- **OQ-10.** Required-field indicator: red asterisk on the label, or rely on HTML `required` + browser affordance? → **Questions.md #21.**
