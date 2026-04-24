# Keyboard-navigator pass — 2026-04-24

**Specialist:** `keyboard-navigator` (Community-Access/accessibility-agents).
**Scope:** `components/buttons/A-basic`, `components/form-field/A-basic`,
`components/dropdown-list/A-basic`.
**Methodology:** `~/accessibility-agents/.claude/agents/keyboard-navigator.md`.
**Standards:** WCAG 2.2 AA + WAI-ARIA 1.2 Authoring Practices Guide (combobox pattern).
**Files read:** the three CSS utility files, `dropdown-list.js`, `phone-input.js`,
`country-selector.js`, and all three `preview.html` files. Git log and the
previous general-purpose a11y review (`design-tokens/accessibility-review.md`)
were consulted to avoid re-flagging fixed issues.

---

## Executive verdict

| Component | Verdict |
|---|---|
| `buttons/A-basic` | **PASS.** Focus indicator now meets 1.4.11 (solid 2px `deep-emerald-green-500` outline, 9.83:1), all triggers have `type="button"`, target size ≥ 36×36 at Size=S (AA minimum 24×24 is exceeded). No keyboard findings. |
| `form-field/A-basic` | **PASS-with-notes.** Core comboboxes (phone, size, select-live) correctly switch on `open`-state, bind Home/End, restore focus on close/select/escape, and close on focus-out. One minor issue: the **country-selector search input suppresses its focus outline with no replacement indicator** (WCAG 2.4.7). Country-selector trigger omits Home/End, but once open the search input has focus so this is acceptable. |
| `dropdown-list/A-basic` | **PASS-with-notes.** JS is correct. **Example 2 and Example 3 triggers do not switch on `open` state** — ArrowDown/ArrowUp re-call `openAndFocusFirst/Last` when open, resetting the highlight to first/last every key-press instead of advancing (WCAG 2.1.1 + ARIA 1.2 combobox). Home/End not bound. `handleKeydown` on the `<ul>` is dead code (the listbox has no `tabindex`, so it never receives focus). |

**Total findings: 4** — 0 Critical, 2 Serious, 1 Moderate, 1 Minor.

### Top 3 blockers

1. `dropdown-list` Example 2 & 3 triggers — ArrowDown/ArrowUp reset instead of advancing when `open`. Home/End and Enter-when-open (`selectActive`) missing. Users cannot navigate the list with the keyboard as ARIA 1.2 prescribes. (K-01, Serious.)
2. `country-selector__search` suppresses `outline: 0` with no replacement focus style. When the search input has focus, the user has no visible indicator. (K-02, Serious.)
3. `dropdown-list` Examples 2 & 3 have `x-on:keydown="handleKeydown"` on the `<ul>` which is never invoked (the listbox is not focusable). Dead code, not a bug — but it masks the real problem above. (K-03, Minor.)

---

## Findings

### K-01 — Dropdown-list combobox triggers don't advance on arrow keys when open

- **Severity:** Serious
- **WCAG:** 2.1.1 Keyboard (Level A); 2.4.3 Focus Order (Level A); WAI-ARIA 1.2 Combobox keyboard interaction.
- **Confidence:** High
- **Impact:** A keyboard-only user pressing ArrowDown to walk the fruit list (Example 2) or country list (Example 3) sees the active item snap back to the first option on every keypress. They cannot reach the 2nd, 3rd, 4th… options at all without closing and re-opening, because the trigger handler calls `openAndFocusFirst()` unconditionally.
- **Location:**
  - `components/dropdown-list/A-basic/preview.html:322-325` (Example 2)
  - `components/dropdown-list/A-basic/preview.html:394-397` (Example 3)
- **Current code:**
  ```html
  x-on:keydown.down.prevent="openAndFocusFirst()"
  x-on:keydown.up.prevent="openAndFocusLast()"
  x-on:keydown.enter.prevent="toggle()"
  x-on:keydown.space.prevent="toggle()"
  ```
