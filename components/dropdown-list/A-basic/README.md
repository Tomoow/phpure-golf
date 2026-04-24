# Dropdown list — A-basic

## Overview

A floating menu panel — the popup surface a combobox, country selector, or custom select opens. The molecule is CSS (styled `<ul>` + `<li>` utilities) plus a tiny Alpine constructor that owns keyboard navigation, selection, and the `open` / `close` lifecycle. The **trigger lives with the consumer** (typically a `<button class="form-field">` in a combobox); this component contributes the panel and the options.

## Figma nodes

- List container: `1343:42718`
- List item: `1343:42177`

## CSS utilities

| Utility | Purpose |
|---|---|
| `dropdown-list` | The panel: `<ul role="listbox">`. White background, `Shadow/lg`, rounded corners, `max-height: 320px` with vertical scroll, padding-block. |
| `dropdown-list__item` | One selectable row (`<li role="option">`). CSS-variable-driven (`--item-bg`, `--item-color`). State selectors respond to `[data-active="true"]` (keyboard-highlighted), `[aria-selected="true"]` (selected), `[aria-disabled="true"]` (disabled), and `:hover`. |
| `dropdown-list__leading` | 24×24 flex slot before the label — for icons, flags, avatars. Inherits `currentColor`; images inside get `object-fit: cover` + `--radius-sm`. |
| `dropdown-list__label` | The main text. Fills available space, single-line, truncates with ellipsis. |
| `dropdown-list__trailing` | 20×20 flex slot after the label — for check glyph (when `aria-selected="true"`, this picks up `deep-emerald-green-500`), hint text, or chevron. |
| `dropdown-list__divider` | `<li role="separator">` — 1 px slate-blue-100 rule between items. |
| `dropdown-list__empty` | `<li role="presentation">` — centered "No results" placeholder, slate-blue-400, not clickable. |
| `dropdown-list__loading` | `<li role="presentation">` — centered "Loading…" placeholder, same styling. |

## States

