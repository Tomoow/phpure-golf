# Accessibility review — 2026-04-24

**Scope:** `buttons/A-basic`, `form-field/A-basic`, `dropdown-list/A-basic`.
**Standard:** WCAG 2.2 AA + WAI-ARIA 1.2.
**Reviewer:** `accessibility-lead` methodology (Community-Access/accessibility-agents).
**Inputs reviewed:** each component's CSS, `preview.html`, and README; plus
`src/js/phone-input.js`, `src/js/country-selector.js`, and `src/css/theme.css`
for the color tokens used in the contrast computation.

---

## Executive summary

- **Total findings: 26** — **5 Critical**, **9 Serious**, **7 Moderate**, **5 Minor**.
- Verdicts at WCAG 2.2 AA:
  - `buttons/A-basic`: **PASS-with-caveats.** Core visuals and semantics are solid. Hover/disabled contrast for the primary and the tertiary-disabled border are the main gaps. Safe to adopt once those are resolved.
  - `form-field/A-basic`: **FAIL.** Multiple critical issues in the composed variants (country-selector uses `role="listbox"` on a `<button>`; phone country-trigger nested inside a `<button>`-posing-as-label parent; invalid `<span class="form-field__input">` markup; nested `<button>`). Contrast fails on default border, warning/success, and focus-ring indicator.
  - `dropdown-list/A-basic`: **FAIL.** The full WAI-ARIA combobox pattern is not wired: trigger has no `aria-controls`, no `aria-activedescendant`, options have no ids, keyboard events are routed through a brittle `preview:toggle` proxy and Example 2's `<li>`s are stamped twice. Contrast for disabled items and the selected check-glyph falls below AA.

### Top 3 issues to fix before Phase 2

1. **A11Y-001 (Critical)** — `form-field/A-basic` composed combobox triggers are `<button class="form-field">` wrappers that contain nested `<button>` (password toggle, phone country picker, stepper), a nested `<input>` (phone), and a `<span class="form-field__input">` used as the visible label. Nested interactive controls and a button that contains an input are invalid HTML and break keyboard and AT behavior.
2. **A11Y-002 (Critical)** — `form-field/A-basic`'s country selector and size selector use the shell `<button class="form-field">` as a combobox but never expose `aria-controls` / `aria-activedescendant`, never receive focus back on close, and reuse `role="listbox"` on a `<ul>` that has no id and is not referenced. Users on screen readers cannot perceive the widget as a combobox.
3. **A11Y-003 (Critical)** — `dropdown-list/A-basic` Example 2 renders `<li>` options twice: once inside `x-for="(item, index) in items"` and again as the static `hidden` seed list. Both sets live inside `role="listbox"`, so screen readers enumerate duplicates; `hidden` is overridden in some AT. Also, each rendered option lacks a stable `id` so the combobox pattern (`aria-activedescendant`) cannot be implemented.

---

## Findings (by severity)

### Critical (blocks users)

#### A11Y-001 — Nested interactive controls / invalid button children
- **Component:** `form-field/A-basic`
- **Files:**
  - `components/form-field/A-basic/preview.html:541-562` (country selector — `<button class="form-field">` containing `<span class="form-field__input">` and SVG affixes)
  - `components/form-field/A-basic/preview.html:496-535` (phone — `<button class="form-field__affix">` nested inside a `.form-field` that also contains an `<input type="tel">`; the trigger button itself contains spans and SVGs — OK, but the outer behavior confuses AT because the country trigger and phone input are siblings in a row that also claims combobox behavior via `aria-haspopup` on the button only)
  - `components/form-field/A-basic/preview.html:597-610` (size selector — `<button class="form-field">` with `<span class="form-field__input">` child)
  - `components/form-field/A-basic/preview.html:773-786` (interactive sample select — same pattern)
- **WCAG:** 4.1.2 Name, Role, Value (Level A); 1.3.1 Info and Relationships (Level A); HTML spec (content model).
- **Issue:** Native `<button>` content model forbids interactive descendants and forbids descendants of `<input>`. The country / size selectors put a `<span class="form-field__input">` inside a button to pose as the value area. Spans can't behave as inputs and screen readers will flatten the label. For the password and stepper variants, a `<button class="form-field__affix">` sits inside a `.form-field` `<div>` — that is valid — but the `<button class="form-field__affix">` inside the country-trigger `<button>` of the phone picker creates a nested-button situation (preview.html:500–512 wraps a `<button>` inside a `.form-field` `<div>`, not another button, so that one is OK; the country-selector at line 544 and size-selector at 597 are the real offenders).
- **Impact:** Screen reader users and keyboard-only users cannot reliably read or activate the control. Firefox and Safari assistive trees collapse the inner label; the announced role is "button" with no accessible name of the chosen value in some AT combinations.
- **Fix:** Change the combobox pattern from `<button class="form-field">` to the ARIA 1.2 combobox pattern — a `<div class="form-field" role="combobox">` wrapper with an inner focusable `<input readonly>` (or a `<button>` that is a sibling of the displayed value, not its parent). Or use the `role="combobox"` on the input itself with `aria-expanded` / `aria-controls` / `aria-activedescendant`. Remove `<span class="form-field__input">`; use an actual `<input>`.
- **Confidence:** High.