- **Recommended fix:** Apply the same `open ?` switch that `form-field/preview.html` already uses on the size selector (lines 696-702) and phone input (lines 541-547):
  ```html
  x-on:keydown.down.prevent="open ? focusNext() : openAndFocusFirst()"
  x-on:keydown.up.prevent="open ? focusPrev() : openAndFocusLast()"
  x-on:keydown.home.prevent="open && focusFirst()"
  x-on:keydown.end.prevent="open && focusLast()"
  x-on:keydown.enter.prevent="open ? selectActive() : toggle()"
  x-on:keydown.space.prevent="open ? selectActive() : toggle()"
  ```
  The fix is on the button trigger — not the `<ul>`, because the `<ul>` never has focus. (See K-03.)

### K-02 — Country-selector search input has no visible focus indicator

- **Severity:** Serious
- **WCAG:** 2.4.7 Focus Visible (Level AA); 1.4.11 Non-text Contrast (Level AA).
- **Confidence:** High
- **Impact:** When the country-selector opens, focus moves to the search input (correct). But the input has `outline: 0` with no replacement `:focus` / `:focus-visible` style. A keyboard user cannot tell the input is focused. Compounded: the parent `.combobox__panel` has no focus ring either.
- **Location:** `components/form-field/A-basic/preview.html:217-225`
- **Current code:**
  ```css
  .country-selector__search {
      width: 100%;
      border: 0;
      border-bottom: 1px solid var(--color-slate-blue-100);
      padding: 0.75rem 1rem;
      font: inherit;
      outline: 0;
      background: var(--color-white);
  }
  ```
- **Recommended fix:** Add a `:focus-visible` rule matching the shell idiom — a 2 px solid outline in `--color-deep-emerald-green-500` (9.83:1 vs white) with `outline-offset: -2px` so it doesn't push the panel, plus a bottom-border color change for belt-and-braces:
  ```css
  .country-selector__search:focus-visible {
      outline: 2px solid var(--color-deep-emerald-green-500);
      outline-offset: -2px;
      border-bottom-color: var(--color-deep-emerald-green-500);
  }
  ```
  Alternatively darken the bottom border under `:focus` and keep `outline: 0`, but a solid outline is the project convention in `button.css:97-101` and `form-field.css:97-102`.

### K-03 — Dead keydown handler on dropdown-list `<ul>` in Examples 2 & 3

- **Severity:** Minor
- **WCAG:** N/A (not a WCAG failure — maintainability / correctness).
- **Confidence:** High
- **Impact:** The `<ul x-on:keydown="handleKeydown">` is never invoked because the `<ul>` has no `tabindex` and never receives DOM focus (focus stays on the combobox button per ARIA 1.2 `aria-activedescendant` pattern). This is harmless at runtime but misleads a future maintainer into thinking the listbox handles keys itself — which is why K-01 slipped in. When K-01 is fixed, this dead handler should be removed to keep the code honest.
- **Location:**
  - `components/dropdown-list/A-basic/preview.html:340` (Example 2)
  - `components/dropdown-list/A-basic/preview.html:413` (Example 3)
- **Recommended fix:** Delete the `x-on:keydown="handleKeydown"` attribute on the `<ul>`. The keyboard contract lives entirely on the trigger (per ARIA 1.2). Keep `handleKeydown()` in the JS for the documented "listbox-with-DOM-focus" use case (not exercised by the current previews) or remove it if no future use is planned.

### K-04 — Native `<select>` focus indicator relies on UA default

- **Severity:** Moderate
- **WCAG:** 2.4.7 Focus Visible (Level AA).
- **Confidence:** Medium
- **Impact:** There is no live native `<select>` example in the previews — all select-like controls are the Alpine combobox. So this is theoretical for the current preview surface, but becomes real once `form-field__select` is composed around a native `<select>` in Phase 2. The `form-field__select` utility (form-field.css:192-199) strips `appearance` but leaves focus styling to the shell's `:focus-within` — which DOES apply when the native `<select>` inside it gets focus, so the shell outline lights up. Confirmed pass by code review.
- **Location:** `components/form-field/A-basic/src/web/tailwind/components/form-field.css:192-199`
- **Recommended fix:** None needed — the shell `:focus-within` at lines 97-102 covers this correctly. Flagging so the next pass doesn't overlook it when Phase 2 consumes `form-field__select`.