- **Default** — `slate-blue-800` text on white.
- **Hover** / **Active (keyboard-highlighted, `data-active="true"`)** — `slate-blue-50` background, same text. Hover and roving focus share a single visual (designer decision Q#22).
- **Selected (`aria-selected="true"`)** — text swaps to `deep-emerald-green-500`, weight 500. Trailing check glyph (Heroicons outline-24 `check`) appears in the same emerald color.
- **Disabled (`aria-disabled="true"`)** — `slate-blue-300` text, `cursor: not-allowed`, `pointer-events: none` so clicks are no-ops.

## Alpine API

Constructor: `initDropdownList` (registered via `Alpine.data(...)` in `dropdown-list.js`). Attach to the `<ul class="dropdown-list">` with `x-data="initDropdownList"`.

### State

| Property | Type | Purpose |
|---|---|---|
| `open` | `boolean` | Whether the panel is shown (bindable to consumer's open state via events). |
| `activeIndex` | `number` | Index of the keyboard-highlighted option. `-1` when nothing is active. |
| `selectedValue` | `string \| null` | The currently selected option's `data-value`. |
| `items` | `Array<{ value, label, disabled, el }>` | Populated by `init()` from the DOM. |

### Methods

| Method | Called from |
|---|---|
| `openList()`, `closeList()`, `toggle()` | Consumer's open trigger. |
| `handleKeydown($event)` | `@keydown` on the `<ul>` — dispatches arrow-up/down, Home/End, Enter/Space, Escape. |
| `focusNext()`, `focusPrev()`, `focusFirst()`, `focusLast()` | Direct calls, skip disabled items. |
| `selectActive()` | Called by Enter/Space keydown. |
| `select()` | Bound to each `<li>`'s `@click`. Reads `event.target.closest('[role="option"]').dataset.value`. |
| `selectValue(value, targetEl)` | Programmatic select (e.g. outer combobox calls this directly). |
| `isActive(i)`, `isSelected(v)` | For `:class` / `:data-active` / `:aria-selected` bindings. |
| `hasItems()` | Used by empty-state rendering. |

### Events dispatched

All events bubble through the DOM; consumers listen on a wrapping element (e.g. the combobox).

| Event | Detail |
|---|---|
| `dropdown:open` | — |
| `dropdown:close` | `{ reason: 'select' \| 'escape' \| 'outside' \| 'toggle' }` |
| `dropdown:select` | `{ value, label }` |
| `dropdown:highlight` | `{ index, value }` |

## Accessibility

- Container: `role="listbox"`, `aria-label` (or `aria-labelledby` pointing at an external label).
- Items: `role="option"`, `aria-selected="true \| false"`, `aria-disabled="true"` when applicable, unique `id` so a combobox can point `aria-activedescendant` at the currently highlighted option.
- Keyboard map:
  - **Arrow Down** → focusNext
  - **Arrow Up** → focusPrev
  - **Home** → focusFirst
  - **End** → focusLast
  - **Enter / Space** → selectActive
  - **Escape** → closeList
- Empty / loading placeholders use `role="presentation"` so they are not announced as options.

## Usage

### Static — no JS (just styled panel)

```html
<ul class="dropdown-list" role="listbox" aria-label="Size">
  <li class="dropdown-list__item" role="option" aria-selected="true">
    <span class="dropdown-list__label">Medium</span>
    <span class="dropdown-list__trailing">
      <svg class="size-5" aria-hidden="true">…check…</svg>
    </span>
  </li>
  <li class="dropdown-list__item" role="option">
    <span class="dropdown-list__label">Large</span>
  </li>
  <li class="dropdown-list__item" role="option" aria-disabled="true">
    <span class="dropdown-list__label">X-Large (out of stock)</span>
  </li>
</ul>
```

### Alpine-wired — typical combobox

```html
<div class="combobox"
     x-data="{ label: 'Select a country', open: false }"
     x-on:dropdown:select="label = $event.detail.label; open = false"
     x-on:click.outside="open = false">
  <button type="button" class="form-field"
          aria-haspopup="listbox"
          x-bind:aria-expanded="open"
          x-on:click="open = !open"
          x-on:keydown.escape="open = false"
          x-on:keydown.down.prevent="open = true">
    <span class="form-field__input" x-text="label"></span>
    <span class="form-field__affix" aria-hidden="true">
      <svg class="size-5">…chevron-down…</svg>
    </span>
  </button>
  <div class="combobox__panel" x-show="open" x-cloak>
    <ul class="dropdown-list" role="listbox" aria-label="Country"
        x-data="initDropdownList">
      <li class="dropdown-list__item" role="option"
          data-value="be" data-label="Belgium"
          x-on:click="selectValue('be', $event.currentTarget)">
        <span class="dropdown-list__label">Belgium</span>
      </li>
      <!-- … -->
    </ul>
  </div>
</div>
```

### Empty + loading states

```html
<ul class="dropdown-list" role="listbox" aria-busy="true">
  <li class="dropdown-list__loading" role="presentation">Loading…</li>
</ul>

<ul class="dropdown-list" role="listbox">
  <li class="dropdown-list__empty" role="presentation">No results</li>
</ul>
```

## Dependencies

- **Alpine.js v3** with the `@alpinejs/focus` plugin (already bundled in `/src/js/alpine.js`).
- **Heroicons outline-24** for the selected-state check glyph.
- Tokens from `src/css/theme.css`: `--color-white`, `--color-slate-blue-{50,100,300,500,800}`, `--color-deep-emerald-green-500`, `--radius-md`, `--radius-sm`, `--shadow-shadow\/lg`, `--spacing-*`.

## CSP notes

- The constructor is a **named global function** registered via `Alpine.data('initDropdownList', initDropdownList)` on `alpine:init`. Defensive registration also runs eagerly if `window.Alpine` is already present, so the module works regardless of script-tag order.
- All event handlers use Alpine `@` / `x-on:` directives. Zero inline `onclick`, zero inline `<script>` blocks.
- Method calls in templates pass arguments via positional args to `selectValue(value, element)`; for stricter CSP-Alpine builds, switch to `@click="select"` (no args) and let the method read `event.target.closest('[role="option"]').dataset.value` — both patterns are implemented in the JS.

## Decision log (resolves `design-tokens/questions.md` #22–#27)

| ID | Decision |
|---|---|
| Q#22 Roving-focus visual | Hover and `data-active` share one visual: `slate-blue-50` background. |
| Q#23 Selected check glyph | Heroicons outline-24 `check`. Color = `deep-emerald-green-500`. |
| Q#24 Max-height policy | 320 px (≈ 8–10 items at normal row height). `overflow-y: auto`, OS-default scrollbar. |
| Q#25 Dividers | Opt-in via `<li class="dropdown-list__divider" role="separator">`. 1 px `slate-blue-100`. |
| Q#26 First/last radius | Container has `border-radius` + `overflow: hidden`; items sit flush. |
| Q#27 Empty / loading states | Two opt-in slots: `dropdown-list__empty` and `dropdown-list__loading`. Both use `role="presentation"` so screen readers don't announce them as options. |

## Future work

- Typeahead / incremental search — the Alpine API has a `searchBuffer` placeholder but no keystroke handler wired yet. Add when a concrete consumer (country selector with 200+ entries) needs it.
- Virtualized rendering for very long lists (>200 items) — currently every option is in the DOM.
- Portal rendering for dropdowns that need to escape an overflow-clipping ancestor — the preview uses a simple absolutely-positioned panel; real consumers may want Floating UI or similar.