#### A11Y-002 — Combobox pattern incomplete (no `aria-controls` / `aria-activedescendant` / option ids)
- **Component:** `form-field/A-basic`, `dropdown-list/A-basic`
- **Files:**
  - `components/dropdown-list/A-basic/preview.html:288-325` (Example 2 trigger lacks `aria-controls`, options lack stable ids for `aria-activedescendant`)
  - `components/dropdown-list/A-basic/preview.html:373-427` (Example 3 — same gaps)
  - `components/form-field/A-basic/preview.html:500-534` (phone picker — same)
  - `components/form-field/A-basic/preview.html:544-587` (country selector — same; also search input has no `aria-controls` pointing at the listbox)
  - `components/form-field/A-basic/preview.html:597-619` (size selector — same)
  - `components/form-field/A-basic/preview.html:773-794` (interactive sample — same)
  - `components/dropdown-list/A-basic/src/web/js/dropdown-list.js:40-62` (no id generation for option elements in `init()`)
- **WCAG:** 4.1.2 Name, Role, Value (Level A); WAI-ARIA 1.2 combobox pattern.
- **Issue:** The combobox pattern requires: trigger has `aria-haspopup="listbox"` (present), `aria-expanded` (present), `aria-controls="<listbox-id>"` (**missing everywhere**), and the trigger tracks the active descendant via `aria-activedescendant="<option-id>"` (**missing everywhere**). Options must have stable `id`s (**missing**). `activeIndex` is tracked in Alpine but never propagated to any ARIA attribute — the screen reader cannot follow keyboard navigation.
- **Impact:** Screen reader users cannot perceive "Pressing Down Arrow moved focus to 'Banana'." Users hear only that the button is expanded.
- **Fix:** Generate a unique `listbox-id` and option ids on mount. Add `:aria-controls="listboxId"` to the trigger, `:id` on each `<li>`, and `:aria-activedescendant="activeOptionId"` on the trigger (or on the listbox if focus stays there).
- **Confidence:** High.

#### A11Y-003 — Duplicate `<li>` options inside the same `role="listbox"`
- **Component:** `dropdown-list/A-basic`
- **Files:**
  - `components/dropdown-list/A-basic/preview.html:301-348` (Example 2): the `x-for` template renders one set of options from `items`, AND the "static fallback" 6 options (with `hidden`) are real DOM children of the same `<ul role="listbox">`.
- **WCAG:** 4.1.2 Name, Role, Value (Level A); 1.3.1 Info and Relationships (Level A).
- **Issue:** `hidden` hides from visual and from AT, but when `x-for` clones those items and Alpine's `init()` reads the same seed list, the result is a listbox with up to 12 option elements (6 hidden + 6 rendered), confusing assistive tech that ignores `hidden` and confusing automated testers. The preview comment claims "Once init runs, x-for above re-renders from `items`" — but the seed `<li>`s remain in the DOM. Additionally, the `x-text` inside the template reads `item.el.querySelector('.dropdown-list__label').textContent` — a DOM-read from the very items that are supposed to be hidden, which is fragile.
- **Impact:** Some AT (VoiceOver on Safari, JAWS in virtual-cursor mode) will enumerate the hidden options. Users hear "6 items… Apple… Apple…"
- **Fix:** Pick ONE authoring mode — either the Alpine template renders from `items` and the seed `<li>`s are moved into a `<template>` tag (true inert seed), or the static `<li>`s are the real options and `x-for` is removed.
- **Confidence:** High.