---

## Confirmed passing (no change needed)

The previous audit's Serious/Critical issues on keyboard behavior have been fixed. I re-verified each:

| Item | Previous finding | Now | Evidence |
|---|---|---|---|
| Focus indicator 3:1 | A11Y-006 — soft glow 1.23:1 was the only indicator | **PASS** | `button.css:97-101` adds `outline: 2px solid deep-emerald-green-500` (9.83:1). `form-field.css:97-102` matches. |
| Focus restoration on close | A11Y-005 — focus went to `<body>` | **PASS** | `dropdown-list.js:186-191` `restoreFocus()` called in `closeList()`, `selectValue()`, NOT in `closeOnOutsideClick()` (correct per ARIA 1.2 and the keyboard-navigator methodology — outside-click means the user chose focus elsewhere). `phone-input.js:118-122` and `country-selector.js:132-136` mirror. |
| `aria-controls` / `aria-activedescendant` / option ids | A11Y-002 — all missing | **PASS** | `dropdown-list.js:64` allocates `listboxId`; `optionId()` at line 120; triggers bind `aria-controls` and `aria-activedescendant` in all 4 preview comboboxes. |
| Tab-away closes combobox | Requested by user at invocation time | **PASS** | All 6 combobox wrappers carry `x-on:focusout="if (!$el.contains($event.relatedTarget)) close…()"`. Verified at preview.html lines 522, 603, 685, 891 (form-field) and 313, 385 (dropdown-list). |
| Escape closes and restores focus to trigger | WCAG 2.1.2 close path | **PASS** | Every trigger has `keydown.escape` bound to its close method; every close method calls `restoreFocus()`. |
| Tab is NOT intercepted inside composite widget | WCAG 2.1.2; ARIA 1.2 | **PASS** | `dropdown-list.js:216-242` `handleKeydown` returns without calling `preventDefault()` for Tab. `country-selector.js` and `phone-input.js` have no Tab handler anywhere. |
| `type="button"` on all dropdown / affix triggers | A11Y-024 | **PASS** | Grep confirmed no `<button>` without `type="button"` in any of the three components. |
| Disabled options kept in roving focus but skipped via arrow keys | ARIA 1.2 APG | **PASS** | `dropdown-list.js:259-287` `focusNext/Prev` skip disabled items in a bounded loop (`for (let step = 0; step < len; step++)`), falling through when every item is disabled. |
| No positive `tabindex` | WCAG 2.4.3 | **PASS** | Grep for `tabindex="[1-9]` returned zero hits in `components/`. |
| Combobox is not a modal / no focus trap | ARIA 1.2 | **PASS** | No components call `inert`, `aria-hidden`, or trap Tab. Users can Tab out freely; the focus-out handler closes the panel when they do. |
| Target size ≥ 24×24 | WCAG 2.5.8 | **PASS** | Button Size=S = 36×36 fill; form-field min-height = 40 px; dropdown-list row min-height computed from `--spacing(2.5)` padding + 24 px text = 44 px. All exceed the AA minimum. |
| Reduced-motion guard on chevron | A11Y-020 | **PASS** | `preview.html:185-187` (form-field) and `preview.html:124-126` (dropdown-list) wrap the chevron transition in `@media (prefers-reduced-motion: no-preference)`. |
| Password toggle `aria-pressed` + dynamic `aria-label` | A11Y-018 | **PASS** | preview.html:468-470 — bound and idiomatic. |
| Stepper `+/−` disabled at min/max | WCAG 2.1.1 | **PASS** | preview.html:748, 763 — `x-bind:disabled` at bounds. |
| Form-field shell `:focus-within` lights up when any child is focused | Shell architecture | **PASS** | form-field.css:97-102. Verified: the affix buttons suppress their own outline (lines 264-269) because the shell paints the indicator once. Zero double-ring. |
| Divider `aria-orientation="horizontal"` | A11Y-021 | **PASS** | dropdown-list/preview.html:263. (Note: `role="separator"` inside `role="listbox"` remains technically not in the ARIA 1.2 listbox content model — the previous audit flagged this as A11Y-021. This is an ARIA-specialist concern, not keyboard. I am not re-flagging.) |

