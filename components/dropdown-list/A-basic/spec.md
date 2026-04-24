# Dropdown list — A-basic (spec)

## 1. Overview

A floating menu panel that holds a vertical collection of selectable list items — the popup that opens from a combobox, country selector, filter chip, or custom `<select>`. Exposes `role="listbox"` on the container and `role="option"` on each item; does NOT contain the trigger button (the trigger lives with the consumer, e.g. the form-field's leading-affix slot).

Figma source:
- List container (panel shell): `1343:42718` (variants at `1343:42651`, `1343:42740`, `1343:42962`, `1343:43254`, `1343:43476`, `1343:43708`).
- List item (atomic row): `1343:42177` (24 leaf variants — 4 types × 2 trailing-text × 4 states).

This is the **first component in the POC that ships with Alpine.js behavior** (Alpine v3). The spec below delineates CSS (visual primitives — container shell, item row styles) from Alpine (keyboard nav, selection, roving focus, open/close, event dispatch).

---

## 2. Decision log (resolve before coding)

Open questions tracked in `design-tokens/questions.md` (#22–#27). Must be answered before authoring:

- **DL-1 → questions.md #22** — No keyboard-`focus` (roving-focus) variant exists in the Figma item set; only `Default / Hover / Selected / Disabled`. The Hover style (`bg-blue-50`) is a reasonable visual for the roving-focus / "active-descendant" state, but designer confirmation is needed.
- **DL-2 → questions.md #23** — No explicit tick-icon / trailing check affordance in the Selected variant (the whole row goes `bg-blue.500` + inverted text). Confirm whether `Selected` should also show a trailing check icon (for accessibility / visual redundancy), or if the color-only cue is intentional.
- **DL-3 → questions.md #24** — Container has `overflow-clip` and no `max-height` defined in Figma. Confirm the max-height policy for the real component (e.g. `max-h-[15rem]` ≈ 5 items visible, `max-h-[20rem]` ≈ 7 items, or fluid-to-viewport `max-h-[calc(100vh-4rem)]`).
- **DL-4 → questions.md #25** — No visible dividers between items; rows stack edge-to-edge. Confirm this is intentional and item rows should NOT have a border-top separator.
- **DL-5 → questions.md #26** — Figma uses `rounded-[6px]` (= `borderRadius.md` = 6px) on the container, but hover/selected backgrounds on items extend flush to the container edges without inner corner-rounding. Confirm this is acceptable (relies on `overflow-clip` to mask the corners), or whether the first/last item needs matching top/bottom radius.
- **DL-6 → questions.md #27** — No Figma design for empty state ("No results", "No matches found") or loading state (spinner / skeleton). Confirm whether those affordances are needed, and if so, which node to reference.

---

## 3. List container (`1343:42718`)

The floating panel shell.

### 3.1 Dimensions

| Property | Figma value | Token reference | Note |
|---|---|---|---|
| Width | `320px` (fixed on Figma canvas) | — | POC: fluid (`width: 100%` of anchor's width via Popper/Floating-UI or min-width anchor). 320px is representative, not prescriptive. |
| Min-width | (none in Figma) | — | Author: adopt anchor-width as min-width; allow intrinsic growth. |
| Max-height | NOT defined in Figma | — | See DL-3 / questions.md #24. Interim: `max-h-60` (15rem, ~5 items) + `overflow-y-auto`. |

### 3.2 Padding

| Property | Figma value | Token reference |
|---|---|---|
| Padding (inner, around item stack) | `0px` — items are flush to container edges | `spacing.0` |

Container has NO inner padding; items' own `px-[14px] py-[10px]` provides all spacing.

### 3.3 Background, border, border-radius

| Property | Figma value | Token reference |
|---|---|---|
| Background | `#FFFFFF` | `colors.base.white` |
| Border | none | — |
| Border-radius | `6px` | `borderRadius.md` (0.375rem) |
| Overflow | `overflow-clip` (Figma) → `overflow-hidden` + `overflow-y-auto` when exceeding max-height | — |

### 3.4 Shadow

| Property | Figma value | Token reference |
|---|---|---|
| Drop shadow | Two-stop: `0px 4px 6px -2px rgba(0,0,0,0.05), 0px 10px 15px -3px rgba(0,0,0,0.1)` | `boxShadow.Shadow/lg` |

### 3.5 Stacking / gap between items

Items are **stacked directly**, no inter-item gap:

| Property | Figma value | Token reference |
|---|---|---|
| Flex direction | `flex-col` | — |
| Gap between items | `0px` | `spacing.0` |
| Align items | `items-start` (cross axis) → children are `w-full` | — |

### 3.6 Scroll affordance

- Visual: native scrollbar when content overflows `max-height` (DL-3).
- No custom scroll-thumb styling in Figma; POC uses browser-default scrollbars.
- The scroll container is the listbox element itself (not a nested wrapper). Alpine scrolls the active item into view on Arrow Up/Down (see §7).

---

## 4. List item (`1343:42177`)

One selectable row.

### 4.1 Dimensions

| Property | Figma value | Token reference |
|---|---|---|
| Height (default — no leading slot) | `44px` fixed | — |
| Min-height (with leading slot) | `44px` intrinsic (padding + 24px-tall leading slot + padding = 44px) | — |
| Width | `100%` of container | — |

### 4.2 Padding

| Property | Figma value | Token reference | Note |
|---|---|---|---|
| Padding-inline | `14px` | `spacing.3.5` (0.875rem = 14px) | |
| Padding-block | `10px` | `spacing.2.5` (0.625rem = 10px) | |

### 4.3 Typography

Label and trailing text both use **`text-base/leading-6/font-normal`** (tokens.resolved.json):
- `resolvedFontFamily`: DM Sans
- `size`: 16px
- `lineHeight`: 24px
- `weight`: 500 (Medium)
- `letterSpacing`: 0%

Figma source also reports `font-variation-settings: 'opsz' 14` — optical-size axis hint; author may omit if DM Sans variable axis isn't wired up.

### 4.4 Structure (slot contract)

A row is composed of three horizontal slots with a fixed outer gap of `8px` (`spacing.2`) between slots and an inner gap of `6px` (`spacing.1.5`) between label and trailing text:

```
[ leading slot (optional, 24×24) ]  gap-2  [ label (flex-1) ]  gap-1.5  [ trailing text (optional) ]
```

| Slot | Content | Size | Required? | Figma ref |
|---|---|---|---|---|
| Leading | Image / icon / flag / avatar / nothing | 24 × 24 px | No — omitted for `Type=Default` | varies per variant (see §5) |
| Label | Text | `flex-1 min-w-0` | **Yes** | `1343:42052` |
| Trailing | Short text (hint, status, shortcut) | intrinsic, `shrink-0`, `whitespace-nowrap` | No — only when `Trailing text=True` | `1343:42053` |

Outer row auto-layout: horizontal, `items-center`, `gap-[8px]`, inner text-group auto-layout: horizontal, `items-start`, `gap-[6px]`.

### 4.5 States

Applicable states on a list item:

| State | Applies? | Driven by |
|---|---|---|
| Default | Yes | CSS (no modifier) |
| Hover | Yes | CSS `:hover` |
| Focus (roving / keyboard-active) | Yes | Alpine — `[data-active="true"]` attribute (see §7). Visually assumed to equal Hover — see DL-1. |
| Active (mousedown) | Not in Figma — assumed to equal Selected for the brief press duration OR unchanged. See DL-1. |
| Selected | Yes | Alpine — `aria-selected="true"` attribute |
| Disabled | Yes | HTML `aria-disabled="true"` + CSS `[aria-disabled="true"]` |
| Error | N/A | — |

### 4.6 State × element color table

Colors reference token names from `tokens.resolved.json`. Hex values are the Figma-reported values and are embedded in those tokens; the author must consume them via Tailwind utility classes that resolve to the CSS custom properties in `src/css/theme.css`.

| State | Row background | Label color | Trailing text color | Leading-icon fill | Figma node |
|---|---|---|---|---|---|
| Default | transparent | `slateBlue.800` | `slateBlue.400` | `slateBlue.500` | `1343:42176` / `1343:42178` / `1343:42194` / `1343:42226` / `1343:42283` |
| Hover | `blue.50` | `slateBlue.800` | `slateBlue.400` | `slateBlue.500` | `1343:42335` / `1343:42337` / `1343:42339` / `1343:42341` / `1343:42343` / `1343:42345` |
| Focus / roving-active | `blue.50` (assumed — DL-1) | `slateBlue.800` | `slateBlue.400` | `slateBlue.500` | *(no Figma node — inherits Hover)* |
| Selected | `blue.500` | `blue.50` | `blue.200` | `blue.50` (assumed — same as label on dark bg) | `1343:42427` / `1343:42429` / `1343:42431` / `1343:42433` / `1343:42435` / `1343:42437` |
| Disabled | transparent | `slateBlue.300` | `slateBlue.300` (assumed — parity with label) | `slateBlue.300` (assumed) | `1343:42519` / `1343:42521` / `1343:42523` / `1343:42525` / `1343:42527` / `1343:42529` |

Notes on assumptions flagged in the table:
- **Selected + leading-icon color:** Figma's icon fill token is not explicitly re-resolved per state; when the row bg is `blue.500`, the icon must shift to a light value. Assumed `blue.50` to match the label. Confirm if the icon should instead use `currentColor` (inheriting from the label) — preferred from a CSS perspective.
- **Disabled + trailing text + leading-icon:** Figma's disabled variant only shows the label color change; trailing text & leading icon presumed to share the same disabled dim. If the design wants higher-contrast dim icons, flag.

### 4.7 Focus ring (for keyboard users outside the listbox pattern)

When a list item receives true browser focus (only relevant if the consumer decides to use `tabindex="0"` per item rather than `aria-activedescendant`), the POC focus ring is `Focus/Primary` (`0px 0px 0px 4px #e1ebdd`) from `tokens.resolved.json`. The default pattern used here (§6 / §7) is `aria-activedescendant` — the listbox itself is the single focusable element, so per-item focus rings are not rendered. DL-1 applies.

---

## 5. Item variants (leading-slot variations)

Figma variant matrix: `Type × Trailing text × State` = 4 × 2 × 4 = 32 combinations; 24 leaves are materialized in the Figma set (Hover state is only shown for `Trailing text=False` and `Trailing text=True` across all 4 Types; Selected and Disabled similarly cover 6 leaves each; some combinations are collapsed).

| Variant (`Type=`) | Leading slot content | Leading token / size | Representative Figma node |
|---|---|---|---|
| `Default` | (none — label starts at `px-3.5`) | — | `1343:42176` |
| `Leading image` | `<img>` (24×24, `rounded-[2px]` = `borderRadius.sm`, `object-cover`) | `borderRadius.sm` | `1343:42194` |
| `Leading icon` | 24×24 SVG, fill `slateBlue.500` (#5B7C99) default state | `colors.slateBlue.500` | `1343:42226` |

Note: the Figma set does NOT include a `Leading=Flag` or `Leading=Avatar` variant. If these are needed later (country selector, user picker), they re-use the `Leading image` variant (24×24, different border-radius — flag = `borderRadius.sm`, avatar = `borderRadius.full`).

### Trailing text (independent axis)

`Trailing text=True` appends a short label to the right of the main label:
- Typography: same text token as main label.
- Color: `slateBlue.400` in Default/Hover; `blue.200` in Selected; `slateBlue.300` in Disabled (assumed).
- Uses: in-stock status, keyboard shortcut hint, count, unit suffix. Figma example: "In stock" / "Out of stock" on the container preview (`1343:42718`).

---

## 6. Accessibility

### 6.1 Container (`role="listbox"`)

```
<ul role="listbox"
    id="dl-{unique}"
    aria-labelledby="{trigger-id-or-label-id}"
    aria-activedescendant="dl-{unique}-option-{activeIndex}"  <!-- Alpine-bound -->
    tabindex="0"                                                <!-- single focusable element -->
    x-data="dropdownList({ ... })"
    ...>
```

- `role="listbox"` required; native `<ul>` gives semantic fallback.
- `aria-labelledby` points at either the consumer's trigger button label OR the form-field label ID (consumer-supplied).
- `aria-activedescendant` tracks the Alpine `activeIndex`-derived option ID. Updated in Arrow key handlers.
- `aria-multiselectable="true"` only if the consumer opts into multi-select. A-basic is single-select by default.

### 6.2 Item (`role="option"`)

```
<li role="option"
    id="dl-{unique}-option-{i}"
    aria-selected="true|false"             <!-- Alpine -->
    aria-disabled="true|false"             <!-- optional per item -->
    data-value="{value}"
    data-active="{bool}"                    <!-- Alpine — styles roving-focus -->
    ...>
```

- `role="option"` required.
- `aria-selected` is the truth about the selection — required on every option.
- `aria-disabled="true"` if the option is not selectable (prevents Alpine handlers from acting on it, styles it dim).
- `id` must be unique per listbox instance; Alpine computes `id` from a prefix + index.
- `data-active` is CSS's hook for the roving-focus style; Alpine sets it on the item at `activeIndex` and clears it on all others.

### 6.3 Keyboard contract (all bound in Alpine — see §7)

| Key | Behavior |
|---|---|
| ArrowDown | Move `activeIndex` to next non-disabled option; wrap to 0 at end. Scroll option into view. |
| ArrowUp | Move `activeIndex` to prev non-disabled option; wrap to `items.length - 1` at start. |
| Home | Move `activeIndex` to first non-disabled option. |
| End | Move `activeIndex` to last non-disabled option. |
| Enter | Select the option at `activeIndex` (fires `select(value)` + event dispatch). Closes panel via `close()`. |
| Space | Same as Enter (selects). |
| Escape | Closes the panel without selecting (fires `close()` + `dropdown:close` event). |
| Tab / Shift+Tab | Closes the panel and returns focus to the trigger (consumer's concern). |
| Printable character | Type-ahead — jumps to the next option whose label starts with the typed character. Optional, enabled by `typeAhead: true` config flag. (Mark deferred for POC; see questions.md #22 or follow-up.) |

### 6.4 Visible focus (container-level)

When the listbox itself has keyboard focus (ArrowDown has been pressed once), the `[data-active="true"]` item renders at Hover styling. No separate ring on the listbox element — browser default outline is fine since the listbox is the single focus target and loses focus to the trigger on close.

---

## 7. Alpine behavior

`x-data="dropdownList(config)"` — the Alpine component.

### 7.1 State tracked

```
{
  open: false,                     // whether the panel is rendered (consumer typically uses x-show + transition)
  activeIndex: -1,                 // the keyboard-highlighted option index; -1 = none
  selectedValue: null,             // the current selection (single-select); or an array if multi
  items: [],                        // array of { value, label, disabled } — derived from DOM or config
  searchBuffer: '',                 // type-ahead buffer
  searchTimeout: null               // clears after 500ms inactivity
}
```

### 7.2 Methods exposed

- `open()` — sets `open = true`, resets `activeIndex` to the currently-selected item (or 0 if none), sets focus to the listbox element.
- `close()` — sets `open = false`, clears `activeIndex`, returns focus to the trigger (consumer-supplied `returnFocusTo` ref).
- `toggle()` — convenience: `open ? close() : open()`.
- `select(value)` — sets `selectedValue = value`, fires `dropdown:select` event, calls `close()`. Guards against disabled options.
- `focusNext()` — advances `activeIndex`, skipping disabled; wraps.
- `focusPrev()` — moves `activeIndex` back, skipping disabled; wraps.
- `focusFirst()` / `focusLast()` — Home / End handlers.
- `scrollActiveIntoView()` — ensures the `data-active="true"` option is within the scrolling container's viewport. Called after every `focus*()`.
- `typeAhead(char)` — appends to `searchBuffer`, matches the first non-disabled option whose label starts with the buffer, sets `activeIndex` accordingly. Resets buffer after 500 ms.
- `isSelected(value)` — returns `value === selectedValue` (single) or `selectedValue.includes(value)` (multi). Bound to `aria-selected` on each option.

### 7.3 Events dispatched (on the listbox element, bubbling)

| Event | `detail` payload | Use |
|---|---|---|
| `dropdown:open` | `{}` | Consumer may react (e.g. position via Floating-UI, lock body scroll on mobile). |
| `dropdown:close` | `{ reason: 'select' | 'escape' | 'outside-click' | 'tab' }` | Consumer can track why. |
| `dropdown:select` | `{ value, label }` | The consumer's primary hook — listens and updates the form-field value / trigger label. |
| `dropdown:highlight` | `{ value, index }` | Optional — fires on every `activeIndex` change (e.g. for live preview in a country picker). |

Events use `$dispatch('dropdown:select', { value, label })` — all `x-on:` (no inline handlers) to comply with CSP.

### 7.4 DOM-driven vs config-driven items

Two authoring modes are supported:

1. **DOM-driven (preferred for Hyvä PHTML):** consumer renders `<li role="option">` children directly; Alpine reads items from the rendered DOM on mount. Fits the static-HTML-first Hyvä pattern.
2. **Config-driven:** Alpine receives `items: [{ value, label, disabled, leading }]` via `x-data`; iterates with `<template x-for>`. Useful for Alpine-first consumers (search filter, dynamic options).

A-basic ships both paths — CSS is identical; only the PHTML/preview differs.

### 7.5 Outside-click behavior

The panel closes on `click` outside its DOM tree. Alpine directive: `@click.outside="close()"`. The trigger button is excluded from "outside" by placing the trigger + panel within the same `x-data` parent (standard Hyvä combobox composition).

---

## 8. Auto-layout

| Element | Direction | Gap | Align (main) | Align (cross) |
|---|---|---|---|---|
| Container (listbox) | `flex-col` | `0` (items flush) | `flex-start` | `items-stretch` (each item `w-full`) |
| Item (row) | `flex-row` | `8px` (`spacing.2`) | `flex-start` | `items-center` |
| Text group inside item | `flex-row` | `6px` (`spacing.1.5`) | `flex-start` | `items-start` (Figma uses `items-start` on the inner text container; label and trailing are both on the same baseline-ish line due to shared line-height) |

---

## 9. Tokens referenced

All tokens resolve to entries in `design-tokens/tokens.resolved.json`. Zero new tokens invented.

**Colors:**
- `colors.base.white`
- `colors.slateBlue.300`, `colors.slateBlue.400`, `colors.slateBlue.500`, `colors.slateBlue.800`
- `colors.blue.50`, `colors.blue.200`, `colors.blue.500`

**Typography:**
- `typography.text-base/leading-6/font-normal`
- `fontFamily.sans` (DM Sans)

**Spacing:**
- `spacing.0`, `spacing.1.5` (6px), `spacing.2` (8px), `spacing.2.5` (10px), `spacing.3.5` (14px)

**Border-radius:**
- `borderRadius.sm` (2px — for `Leading image` slot)
- `borderRadius.md` (6px — for container)

**Box-shadow:**
- `boxShadow.Shadow/lg`
- `boxShadow.Focus/Primary` (only if consumer chooses per-item `tabindex="0"` mode; not the default A-basic pattern)

Token count (distinct token references): **15**.

---

## 10. Figma-to-implementation CSS vs JS delineation

| Concern | Layer | Why |
|---|---|---|
| Panel shell (bg, radius, shadow) | CSS `@utility` | Pure visual primitive. |
| Item row layout + typography | CSS `@utility` | Pure visual primitive. |
| Default / Hover / Selected / Disabled styling | CSS (`:hover`, `[aria-selected="true"]`, `[aria-disabled="true"]`, `[data-active="true"]`) | Driven by attributes Alpine sets — no JS-authored styles. |
| Open/close, keyboard nav, selection, events, outside-click | Alpine | Behavior. |
| Scroll-into-view on active-change | Alpine | DOM manipulation. |
| Positioning relative to trigger | Consumer's concern (Floating-UI / Popper / CSS absolute) | Not part of this atom's responsibility. |

Recommendation (see Return summary): the list-item should be a **pure CSS utility class** (`.dropdown-list__item`) with state selectors on `aria-*` / `data-*` attributes. The Alpine wrapper lives on the **container** only. This keeps items stateless DOM strings — maximally easy for the dev team to re-render from PHTML or from `<template x-for>`.

---

## 11. Open questions

All logged in `design-tokens/questions.md`:

- **#22 — DL-1:** No `focus` (roving) variant in Figma. Is Hover styling (`bg-blue.50`) acceptable as the roving-focus visual, or does focus need a distinct treatment (e.g. 2px `blue.500` inset ring)?
- **#23 — DL-2:** Selected state uses color inversion only — no trailing check icon. Confirm visual is sufficient (a11y-wise color alone is weak; `aria-selected` covers screen readers but sighted low-vision users benefit from a check glyph).
- **#24 — DL-3:** Container max-height not defined in Figma. Confirm policy (fixed `max-h-60`, fluid viewport-based, or exposed as a prop?).
- **#25 — DL-4:** No inter-item separators — confirm intentional.
- **#26 — DL-5:** Items' hover/selected bg extends to container edges flush (relies on `overflow-clip`); no first/last-item radius matching. Confirm acceptable.
- **#27 — DL-6:** No empty / loading state designed. Confirm whether A-basic needs either; if yes, provide Figma references.