#### A11Y-004 — `role="listbox"` misused on a `<button>` facade
- **Component:** `form-field/A-basic`
- **Files:**
  - `components/form-field/A-basic/preview.html:544-563` (country selector button carries `aria-haspopup="listbox"` but its child `<span class="form-field__input">` has `role` absent and is given the displayed value via `x-text`. The pattern is invalid: the button is a combobox trigger, but nothing inside it is the combobox editable surface.
  - `components/form-field/A-basic/preview.html:597-610` (size selector)
  - `components/form-field/A-basic/preview.html:773-786`
- **WCAG:** 4.1.2 Name, Role, Value (Level A); WAI-ARIA 1.2 `combobox` role.
- **Issue:** The ARIA 1.2 combobox pattern requires a single element with `role="combobox"`. A bare `<button>` with `aria-haspopup="listbox"` is a valid menu button, but the listbox panel below contains `<li role="option">` rows — which only makes sense as a listbox of the combobox. Mixing the two patterns means neither is correctly announced.
- **Impact:** Screen reader may announce "Select a country, button, collapsed" but never announce option selection changes.
- **Fix:** Either (a) treat this as a pure menu button + listbox pair (trigger announces "menu button"; that's fine, but then on open the list must receive focus), or (b) convert to a proper combobox with `role="combobox"` on a focusable `<input>` that the user could also type into (native combobox 1.2 pattern).
- **Confidence:** High.

#### A11Y-005 — No focus restoration / focus trap handling on dropdown close
- **Component:** `dropdown-list/A-basic`, `form-field/A-basic`
- **Files:**
  - `components/dropdown-list/A-basic/src/web/js/dropdown-list.js:86-91,278-283` (close / outside-click — no `triggerEl.focus()` call)
  - `components/form-field/A-basic/preview.html:543-586` (country selector close/`x-on:click.outside="close()"` — focus is not returned to the trigger)
  - `components/form-field/A-basic/preview.html:494-535` (phone country picker)
  - `components/form-field/A-basic/preview.html:593-619` (size selector)
  - `components/form-field/A-basic/preview.html:769-794` (interactive select)
- **WCAG:** 2.4.3 Focus Order (Level A); 2.1.2 No Keyboard Trap (Level A — close path).
- **Issue:** When the listbox closes (Escape, outside-click, or selection), focus is not returned to the trigger. The country-selector search input becomes focused on open but focus is not moved back when the user Escapes. In Example 2 the listbox `<ul tabindex="0">` is the focus target; after close, focus goes to `<body>`.
- **Impact:** Keyboard users lose their place in the form. Screen reader users lose context.
- **Fix:** On every close code path, call `this.$refs.trigger.focus()` (or equivalent). For the country-selector search, on open move focus into the search input; on close return to the country-selector button.
- **Confidence:** High.

### Serious

#### A11Y-006 — Focus ring has insufficient contrast against white
- **Component:** all three (and `src/css/theme.css`)
- **Files:**
  - `src/css/theme.css:309-312` (`--shadow-focus/primary: 0 0 0 4px #E1EBDD;` — computed contrast 1.23:1 vs white, see Contrast report)
  - `components/buttons/A-basic/src/web/tailwind/components/button.css:92-95` (only focus indicator)
  - `components/form-field/A-basic/src/web/tailwind/components/form-field.css:84-87`
- **WCAG:** 1.4.11 Non-text Contrast (Level AA); 2.4.7 Focus Visible (Level AA); 2.4.13 Focus Appearance (Level AAA, but the AA floor still applies to 1.4.11).
- **Issue:** All four focus-ring tokens are very pale pastels (computed 1.23–1.41:1 vs white). Under WCAG 2.4.13 guidance and 1.4.11, the focus indicator must contrast 3:1 against the adjacent color. The ring does not; the border color change is the only reliable indicator, and for buttons there is NO border change on focus — just the box-shadow.
- **Impact:** Keyboard users (including low-vision users) cannot see where focus is on buttons on a white page.
- **Fix:** Use a second, solid ring color (e.g., `deep-emerald-green-500` at 2px) alongside the pale halo, or darken the outer ring token to ≥3:1.
- **Confidence:** High.

#### A11Y-007 — Form-field default border contrast fails
- **Component:** `form-field/A-basic`
- **Files:**
  - `components/form-field/A-basic/src/web/tailwind/components/form-field.css:38` (`--field-border: var(--color-slate-blue-300)` — `#9DB0C2` on white = 2.23:1)
- **WCAG:** 1.4.11 Non-text Contrast (Level AA) — 3:1 required for UI component boundaries.
- **Issue:** The default form-field border is `slate-blue-300` #9DB0C2, contrast 2.23:1 against white — below the 3:1 threshold for UI components.
- **Impact:** Users with low vision cannot distinguish input boundaries from the page. This is one of the most-cited WCAG failures in enterprise audits.
- **Fix:** Promote the default border to `slate-blue-400` #7C96AD (3.08:1 — just passes) or, better, `slate-blue-500` #5B7C99 (4.39:1).
- **Confidence:** High.

#### A11Y-008 — Form-field warning / success border and hint text fail contrast
- **Component:** `form-field/A-basic`
- **Files:**
  - `components/form-field/A-basic/src/web/tailwind/components/form-field.css:297-309` (warning & success)
  - `components/form-field/A-basic/src/web/tailwind/components/form-field.css:356-361` (hint text colors)
- **WCAG:** 1.4.3 Contrast (Minimum, Level AA, 4.5:1 for text); 1.4.11 Non-text Contrast (Level AA).
- **Issue:** `amber-500` #F59E0B on white = 2.15:1 and `emerald-500` #10B981 on white = 2.54:1. Both the border (UI) and the hint text (small text) fail.
- **Impact:** Users with low vision cannot read success / warning feedback.
- **Fix:** Darken to `amber-700` #B45309 (4.74:1) and `emerald-700` #047857 (5.40:1) for hint text. Borders can remain at the 500 shades only if you also apply a distinct non-color indicator (icon) per 1.4.1.
- **Confidence:** High.

#### A11Y-009 — Error border just barely meets AA (3:1); hint text fails AA for small text
- **Component:** `form-field/A-basic`
- **Files:**
  - `components/form-field/A-basic/src/web/tailwind/components/form-field.css:290-295,352-354`
- **WCAG:** 1.4.3 (AA) 4.5:1 for small text; 1.4.11 (AA) 3:1 for UI.
- **Issue:** `rose-500` #F43F5E on white = 3.67:1. This passes 1.4.11 (UI component / large text), but fails 1.4.3 for the error **hint text** (form-group__hint--error is 14px and small).
- **Impact:** Error messages are the most safety-critical text in a form. Users with reduced contrast sensitivity cannot read the error reason.
- **Fix:** Use `rose-600` #E11D48 (4.83:1) or `rose-700` #BE123C for `form-group__hint--error`.
- **Confidence:** High.

#### A11Y-010 — Hover border contrast fails for form-field
- **Component:** `form-field/A-basic`
- **Files:**
  - `components/form-field/A-basic/src/web/tailwind/components/form-field.css:49` (`--field-hover-border: var(--color-blue-300)` — #93C5FD = 1.80:1)
- **WCAG:** 1.4.11 Non-text Contrast (Level AA).
- **Issue:** Hover border is lighter than the already-failing default — 1.80:1. Hover is a state-change indicator; users with color-vision deficits rely on it.
- **Impact:** Visible hover feedback is imperceptible to many.
- **Fix:** Use `blue-500` #3B82F6 (3.38:1) or darker.
- **Confidence:** High.

#### A11Y-011 — Focus border (blue-400) contrast fails
- **Component:** `form-field/A-basic`
- **Files:**
  - `components/form-field/A-basic/src/web/tailwind/components/form-field.css:50` (`--field-focus-border: var(--color-blue-400)` — #60A5FA = 2.54:1)
- **WCAG:** 1.4.11 Non-text Contrast (Level AA); 2.4.7 Focus Visible.
- **Issue:** Focus border is 2.54:1 — below the 3:1 floor. Combined with the failing focus ring (A11Y-006), there is no indicator that meets AA on the form field when focused.
- **Impact:** Keyboard users cannot see which field has focus.
- **Fix:** `blue-600` #2563EB (5.17:1) for the focus border, or darken the ring.
- **Confidence:** High.

#### A11Y-012 — Disabled text contrast fails inside form-field and dropdown-list
- **Component:** `form-field/A-basic`, `dropdown-list/A-basic`
- **Files:**
  - `components/form-field/A-basic/src/web/tailwind/components/form-field.css:54` (disabled color `slate-blue-400` on `slate-blue-50` bg = 2.74:1)
  - `components/dropdown-list/A-basic/src/web/tailwind/components/dropdown-list.css:97` (`--item-color: slate-blue-300` on white = 2.23:1)
- **WCAG:** 1.4.3 Contrast (Minimum, Level AA) for small text — disabled text is still text. Although WCAG exempts "inactive UI components" from 1.4.11, it does NOT exempt them from 1.4.3 for the text content.
- **Issue:** Disabled input value / disabled list item labels are unreadable.
- **Fix:** Use `slate-blue-500` on slate-blue-50 (3.90:1 — large text only) or `slate-blue-600` (5.58:1 — AA for small text). WCAG does exempt inactive components from 1.4.3 per 1.4.3's parenthetical — but the project's accessibility baseline should exceed that. Raise to `slate-blue-600`.
- **Confidence:** Medium (argument hinges on whether "inactive" exemption applies; some auditors accept it, some don't).

#### A11Y-013 — Selected row's check glyph fails contrast against selected background
- **Component:** `dropdown-list/A-basic`
- **Files:**
  - `components/dropdown-list/A-basic/src/web/tailwind/components/dropdown-list.css:163-165` (selected trailing slot pinned to `deep-emerald-green-500` #004D40 on `blue-500` #3B82F6 = 2.67:1)
- **WCAG:** 1.4.11 Non-text Contrast (Level AA).
- **Issue:** The check glyph (the only non-text indicator that a row is selected) contrasts only 2.67:1 against the selected row background. Users who rely on the glyph (color-blind users cannot distinguish the blue-500 fill from adjacent hover blues) can't see it.
- **Impact:** Users perceive no selection indicator.
- **Fix:** Pin the selected-row check glyph to `white` (8.59:1 on blue-500) or the same `blue-50` the label uses (3.38:1, passes UI threshold).
- **Confidence:** High.

#### A11Y-014 — `<span class="form-field__input">` is not a form control
- **Component:** `form-field/A-basic`
- **Files:**
  - `components/form-field/A-basic/preview.html:557,604,780`
- **WCAG:** 4.1.2 Name, Role, Value (Level A); 1.3.1 Info and Relationships (Level A).
- **Issue:** A `<span>` styled to look like the input value is not focusable, not announced as an input, and cannot accept typed input. It is used as the visible value of a combobox that exposes no way for keyboard users to type-to-filter. The class `form-field__input` suggests otherwise.
- **Impact:** Screen readers announce only the surrounding `<button>`'s accessible name ("Select a country, collapsed") and not the selected value. Users lose confirmation of their choice.
- **Fix:** Either use a real `<input>` (preferred ARIA 1.2 combobox pattern), or add `aria-live="polite"` to a dedicated value-announcer region AND include the value in the button's accessible name.
- **Confidence:** High.

### Moderate

#### A11Y-015 — Icon-only buttons at Size=S may fail touch-target size
- **Component:** `buttons/A-basic`
- **Files:**
  - `components/buttons/A-basic/src/web/tailwind/components/button.css:192-200` (size-s: 8px padding + 20px icon = 36×36 px; icon-only at S is 32×32 per the caption "fill=36" but the actual interactive target is ~32×32 excluding border)
- **WCAG:** 2.5.8 Target Size (Minimum) (Level AA — 24×24 CSS px) — PASSES. But 2.5.5 Target Size (Enhanced) (Level AAA, 44×44) fails at S and M.
- **Issue:** Borderline. Size=S icon-only buttons meet the AA minimum (24×24) but fail the AAA enhanced target. Acceptable for a design system aimed at AA, but note that iOS HIG recommends 44×44.
- **Fix:** Document in README that Size=S icon-only should be reserved for uncluttered dense contexts; prefer Size=M (40×40) or Size=L (44×44) for primary actions.
- **Confidence:** Medium (judgment call — AA passes).

#### A11Y-016 — `form-field__input` (`<span>`) placeholder shows no selected value when search input has focus
- **Component:** `form-field/A-basic` (country selector)
- **Files:**
  - `components/form-field/A-basic/preview.html:564-570` (search input inside panel)
- **WCAG:** 4.1.3 Status Messages (Level AA); 1.3.1.
- **Issue:** Opening the country panel focuses nothing (focus stays on the trigger). Search input accepts `x-model="filter"` but there's no programmatic focus move. Also, no `aria-live` region announces the result count after typing.
- **Fix:** On `open=true`, `$nextTick()` + focus the search input. Add `aria-live="polite"` to a sr-only element that updates with `filtered().length` results.
- **Confidence:** High.

#### A11Y-017 — Stepper −/+ buttons provide no live announcement of quantity changes
- **Component:** `form-field/A-basic`
- **Files:**
  - `components/form-field/A-basic/preview.html:631-659` (stepper)
- **WCAG:** 4.1.3 Status Messages (Level AA).
- **Issue:** Clicking + / − updates `v` which updates the `<input>` value via `x-bind:value`. Screen readers do not announce the new value because the change is programmatic (no user keystroke), no `aria-live` on a parallel announcer, and the `aria-label` on the −/+ buttons never references the current quantity.
- **Fix:** Either put focus on the `<input>` on change (so the new value is announced when focus lands) or add an sr-only `aria-live="polite"` element that reads "Quantity: 3" when `v` changes.
- **Confidence:** Medium.

#### A11Y-018 — Password toggle `aria-pressed` is a string, not boolean
- **Component:** `form-field/A-basic`
- **Files:**
  - `components/form-field/A-basic/preview.html:456` (`x-bind:aria-pressed="shown.toString()"`)
- **WCAG:** 4.1.2 Name, Role, Value (Level A).
- **Issue:** `aria-pressed` should be the literal `"true"` / `"false"`. `shown.toString()` works but is unnecessary — Alpine's `:aria-pressed="shown"` would yield the same result more idiomatically. Observed working; the concern is inconsistency with `aria-expanded="pickerOpen"` at line 504 which is NOT stringified (Alpine coerces).
- **Fix:** Use `:aria-pressed="shown"` for consistency. No functional failure.
- **Confidence:** Low.

#### A11Y-019 — Required field marking relies on visual asterisk only; screen reader support is not universal
- **Component:** `form-field/A-basic`
- **Files:**
  - `components/form-field/A-basic/preview.html:691-698,702-709` (label has `<span aria-hidden>*</span>`; input has `required` attribute)
  - `components/form-field/A-basic/preview.html:680-687` (Full name — has no visual asterisk and no `required`; the README implies this is optional, so OK)
- **WCAG:** 3.3.2 Labels or Instructions (Level A); 1.3.1 (Level A).
- **Issue:** Native `required` is announced as "required" by most screen readers — that's fine. But the visual asterisk is `aria-hidden` so low-vision sighted-but-screen-magnifier users and screen-reader users rely entirely on the native attribute. When native `required` is NOT present (the asterisk is cosmetic), the field isn't actually required — the README should explicitly note this.
- **Fix:** Document the rule: "If you render `form-group__required` in the label you MUST add `required` (or `aria-required='true'`) to the control."
- **Confidence:** Medium.

#### A11Y-020 — Chevron rotation does not respect `prefers-reduced-motion`
- **Component:** `form-field/A-basic`, `dropdown-list/A-basic`
- **Files:**
  - `components/form-field/A-basic/preview.html:173` (`.combobox__chevron { transition: transform 150ms ease; }`)
  - `components/dropdown-list/A-basic/src/web/tailwind/components/dropdown-list.css:75-77` (button transitions? — not present; only form-field shell has the transition)
  - `components/buttons/A-basic/src/web/tailwind/components/button.css:66-68` (button transitions — all four properties transition, no reduced-motion guard)
  - `components/form-field/A-basic/src/web/tailwind/components/form-field.css:75-77` (same)
- **WCAG:** 2.3.3 Animation from Interactions (Level AAA — advisory); 2.3.1 Three Flashes (Level A — passes, no flashing).
- **Issue:** Transitions are short (150–200 ms) so are well under vestibular-disorder triggers. Still, best practice is to wrap in `@media (prefers-reduced-motion: reduce)` and set `transition-duration: 0s`.
- **Fix:** Add one reduced-motion block per component.
- **Confidence:** Low (AAA recommendation, not AA).

#### A11Y-021 — `<li class="dropdown-list__divider" role="separator"></li>` has no orientation
- **Component:** `dropdown-list/A-basic`
- **Files:**
  - `components/dropdown-list/A-basic/preview.html:255`
- **WCAG:** 4.1.2 Name, Role, Value (Level A) — ARIA 1.2 `separator`.
- **Issue:** ARIA `separator` inside a `listbox` is questionable; the ARIA listbox content model only allows `option`, `group`, and `presentation`. A literal `role="separator"` child of `role="listbox"` is not a valid child role.
- **Fix:** Use `role="presentation"` on the divider, or wrap options in `role="group"` with a heading.
- **Confidence:** High.

### Minor / enhancements

#### A11Y-022 — Empty / loading state `role="presentation"` is correct but `aria-busy` only on loading
- **Component:** `dropdown-list/A-basic`
- **Files:** `components/dropdown-list/A-basic/preview.html:447,453`
- **WCAG:** 4.1.3 Status Messages (Level AA) — minor enhancement.
- **Issue:** `aria-busy` on loading is present and correct. Empty state doesn't use `aria-live`, so the transition from "loading" → "empty" is not announced.
- **Fix:** Wrap empty/loading in `aria-live="polite"` or move the status message out of the listbox into a sibling `<div role="status">`.
- **Confidence:** Medium.

#### A11Y-023 — `<a href="#" class="btn">` styled as a button
- **Component:** `buttons/A-basic`
- **Files:** `components/buttons/A-basic/preview.html:342-345`
- **WCAG:** 4.1.2 (Level A) — passes; 2.1.1 Keyboard — passes.
- **Issue:** A link that looks exactly like a primary action button is a common UX trip — Space activates buttons, Enter activates links. Not a WCAG failure (AT correctly reports role=link), but worth a note in the README so product builders don't use `<a>` for non-navigation actions.
- **Fix:** README note: "Use `<button type='button'>` for actions; `<a href='…'>` only when the destination is a real URL."
- **Confidence:** Low.

#### A11Y-024 — Dropdown trigger lacks `type="button"` in some examples (defaults to `type="submit"` inside forms)
- **Component:** `form-field/A-basic`
- **Files:** `components/form-field/A-basic/preview.html:545,598,774` — all HAVE `type="button"`. So this is **not a finding after verification.** Leaving as confirmed-clear.
- **Confidence:** High (false positive — no finding).

#### A11Y-025 — Tertiary-disabled border 1.66:1 does not meet 3:1 UI contrast
- **Component:** `buttons/A-basic`
- **Files:** `components/buttons/A-basic/src/web/tailwind/components/button.css:158-161`
- **WCAG:** 1.4.11 — but WCAG excludes inactive UI components.
- **Issue:** `slate-blue-200` border on white = 1.66:1. WCAG excludes disabled components from 1.4.11, so this formally passes. For users who cannot perceive the opacity change it still looks like an active button. Enhancement, not a failing.
- **Fix:** Either remove the border on disabled tertiary (rely on background/opacity) or darken to `slate-blue-400` #7C96AD (3.08:1).
- **Confidence:** Low.

#### A11Y-026 — `aria-label` on phone-input country trigger lacks stability
- **Component:** `form-field/A-basic`
- **Files:** `components/form-field/A-basic/preview.html:503` (`x-bind:aria-label="'Country: ' + selected.native"`)
- **WCAG:** 4.1.2 (Level A) — passes; enhancement only.
- **Issue:** When a user changes country the label changes dynamically. Screen readers may not re-announce. Consider adding an `aria-live` region separate from the label.
- **Fix:** Announce country change via a dedicated `aria-live="polite"` status region.
- **Confidence:** Low.

---

## Contrast report (computed)

sRGB relative luminance per WCAG 2.x (Level 2.1/2.2 uses the same formula). Ratios computed from the hex tokens in `src/css/theme.css`.

### Buttons

| Pair | FG | BG | Ratio | Text threshold | UI threshold | Result |
|---|---|---|---|---|---|---|
| Primary default text/bg | `#FFFFFF` | `#004D40` | **9.83** | 4.5:1 | 3:1 | PASS |
| Primary hover text/bg | `#FAFAFA` | `#2F9483` | **3.54** | 4.5:1 (3:1 ≥ 18pt bold) | 3:1 | PASS large-text only; FAIL 4.5:1 for text-sm (Size=S/M/L) |
| Primary active text/bg | `#FFFFFF` | `#004D40` | **9.83** | 4.5:1 | 3:1 | PASS |
| Primary disabled text/bg | `#EFF2F5` | `#49637A` | **5.58** | 4.5:1 | 3:1 | PASS (before 0.7 opacity; effective ratio drops ~15 %) |
| Secondary default text/bg | `#49381A` | `#F9F4E8` | **10.27** | 4.5:1 | 3:1 | PASS |
| Secondary hover text/bg | `#49381A` | `#E2D1B3` | **7.51** | 4.5:1 | 3:1 | PASS |
| Secondary disabled text/bg | `#49637A` | `#EFF2F5` | **5.58** | 4.5:1 | 3:1 | PASS |
| Tertiary default text/bg | `#004D40` | `#FFFFFF` | **9.83** | 4.5:1 | 3:1 | PASS |
| Tertiary default border/bg (UI) | `#004D40` | `#FFFFFF` | **9.83** | — | 3:1 | PASS |
| Tertiary disabled text/bg | `#49637A` | `#FFFFFF` | **6.27** | 4.5:1 | 3:1 | PASS |
| Tertiary disabled border/bg (UI) | `#BDCBD6` | `#FFFFFF` | **1.66** | — | 3:1 | FAIL (WCAG exempts inactive components, so advisory — A11Y-025) |
| Transparent default text/bg | `#1D4ED8` | `#FFFFFF` | **6.70** | 4.5:1 | 3:1 | PASS |
| Transparent hover text/bg | `#1E40AF` | `#FFFFFF` | **8.72** | 4.5:1 | 3:1 | PASS |
| Transparent disabled text/bg | `#49637A` | `#FFFFFF` | **6.27** | 4.5:1 | 3:1 | PASS |

### Form field

| Pair | FG | BG | Ratio | Text threshold | UI threshold | Result |
|---|---|---|---|---|---|---|
| Default border on white (UI) | `#9DB0C2` | `#FFFFFF` | **2.23** | — | 3:1 | FAIL (A11Y-007) |
| Input text on white | `#24323D` | `#FFFFFF` | **13.14** | 4.5:1 | — | PASS |
| Placeholder on white | `#5B7C99` | `#FFFFFF` | **4.39** | 4.5:1 | — | FAIL by a hair (passes large-text 3:1) |
| Disabled text / bg | `#7C96AD` | `#EFF2F5` | **2.74** | 4.5:1 | — | FAIL (A11Y-012; WCAG inactive exemption may apply) |
| Leading-text color / bg | `#5B7C99` | `#EFF2F5` | **3.90** | 4.5:1 | — | FAIL small text; PASS large text |
| Focus border on white (UI) | `#60A5FA` | `#FFFFFF` | **2.54** | — | 3:1 | FAIL (A11Y-011) |
| Hover border on white (UI) | `#93C5FD` | `#FFFFFF` | **1.80** | — | 3:1 | FAIL (A11Y-010) |
| Error border / bg (UI) | `#F43F5E` | `#FFFFFF` | **3.67** | — | 3:1 | PASS |
| Error hint text on white | `#F43F5E` | `#FFFFFF` | **3.67** | 4.5:1 | — | FAIL (A11Y-009) |
| Warning border / bg (UI) | `#F59E0B` | `#FFFFFF` | **2.15** | — | 3:1 | FAIL (A11Y-008) |
| Warning hint text on white | `#F59E0B` | `#FFFFFF` | **2.15** | 4.5:1 | — | FAIL (A11Y-008) |
| Success border / bg (UI) | `#10B981` | `#FFFFFF` | **2.54** | — | 3:1 | FAIL (A11Y-008) |
| Success hint text on white | `#10B981` | `#FFFFFF` | **2.54** | 4.5:1 | — | FAIL (A11Y-008) |
| Label on white | `#374A5C` | `#FFFFFF` | **9.14** | 4.5:1 | — | PASS |
| Required asterisk on white | `#F43F5E` | `#FFFFFF` | **3.67** | 4.5:1 (3:1 large) | — | FAIL small text; asterisk is `aria-hidden` so not read — advisory |
| Hint on white | `#5B7C99` | `#FFFFFF` | **4.39** | 4.5:1 | — | FAIL by a hair |

### Dropdown-list

| Pair | FG | BG | Ratio | Text threshold | UI threshold | Result |
|---|---|---|---|---|---|---|
| Item default text/bg | `#24323D` | `#FFFFFF` | **13.14** | 4.5:1 | — | PASS |
| Item hover text/bg | `#24323D` | `#EFF6FF` | **12.07** | 4.5:1 | — | PASS |
| Item selected text/bg | `#EFF6FF` | `#3B82F6` | **3.38** | 4.5:1 (3:1 large) | — | FAIL small text; PASS large text. Dropdown items use 16px/500 — below 18pt. **FAIL for small text.** |
| Item disabled text/bg | `#9DB0C2` | `#FFFFFF` | **2.23** | 4.5:1 | — | FAIL (A11Y-012) |
| Empty/loading text/bg | `#7C96AD` | `#FFFFFF` | **3.08** | 4.5:1 | — | FAIL small text; advisory (role=presentation) |
| Leading icon color on white (UI) | `#5B7C99` | `#FFFFFF` | **4.39** | — | 3:1 | PASS |
| Selected check glyph / selected-row bg (UI) | `#004D40` | `#3B82F6` | **2.67** | — | 3:1 | FAIL (A11Y-013) |

### Focus rings (shared)

| Ring | Color | vs white | 1.4.11 (3:1) |
|---|---|---|---|
| `--shadow-focus/primary` | `#E1EBDD` | **1.23:1** | FAIL (A11Y-006) |
| `--shadow-focus/error` | `#FECDD3` | **1.41:1** | FAIL (A11Y-006) |
| `--shadow-focus/warning` | `#FDE68A` | **1.25:1** | FAIL (A11Y-006) |
| `--shadow-focus/success` | `#A7F3D0` | **1.28:1** | FAIL (A11Y-006) |

---

## Positive findings

- **Buttons cover the full state matrix** (default / hover / active / focus / disabled) consistently across all four style variants, with token-driven overrides.
- **Icon-only buttons** correctly carry `aria-label` in every example; icons are marked `aria-hidden` decoratively.
- **Form-field uses `:focus-within`** to propagate child focus to the shell — the right architectural choice.
- **Form-field feedback modifiers** correctly couple `aria-invalid="true"` with the error visual (form-field.css:92–97) so visual state and semantics never drift.
- **Form-group label / hint / required asterisk** use real `<label for>` + id wiring and `aria-describedby`.
- **Password toggle** correctly uses `aria-pressed` and dynamic `aria-label`.
- **Native form controls wherever possible** — `<input type='date'>`, `<input type='email'>`, `<textarea>` — inheriting native validation and AT support.
- **Dropdown-list JS** correctly preventDefaults keyboard actions, skips disabled options during roving focus, and scrolls the active item into view.
- **No inline `onclick`/`style`/`<script>`** anywhere — full CSP compliance.
- **Stepper `-/+` buttons** correctly `x-bind:disabled` at min/max.
- **Dropdown-list static matrix example** uses valid roles / selected states.

---

## Recommended next steps

In priority order. Items marked (CSS-only) can be applied without touching behavior; items marked (JS+HTML) require the `hyva-component-author` subagent to refactor.

1. **Raise focus-ring contrast** (A11Y-006) — darken the four `--shadow-focus/*` tokens or add a solid inner ring at 2px `deep-emerald-green-500` / `blue-600` / `rose-600` / `amber-700` / `emerald-700`. (CSS-only.)
2. **Darken form-field default border** (A11Y-007) and hover/focus borders (A11Y-010, A11Y-011) — `slate-blue-500` default / `blue-500` hover / `blue-600` focus. (CSS-only.)
3. **Darken warning/success border and hint text** (A11Y-008) to `amber-700` / `emerald-700`. (CSS-only.)
4. **Pin selected-row check glyph to white** (A11Y-013). One-line CSS change at `dropdown-list.css:163-165`. (CSS-only.)
5. **Raise disabled text colors** (A11Y-012) to at least `slate-blue-600`. (CSS-only.)
6. **Fix error hint text color** (A11Y-009) to `rose-600` or `rose-700`. (CSS-only.)
7. **Refactor country / size / phone comboboxes to ARIA 1.2 combobox pattern** (A11Y-001, A11Y-002, A11Y-004, A11Y-014) — the current `<button class="form-field">` wrapping `<span class="form-field__input">` is not salvageable. Spawn a Phase-1 follow-up ticket. (JS+HTML.)
8. **Fix dropdown-list option duplication in Example 2** (A11Y-003) — pick one authoring mode. (HTML.)
9. **Add `aria-controls` / `aria-activedescendant` / option `id`s** (A11Y-002) — extend `initDropdownList` with generated ids and wire them into the trigger binding. (JS+HTML.)
10. **Add focus restoration on close** (A11Y-005) — `this.$refs.trigger.focus()` on every close path. (JS.)
11. **Add `aria-live` status announcer** for stepper (A11Y-017), country-selector result count (A11Y-016), and dropdown empty↔loading transitions (A11Y-022). (HTML.)
12. **Remove `role="separator"` inside listbox** (A11Y-021) — switch to `role="presentation"`. (HTML.)
13. **Add `@media (prefers-reduced-motion: reduce)` guards** (A11Y-020). (CSS-only.)
14. **README additions** — document the required-asterisk-⇒-`required`-attribute rule (A11Y-019); document that size-S icon-only buttons are dense-context only (A11Y-015); clarify `<a>` vs `<button>` semantics (A11Y-023).

Of these, items 1–6 and 12–14 are **safe to land before Phase 2 starts** (CSS-only, no behavior change). Items 7–11 block reuse of the combobox pattern on Phase 2 pages and should be scheduled as a dedicated follow-up ticket before any page consumes the dropdown-list or country / size / phone form-field variants.