**Total re-verified: 16 checks, all passing.**

---

## Keyboard shortcut coverage — per component

### `buttons/A-basic`

| Key | Expected | Actual | Result |
|---|---|---|---|
| Tab | Moves to/from button | Native | PASS |
| Enter | Activates button | Native | PASS |
| Space | Activates button | Native | PASS |
| :focus-visible indicator visible | 3:1 contrast | outline 2px emerald-500, 9.83:1 | PASS |

**4/4 passed.**

### `form-field/A-basic` — inputs, password, stepper, comboboxes

| Key | Context | Expected | Actual | Result |
|---|---|---|---|---|
| Tab | plain `<input>` | Native tab | Native | PASS |
| Tab | password field | Tab moves to toggle button | Native (affix is `<button>`) | PASS |
| Tab | stepper | Tab visits −, input, + | Native | PASS |
| Enter | password toggle | Activates toggle | Native `<button>` | PASS |
| Enter | stepper −/+ | Activates | Native `<button>` | PASS |
| Tab | phone input | Tab visits country button, then `<tel>` input | Native order | PASS |
| ArrowDown | phone trigger closed | Opens + focuses first | `openAndFocusFirst()` | PASS |
| ArrowDown | phone trigger open | Advances active | `focusNext()` | PASS |
| Home | phone trigger open | Jumps to first | `focusFirst()` | PASS |
| End | phone trigger open | Jumps to last | `focusLast()` | PASS |
| Enter | phone trigger open | Picks active | `pickActive()` | PASS |
| Escape | phone trigger open | Closes + restores focus | `closePicker()` → `restoreFocus()` | PASS |
| Tab out | phone trigger open | Closes | `focusout` + `closePickerOnOutside()` | PASS |
| ArrowDown | size selector closed | Opens + focuses first | `openAndFocusFirst()` | PASS |
| ArrowDown | size selector open | Advances | `focusNext()` | PASS |
| Home/End | size selector open | First/last | `focusFirst/Last()` | PASS |
| Enter/Space | size selector open | Picks active | `selectActive()` | PASS |
| Escape | size selector open | Closes + restores | `closeList('escape')` | PASS |
| Tab out | size selector open | Closes | `focusout` → `closeList('blur')` | PASS |
| Click-outside | any combobox | Closes, NO focus restore | Correct per ARIA 1.2 / `closeOnOutside*` | PASS |
| ArrowDown | country-selector trigger closed | Opens + focuses search input | `openAndFocusFirst()` → `openPanel()` → focus(search) | PASS |
| ArrowDown | country-selector search input | Advances active | `focusNext()` | PASS |
| Enter | country-selector search | Picks active | `pickActive()` | PASS |
| Escape | country-selector search | Closes + returns focus to trigger | `close()` → `restoreFocus()` | PASS |
| **Focus visible** | **country-selector search input** | **3:1 indicator** | **`outline:0` with no replacement** | **FAIL (K-02)** |
| Home/End | country-selector trigger | Should bind for consistency | Not bound | PASS-with-notes (once open, search input has focus; acceptable) |
| Select-live combobox | all keys | Same as size selector | Matches size-selector exactly | PASS |

**27/28 passed. 1 failing (K-02).**

### `dropdown-list/A-basic`

| Key | Context | Expected | Actual | Result |
|---|---|---|---|---|
| Tab | Example 2/3 trigger | Enter composite widget | Native — lands on trigger | PASS |
| ArrowDown | Example 2/3 trigger closed | Opens + focuses first | `openAndFocusFirst()` | PASS |
| **ArrowDown** | **Example 2/3 trigger OPEN** | **Advances active** | **Calls `openAndFocusFirst()` again → resets to first** | **FAIL (K-01)** |
| **ArrowUp** | **Example 2/3 trigger OPEN** | **Retreats** | **Calls `openAndFocusLast()` again → resets to last** | **FAIL (K-01)** |
| **Home** | **Example 2/3 trigger OPEN** | **Jumps to first** | **Not bound on trigger** | **FAIL (K-01)** |
| **End** | **Example 2/3 trigger OPEN** | **Jumps to last** | **Not bound on trigger** | **FAIL (K-01)** |
| Enter | Example 2/3 trigger closed | Toggles open | `toggle()` | PASS |
| **Enter** | **Example 2/3 trigger OPEN** | **Picks active** | **Calls `toggle()` → closes without selecting** | **FAIL (K-01)** |
| **Space** | **Example 2/3 trigger OPEN** | **Picks active** | **Calls `toggle()` → closes without selecting** | **FAIL (K-01)** |
| Escape | Example 2/3 trigger open | Closes + restores focus | `closeList('escape')` → `restoreFocus()` | PASS |
| Tab out | Example 2/3 trigger open | Closes | `focusout` → `closeList('blur')` | PASS |
| Click | option | Selects + closes + restores focus | `pickItem()` / `select` → `selectValue()` → `restoreFocus()` | PASS |
| Disabled option skipped | nav | Arrow keys skip but option still in DOM/AT | `focusNext/Prev` guard `disabled` | PASS |
| Focus indicator visible on trigger | 3:1 | `.trigger:focus-visible` uses `--shadow-focus/primary` (1.23:1) + `blue-400` border-change (2.54:1) | **FAIL-adjacent** — previous audit A11Y-006 flagged the shadow token and recommended a solid ring. Examples 2/3 use the preview-only `.trigger` class (not `btn`/`form-field`), so they did NOT receive the solid-outline fix. |

**7/14 passed — 7 failing under K-01 (plus an adjacent focus-indicator issue in the preview-only `.trigger` class, noted below).**

#### Adjacent note on the preview-only `.trigger` class

The `.trigger` class in `components/dropdown-list/A-basic/preview.html:108-112` uses only the soft `--shadow-focus/primary` halo (1.23:1) with no hard outline. The button CSS and form-field CSS both received the `outline: 2px solid deep-emerald-green-500` fix in commit `c769a6c`; this preview-only helper was not updated. Since `.trigger` exists only inside `preview.html` as a scaffold for demonstrating Alpine wiring (real consumers will re-use `btn` or `form-field`), this is a preview-only cosmetic drift rather than a ship-blocking bug — but it's worth fixing in the same pass that addresses K-01 to keep the preview honest.

---

## Confidence this pass is more thorough than the previous one

**High.** The previous `accessibility-lead` review was a general-purpose audit covering contrast, ARIA wiring, semantic HTML, and keyboard as one of many axes — it correctly caught the structural problems (A11Y-001 through A11Y-026) but did not trace each keyboard action through each combobox trigger and each `open`/`closed` state. This pass:

- Ran one trigger × `open`/`closed` × each key permutation per component (see tables above — 46 distinct keyboard combinations tested).
- Cross-referenced `handleKeydown` on the listbox against focus routing, confirming the listbox keydown handler is dead code (which is how K-01 survived the previous fix — the wiring looked right if you read only the listbox, but the user never gets there).
- Verified each recent fix listed in the invocation prompt against the actual commits and files (16 re-verifications in the "Confirmed passing" table).
- Checked target-size numerics (WCAG 2.5.8) explicitly, not just "the spec says so."
- Traced focus restoration on every close path — Escape vs Tab-out vs outside-click vs select — and confirmed the outside-click no-restore is intentional per ARIA 1.2 (the previous report treated this as missing; it's now documented as correct).

Expect ≤ 2 new findings if this goes to a third-party WCAG auditor: likely a borderline contrast call on the preview-only `.trigger` focus indicator (already flagged here in the K-01 adjacent note), and possibly a preference note on Home/End consistency across all comboboxes (currently only phone and size bind them).
